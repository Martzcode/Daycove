import { AfterViewInit, Directive, ElementRef, HostListener, inject, input, output } from '@angular/core';

@Directive({
  selector: '[appRichText]',
  exportAs: 'appRichText',
  standalone: true,
})
export class RichTextDirective implements AfterViewInit {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly appRichText = input<string>('');
  readonly appRichTextChange = output<string>();

  ngAfterViewInit(): void {
    const value = this.appRichText();
    if (value && this.el.nativeElement.innerHTML !== value) {
      this.el.nativeElement.innerHTML = value;
    }
  }

  @HostListener('input')
  onInput(): void {
    this.appRichTextChange.emit(this.el.nativeElement.innerHTML);
  }

  exec(command: string): void {
    this.el.nativeElement.focus();
    document.execCommand(command, false);
    this.appRichTextChange.emit(this.el.nativeElement.innerHTML);
  }
}