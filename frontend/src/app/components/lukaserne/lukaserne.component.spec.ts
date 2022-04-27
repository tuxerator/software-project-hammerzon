import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LukaserneComponent } from './lukaserne.component';

describe('LukaserneComponent', () => {
  let component: LukaserneComponent;
  let fixture: ComponentFixture<LukaserneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LukaserneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LukaserneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
