import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BlockUiService } from './block-ui.service';

@Component({
  selector: 'app-ui-blocker',
  template: `
    <div class="block-ui" *ngIf="msgKey$ | async as msgKey">
        <div class="row block-ui-inner">
            <div class="col-1 col-sm-2 col-md-3 col-lg-4"></div>
            <div class="col-10 col-sm-8 col-md-6 col-lg-4">
                <div class="block-ui-component">
                    <table>
                        <tr>
                            <td class="block-ui-image"></td>
                            <td class="block-ui-text">{{msgKey | translate}}</td>
                        <tr>
                    </table>
                </div>
            </div>
        </div>
    </div>
    `
})
export class BlockUiComponent implements OnInit {
  msgKey$: Observable<string>;

  constructor(private uiBlockerService: BlockUiService) {}

  ngOnInit() {
    this.msgKey$ = this.uiBlockerService.getBlockStatus();
  }
}
