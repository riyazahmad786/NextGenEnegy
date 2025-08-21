import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadingSourceComponent } from './reading-source.component';

describe('ReadingSourceComponent', () => {
  let component: ReadingSourceComponent;
  let fixture: ComponentFixture<ReadingSourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReadingSourceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReadingSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
