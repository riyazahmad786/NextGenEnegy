import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IzDataTableComponent } from './iz-data-table.component';

describe('IzDataTableComponent', () => {
  let component: IzDataTableComponent<any>;
  let fixture: ComponentFixture<IzDataTableComponent<any>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IzDataTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IzDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
