import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NtmTableDataComponent } from './ntm-table-data.component';

describe('NtmTableDataComponent', () => {
  let component: NtmTableDataComponent;
  let fixture: ComponentFixture<NtmTableDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NtmTableDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NtmTableDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
