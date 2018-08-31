import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NotificationService } from '../../notifications/notification.service';

@Component({
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, AfterViewInit {
  constructor(private notiService: NotificationService) {}

  ngOnInit() {
    this.notiService.showUiBlocker();
  }

  ngAfterViewInit() {
    this.notiService.hideUiBlocker();
  }
}
