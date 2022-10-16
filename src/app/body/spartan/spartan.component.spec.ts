import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpartanComponent } from './spartan.component';

describe('SpartanComponent', () => {
  let component: SpartanComponent;
  let fixture: ComponentFixture<SpartanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpartanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpartanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
