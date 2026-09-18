import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TitleBar } from './components/title-bar/title-bar';
import { Sidebar } from './components/sidebar/sidebar';
import { installContextMenuGuard } from './context-menu-guard';
import { installZoomGuard } from './gesture-guard';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TitleBar, Sidebar],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  constructor() {
    installZoomGuard();
    installContextMenuGuard();
  }
}