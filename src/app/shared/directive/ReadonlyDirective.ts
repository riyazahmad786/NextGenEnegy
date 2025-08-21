import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appReadonly]',
  standalone: true,
})
export class ReadonlyDirective {
  constructor(private el: ElementRef) {}

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // Prevent input if readonly
    if (this.el.nativeElement.readOnly) {
      event.preventDefault();
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    // Prevent paste if readonly
    if (this.el.nativeElement.readOnly) {
      event.preventDefault();
    }
  }

  // Additional HostListeners as needed (e.g., 'cut', 'drop', etc.)
}
