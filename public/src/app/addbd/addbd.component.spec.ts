import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddbdComponent } from './addbd.component';

describe('AddbdComponent', () => {
  let component: AddbdComponent;
  let fixture: ComponentFixture<AddbdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddbdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddbdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
