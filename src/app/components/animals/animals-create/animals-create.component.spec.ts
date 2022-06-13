import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimalsCreateComponent } from './animals-create.component';

describe('AnimalsCreateComponent', () => {
    let component: AnimalsCreateComponent;
    let fixture: ComponentFixture<AnimalsCreateComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AnimalsCreateComponent]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AnimalsCreateComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
