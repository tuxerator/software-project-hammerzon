import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderedServicesComponent } from './ordered-services.component';

describe('OrderedServicesComponent', () => {
  let component: OrderedServicesComponent;
  let fixture: ComponentFixture<OrderedServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderedServicesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderedServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
