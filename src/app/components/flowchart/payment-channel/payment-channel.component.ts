import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  NgFlowchart,
  NgFlowchartStepComponent,
  NgFlowchartCanvasDirective,
} from '@joelwenzel/ng-flowchart';
import { MatDialog } from '@angular/material/dialog';

import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-payment-channel',
  templateUrl: './payment-channel.component.html',
  styleUrls: ['./payment-channel.component.scss'],
})
export class PaymentChannelComponent
  extends NgFlowchartStepComponent
  implements OnInit, OnDestroy, AfterViewInit, OnChanges
{
  @ViewChild(NgFlowchartCanvasDirective)
  paymentMethodCanvas!: NgFlowchartCanvasDirective;

  NODE_NAME = 'Payment Channel';
  nameChanged: boolean = false;

  paymentChannels = [
    'ACH',
    'Wire',
    'SEPA',
    'SWIFT',
    'FedWire',
    'CHAPS',
    'BACS',
    'FPS',
  ];

  constructor(public dialog: MatDialog) {
    super();
  }

  override ngOnInit() {
    super.ngOnInit();
    // Logic here, e.g. fetch data from an API
  }

  override ngAfterViewInit() {
    super.ngAfterViewInit();

    if (this.data.type === 'payment-channel' && !this.data.channels){
      this.dialog
        .open(DialogComponent, {
          data: {
            type: 'select-many',
            list: this.paymentChannels,
            label: 'Payment Channel',
            title: 'Select Payment Channel',
          },

          hasBackdrop: true,
          width: '500px',
        })
        .afterClosed()
        .subscribe((result: any) => {
          this.setData(result);
        });
      }
  }

  ngOnDestroy() {
    this.paymentMethodCanvas?.getFlow().clear();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('changes', changes);
    this.canvas.reRender();
  }

  override canDrop(dropEvent: NgFlowchart.DropTarget): boolean {
    return true;
  }

  overridecanDeleteStep(): boolean {
    return true;
  }

  setData(result: any): void {
    if (result) {
      this.data.channels = result.map((item: string) => {
        return { name: item, active: false };
      });
      this.nameChanged = true;
    } else {
      this.destroy();
    }
    setTimeout(() => {
      this.canvas.reRender();
    }, 100);
  }

  onActiveChange(event: any, index: number): void {
    const isChecked = event.target.checked;
    this.data.channels[index].active = isChecked;
  }
}
