import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalProfileComponent } from './personalprofile.component';

describe('PerfileComponent', () => {
  let component: PersonalProfileComponent;
  let fixture: ComponentFixture<PersonalProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PersonalProfileComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
