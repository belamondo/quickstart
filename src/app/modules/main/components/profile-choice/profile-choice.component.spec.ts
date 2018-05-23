import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileChoiceComponent } from './profile-choice.component';

describe('ProfileChoiceComponent', () => {
  let component: ProfileChoiceComponent;
  let fixture: ComponentFixture<ProfileChoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileChoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileChoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
