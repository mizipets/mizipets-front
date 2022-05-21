import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseAccountPopUpComponent } from './close-account-pop-up.component';

describe('CloseAccountPopUpComponent', () => {
  let component: CloseAccountPopUpComponent;
  let fixture: ComponentFixture<CloseAccountPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CloseAccountPopUpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CloseAccountPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
