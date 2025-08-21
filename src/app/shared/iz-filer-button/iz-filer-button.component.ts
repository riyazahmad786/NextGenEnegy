import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-iz-filer-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      type="button"
      class="btn btn-labeled btn-outline-secondary"
      [ngClass]="{ active: isActive }"
      [disabled]="isDisabled == false ? false : true"
      (click)="onClick()"
    >
      <span class="btn-label"><i class="{{ iconClass }} icon-size"></i></span
      >{{ label }}
    </button>
  `,
  styleUrl: './iz-filer-button.component.css',
})
export class IzFilerButtonComponent {
  @Input() label: string | undefined;
  @Input() iconClass: string | undefined;
  @Input() isActive: boolean | undefined;
  @Input() isDisabled: boolean = false; // Default value
  @Output() typeSelected = new EventEmitter<string>();

  onClick(): void {
    this.typeSelected.emit(this.label);
  }
}
