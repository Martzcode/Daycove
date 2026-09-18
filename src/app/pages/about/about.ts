import { Component, inject, signal } from '@angular/core';
import { getVersion } from '@tauri-apps/api/app';
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

  protected readonly version = signal<string>(AboutPage.formatVersion('0.0.0'));
  protected readonly authorUrl = 'https://github.com/Martzcode';
  protected readonly sourceUrl = 'https://github.com/Martzcode/Daycove';

  constructor() {
    void getVersion().then((value) => this.version.set(AboutPage.formatVersion(value)));
  }

  protected openAuthor(): void {
    void open(this.authorUrl);
  }

  protected openSource(): void {
    void open(this.sourceUrl);
  }

  private static formatVersion(value: string): string {
    const parts = value.split('.');
    const [major, minor, patch] = [parts[0], parts[1], parts[2]].map((part) =>
      Number(part ?? 0),
    );
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(major)}.${pad(minor)}.${pad(patch)}`;
  }
}