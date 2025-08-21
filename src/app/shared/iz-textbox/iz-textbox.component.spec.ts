import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IzTextboxComponent } from './iz-textbox.component';

describe('IzTextboxComponent', () => {
  let component: IzTextboxComponent;
  let fixture: ComponentFixture<IzTextboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IzTextboxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IzTextboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
