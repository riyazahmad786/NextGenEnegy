import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IzFilerButtonComponent } from './iz-filer-button.component';

describe('IzFilerButtonComponent', () => {
  let component: IzFilerButtonComponent;
  let fixture: ComponentFixture<IzFilerButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IzFilerButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IzFilerButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
