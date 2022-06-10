import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimalDeleteModalComponent } from './animal-delete-modal.component';

describe('AnimalDeleteModalComponent', () => {
  let component: AnimalDeleteModalComponent;
  let fixture: ComponentFixture<AnimalDeleteModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnimalDeleteModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnimalDeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
