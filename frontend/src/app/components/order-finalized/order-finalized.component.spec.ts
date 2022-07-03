import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderFinalizedComponent } from './order-finalized.component';

describe('OrderFinalizedComponent', () => {
  let component: OrderFinalizedComponent;
  let fixture: ComponentFixture<OrderFinalizedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderFinalizedComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderFinalizedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
