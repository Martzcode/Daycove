#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .setup(|app| {
      #[cfg(target_os = "macos")]
      disable_pinch_zoom(app.handle());

      #[cfg(any(
        target_os = "linux",
        target_os = "dragonfly",
        target_os = "freebsd",
        target_os = "openbsd",
        target_os = "netbsd"
      ))]
      disable_native_zoom(app.handle());

      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      app.handle().plugin(tauri_plugin_shell::init())?;
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

#[cfg(target_os = "macos")]
fn disable_pinch_zoom(app: &tauri::AppHandle) {
  use objc2::rc::autoreleasepool;
  use objc2_app_kit::{NSView, NSWindow};
  use objc2_foundation::NSArray;
  use objc2_web_kit::WKWebView;
  use tauri::Manager;

  if let Some(window) = app.get_webview_window("main") {
    autoreleasepool(|_| {
      let Some(window) = window.ns_window().ok().map(|ptr| ptr as *mut NSWindow) else {
        return;
      };
      // SAFETY: `ns_window` returns a valid pointer to the NSWindow of the webview.
      let ns_window = unsafe { &*window };
      let Some(content_view) = ns_window.contentView() else {
        return;
      };
      let subviews: &NSArray<NSView> = &content_view.subviews();
      let Some(first_subview) = (unsafe { subviews.firstObject_unchecked() }) else {
        return;
      };
      let wkwebview = first_subview as *const NSView as *const WKWebView;
      // SAFETY: the first subview of the window content is the WKWebView.
      let wkwebview = unsafe { &*wkwebview };
      // Disable native pinch-to-zoom magnification.
      // SAFETY: `setAllowsMagnification:` is a valid WKWebView selector.
      unsafe { wkwebview.setAllowsMagnification(false) };
    });
  }
}

#[cfg(any(
  target_os = "linux",
  target_os = "dragonfly",
  target_os = "freebsd",
  target_os = "openbsd",
  target_os = "netbsd"
))]
fn disable_native_zoom(app: &tauri::AppHandle) {
  use tauri::Manager;

  let Some(window) = app.get_webview_window("main") else {
    return;
  };

  let _ = window.as_ref().with_webview(|platform_webview| {
    use glib::prelude::*;
    use gtk::prelude::*;

    let webview = platform_webview.inner();

    // Block Ctrl + scroll wheel at the GTK level so WebKitGTK never sees it
    // (WebKitGTK zooms natively on control-scroll). Normal scrolling is kept.
    webview.connect_scroll_event(|_widget, event| {
      if event.state().contains(gdk::ModifierType::CONTROL_MASK) {
        glib::Propagation::Stop
      } else {
        glib::Propagation::Proceed
      }
    });

    // Best-effort removal of WebKitGTK's internal "wk-view-zoom-gesture"
    // handler, which performs native pinch-to-zoom (touchpad + touchscreen).
    // We only destroy its signal handlers, never the data itself (freeing it
    // triggers a segfault when events are prevented from JavaScript).
    let Some(zoom_gesture) = (unsafe { webview.data::<gobject_sys::GObject>("wk-view-zoom-gesture") }) else {
      return;
    };
    // SAFETY: the data is the `GtkGestureZoom` GObject created by WebKitGTK,
    // so destroying its signal handlers disconnects the zoom callbacks.
    unsafe { gobject_sys::g_signal_handlers_destroy(zoom_gesture.as_ptr()) };
  });
}
