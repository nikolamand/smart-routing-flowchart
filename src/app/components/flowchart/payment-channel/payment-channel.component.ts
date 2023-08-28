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
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { DialogComponent } from '../dialog/dialog.component';
import { AppState } from 'src/app/store/flowchart.reducer';
import { stepUpdated } from 'src/app/store/flowchart.actions';
import { PaymentChannelModalComponent } from './payment-channel-modal/payment-channel-modal.component';

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
  paymentChannelCanvas!: NgFlowchartCanvasDirective;

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

  constructor(
    public dialog: MatDialog,
    public snackbar: MatSnackBar,
    private store: Store<AppState>
  ) {
    super();
  }

  override ngOnInit() {
    super.ngOnInit();
  }

  override ngAfterViewInit() {
    super.ngAfterViewInit();
  }

  ngOnDestroy() {
    this.paymentChannelCanvas?.getFlow().clear();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.canvas.reRender();
  }

  override canDrop(dropEvent: NgFlowchart.DropTarget): boolean {
    console.log(
      'dropEvent',
      dropEvent,
      ['currency', 'restrictions'].includes(dropEvent?.step?.type)
    );
    let canDrop = true;

    if (!dropEvent) {
      canDrop = false;
    }

    if (dropEvent?.position === 'ABOVE') {
      canDrop = false;
    }

    if (
      !['currency', 'restrictions'].includes(dropEvent?.step?.type) &&
      dropEvent?.position === 'BELOW'
    ) {
      canDrop = false;
    }

    if (['RIGHT', 'LEFT'].includes(dropEvent?.position)) {
      canDrop = false;
    }

    if (!canDrop) {
      this.snackbar.open('Invalid drop', 'Close', {
        duration: 3000,
      });
    }

    if (canDrop) {
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

    return canDrop;
  }

  overridecanDeleteStep(): boolean {
    return true;
  }

  setData(result: any): void {
    if (result) {
      this.data.channels = {
        fields: result.map((item: string) => {
          return { value: item, isActive: "Active", key: 'PaymentChannelName' };
        }),
      };
      this.nameChanged = true;
      this.store.dispatch(stepUpdated());
    } else {
      this.destroy();
    }
    setTimeout(() => {
      this.canvas.reRender();
    }, 100);
  }

  editStep() {
    console.log('editStep', this.data);
    this.dialog
      .open(PaymentChannelModalComponent, {
        data: {
          step: this,
          label: 'Payment Channels',
          title: 'Edit Payment Channels',
          data: this.data,
        },

        hasBackdrop: true,
        width: '500px',
      })
      .afterClosed()
      .subscribe((result: any) => {
      });
  }
}
