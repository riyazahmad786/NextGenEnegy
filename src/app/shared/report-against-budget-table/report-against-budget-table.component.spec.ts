import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportAgainstBudgetTableComponent } from './report-against-budget-table.component';

describe('ReportAgainstBudgetTableComponent', () => {
  let component: ReportAgainstBudgetTableComponent;
  let fixture: ComponentFixture<ReportAgainstBudgetTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportAgainstBudgetTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportAgainstBudgetTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
