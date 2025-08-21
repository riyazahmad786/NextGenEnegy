import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AppState } from '../../../../core/utils/report-types-utils';
import { AppStateService } from '../../../../shared/service/app-state.service';
import { ActionService } from '../../services/action.service';
import { DailyEleConsumptionComponent } from '../daily-ele-consumption/daily-ele-consumption.component';

@Component({
  selector: 'app-actions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './actions.component.html',
  styleUrl: './actions.component.css',
})
export class ActionsComponent implements OnInit {
  showMessage: boolean = false; // Controls when the popup is visible
  selectedAction: string = ''; // Stores the selected action name

  @ViewChild(DailyEleConsumptionComponent)
  dailyEleConsumptionComponent!: DailyEleConsumptionComponent;
  constructor(
    private actionService: ActionService,
    private appState: AppStateService
  ) {}
  actionType: string = '';
  ngOnInit(): void {
    this.setSelectedIndex();
  }
  showComingSoon(action: string): void {
    this.selectedAction = action;
    this.showMessage = true;
  }

  // Close the modal
  closeModal(): void {
    this.showMessage = false;
  }

  actionSelect(type: string): void {
    this.appState.addParameter(AppState.ActionType, type);
    this.setSelectedIndex();
  }

  setSelectedIndex(): void {
    const actionName = this.appState.getParameter(AppState.ActionType);
    const location = this.appState.getParameter(AppState.LocationData);
    this.actionType = actionName;
    this.appState.addParameter(AppState.ActionType, this.actionType);
    this.actionService.triggerReloadParams(this.actionType);
  }
}
