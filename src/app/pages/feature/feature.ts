import { Component, DestroyRef, inject, type OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-feature',
  templateUrl: './feature.html',
  styleUrl: './feature.scss',
})
export class FeaturePage implements OnInit {
  protected readonly title = signal('');

  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  public ngOnInit(): void {
    this.route.data.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((data) => {
      this.title.set((data['title'] as string | undefined) ?? '');
    });
  }
}