import { Component, input, output, signal, type OnDestroy } from '@angular/core';
import { getCurrentWindow, type Window } from '@tauri-apps/api/window';
import { isTauri } from '@tauri-apps/api/core';

@Component({
  selector: 'app-title-bar',
  templateUrl: './title-bar.html',
  styleUrl: './title-bar.scss',
})
export class TitleBar implements OnDestroy {
  readonly sidebarOpen = input(true);
  readonly toggleSidebar = output<void>();
  protected readonly isMaximized = signal(false);

  private readonly appWindow?: Window;
  private readonly unlisteners: Array<() => void> = [];

  constructor() {
    if (!isTauri()) {
      return;
    }
    this.appWindow = getCurrentWindow();
    void this.refreshMaximized();
    void this.bindResize();
  }

  private async refreshMaximized(): Promise<void> {
    if (!this.appWindow) {
      return;
    }
    this.isMaximized.set(await this.appWindow.isMaximized());
  }

  private async bindResize(): Promise<void> {
    if (!this.appWindow) {
      return;
    }
    const unlisten = await this.appWindow.onResized(() => void this.refreshMaximized());
    this.unlisteners.push(unlisten);
  }

  protected async onMinimize(): Promise<void> {
    await this.appWindow?.minimize();
  }

  protected async onToggleMaximize(): Promise<void> {
    await this.appWindow?.toggleMaximize();
  }

  protected onDblClickHeader(): void {
    void this.onToggleMaximize();
  }

  protected async onClose(): Promise<void> {
    await this.appWindow?.close();
  }

  public ngOnDestroy(): void {
    for (const unlisten of this.unlisteners) {
      unlisten();
    }
  }
}