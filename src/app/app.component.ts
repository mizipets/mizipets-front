import { Component, OnInit } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    isMobileDevice: boolean = false;
    
    constructor (
        private deviceService: DeviceDetectorService) {}

    ngOnInit(): void {
        if (this.deviceService.isMobile() || this.deviceService.isTablet())
            this.isMobileDevice = true;
        else this.isMobileDevice = false;
    }
}
