import { Component, OnInit } from '@angular/core';
// @ts-ignore
import device_detect from 'device-detect';

const deviceDetect = device_detect();

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    isMobileDevice: boolean = false;
    mobileDevices: string[] = [
        'iPhone',
        'iPad',
        'iPod',
        'Blackberry',
        'WindowsMobile',
        'Android'
    ];

    ngOnInit(): void {
        const currentDevice = deviceDetect.device;
        this.mobileDevices.includes(currentDevice)
            ? (this.isMobileDevice = true)
            : (this.isMobileDevice = false);
    }
}
