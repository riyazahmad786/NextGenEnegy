import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appTooltip]',
  standalone: true,
})
export class TooltipDirective {
  @Input() tooltipTextColor: string = 'white';
  @Input() tooltipText: string = '';
  @Input() userName: string = '';
  @Input() placement: string = 'bottom'; // Default placement value

  constructor(private el: ElementRef) {}

  tooltipTimeout: ReturnType<typeof setTimeout> | null = null;
  tooltipVisible: boolean = false;

  @HostListener('mouseenter') onMouseEnter() {
    if (this.tooltipTimeout) {
      clearTimeout(this.tooltipTimeout);
    }
    this.tooltipTimeout = setTimeout(() => {
      this.showTooltip();
    }, 2000); // Show tooltip after 2 seconds of mouse stop
  }

  @HostListener('mouseleave') onMouseLeave() {
    if (this.tooltipTimeout) {
      clearTimeout(this.tooltipTimeout);
    }
    if (this.tooltipVisible) {
      this.hideTooltip();
    }
  }

  private showTooltip(): void {
    const tooltip = document.createElement('div');
    // tooltip.classList.add('tooltip');
    //tooltip.textContent = this.tooltipText || 'Default Tooltip Text'; // Use textContent to set text content
    tooltip.style.position = 'absolute';
    tooltip.style.backgroundColor = 'rgba(60, 64, 67, .9)';
    tooltip.style.color = 'white';
    tooltip.style.width = '200px';
    //tooltip.style.height = '50px';
    tooltip.style.whiteSpace = 'nowrap';
    tooltip.style.borderRadius = '4px';
    tooltip.style.transition = 'opacity 0.3s ease-in-out';
    tooltip.style.zIndex = '9999'; // Ensure tooltip is above other elements

    const span = document.createElement('span');
    // span.textContent = this.tooltipText || 'Default Tooltip Content';
    span.innerHTML =
      "<span style='display: block; padding-left: 5px;  padding-top: 5px;'>" +
      this.userName +
      "</span><span style='display: block; padding: 5px;'>" +
      this.tooltipText +
      '</span>';
    // Applying custom padding
    span.style.color = 'white'; // Example of changing text color
    span.style.fontSize = '14px';
    tooltip.appendChild(span);
    const rect = this.el.nativeElement.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();

    let left = rect.left + window.pageXOffset - 3;
    let top = rect.bottom + window.pageYOffset;

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;

    document.body.appendChild(tooltip);

    this.el.nativeElement.addEventListener('mouseleave', () => {
      this.tooltipVisible = false;
      document.body.removeChild(tooltip);
    });
  }

  private hideTooltip(): void {
    const tooltip = document.querySelector('.tooltip');
    if (tooltip) {
      document.body.removeChild(tooltip);
    }
  }
}
