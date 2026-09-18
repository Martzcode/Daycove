import { Component, inject } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { open } from '@tauri-apps/plugin-shell';
import { I18n } from '../../i18n';

@Component({
  selector: 'app-about',
  imports: [LucideAngularModule],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class AboutPage {
  protected readonly i18n = inject(I18n);

  protected readonly version = '0.1.0';
  protected readonly authorUrl = 'https://github.com/Martzcode';
  protected readonly sourceUrl = 'https://github.com/Martzcode/Daycove';

  protected openAuthor(): void {
    void open(this.authorUrl);
  }

  protected openSource(): void {
    void open(this.sourceUrl);
  }
}