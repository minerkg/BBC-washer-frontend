import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookableUnitsComponent } from './bookable-units.component';

describe('BookableUnitsComponent', () => {
  let component: BookableUnitsComponent;
  let fixture: ComponentFixture<BookableUnitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookableUnitsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BookableUnitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
