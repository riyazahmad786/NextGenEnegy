import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IzDropdownComponent } from './iz-dropdown.component';

describe('IzDropdownComponent', () => {
  let component: IzDropdownComponent;
  let fixture: ComponentFixture<IzDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IzDropdownComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IzDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
