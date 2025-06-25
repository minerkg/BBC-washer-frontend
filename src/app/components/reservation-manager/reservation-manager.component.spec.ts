import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationManagerComponent } from './reservation-manager.component';

describe('ReservationManagerComponent', () => {
  let component: ReservationManagerComponent;
  let fixture: ComponentFixture<ReservationManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationManagerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReservationManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
