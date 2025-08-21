import { CommonModule } from '@angular/common';
import { Component, ContentChild, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-collapsible-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './collapsible-panel.component.html',
  styleUrl: './collapsible-panel.component.css',
})
export class CollapsiblePanelComponent {
  @Input() title: string = 'Default Title';
  @Input() isCollapsed = true;

  @ContentChild('panelContent', { static: false })
  panelContent!: TemplateRef<any>;

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
  }
}
