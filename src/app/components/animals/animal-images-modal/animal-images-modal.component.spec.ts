import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimalImagesModalComponent } from './animal-images-modal.component';

describe('AnimalImagesModalComponent', () => {
    let component: AnimalImagesModalComponent;
    let fixture: ComponentFixture<AnimalImagesModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AnimalImagesModalComponent]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AnimalImagesModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
