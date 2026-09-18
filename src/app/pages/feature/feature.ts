import { Component, DestroyRef, computed, inject, signal, type OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { I18n } from '../../i18n';

@Component({
  selector: 'app-feature',
  templateUrl: './feature.html',
  styleUrl: './feature.scss',
})
export class FeaturePage implements OnInit {
  protected readonly titleKey = signal('');
  protected readonly title = computed(() => this.i18n.translate(this.titleKey()));
  protected readonly i18n = inject(I18n);

  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  public ngOnInit(): void {
    this.route.data.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((data) => {
      this.titleKey.set((data['titleKey'] as string | undefined) ?? '');
    });
  }
}