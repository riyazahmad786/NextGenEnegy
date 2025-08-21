import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectFromDeviceComponent } from './direct-from-device.component';

describe('DirectFromDeviceComponent', () => {
  let component: DirectFromDeviceComponent;
  let fixture: ComponentFixture<DirectFromDeviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DirectFromDeviceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DirectFromDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
