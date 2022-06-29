import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseAccountModalComponent } from './close-account-modal.component';

describe('CloseAccountPopUpComponent', () => {
    let component: CloseAccountModalComponent;
    let fixture: ComponentFixture<CloseAccountModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CloseAccountModalComponent]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CloseAccountModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
