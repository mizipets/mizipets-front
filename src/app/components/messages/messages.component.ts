import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
  /**
   * Pass value to true to activate the spinner
   */
  isLoading: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
