import { ElementRef } from '@angular/core';
import { TooltipDirective } from './tooltip.directive';

describe('TooltipDirective', () => {
  it('should create an instance', () => {
    const mockElementRef = new ElementRef(document.createElement('div'));
    const directive = new TooltipDirective(mockElementRef); // ✅ argument pass किया
    expect(directive).toBeTruthy();
  });
});
