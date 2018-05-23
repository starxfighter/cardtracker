import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddanvComponent } from './addanv.component';

describe('AddanvComponent', () => {
  let component: AddanvComponent;
  let fixture: ComponentFixture<AddanvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddanvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddanvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
