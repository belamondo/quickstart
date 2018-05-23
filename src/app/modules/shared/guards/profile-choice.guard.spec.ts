import { TestBed, async, inject } from '@angular/core/testing';

import { ProfileChoiceGuard } from './profile-choice.guard';

describe('ProfileChoiceGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProfileChoiceGuard]
    });
  });

  it('should ...', inject([ProfileChoiceGuard], (guard: ProfileChoiceGuard) => {
    expect(guard).toBeTruthy();
  }));
});
