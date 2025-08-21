import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoadingBarComponent } from './boading-bar.component';

describe('BoadingBarComponent', () => {
  let component: BoadingBarComponent;
  let fixture: ComponentFixture<BoadingBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoadingBarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BoadingBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
