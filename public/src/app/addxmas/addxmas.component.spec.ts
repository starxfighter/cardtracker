import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddxmasComponent } from './addxmas.component';

describe('AddxmasComponent', () => {
  let component: AddxmasComponent;
  let fixture: ComponentFixture<AddxmasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddxmasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddxmasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
