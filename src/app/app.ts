import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TitleBar } from './components/title-bar/title-bar';
import { Sidebar } from './components/sidebar/sidebar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TitleBar, Sidebar],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly sidebarOpen = signal(true);
}