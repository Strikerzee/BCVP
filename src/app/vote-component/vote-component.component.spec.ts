import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoteComponentComponent } from './vote-component.component';

describe('VoteComponentComponent', () => {
  let component: VoteComponentComponent;
  let fixture: ComponentFixture<VoteComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoteComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoteComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
