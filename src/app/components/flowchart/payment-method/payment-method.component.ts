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

export type NestedData = {
  nested: any;
};

@Component({
  selector: 'payment-method-step',
  templateUrl: './payment-method.component.html',
  styleUrls: ['./payment-method.component.scss'],
})
export class PaymentMethodComponent
  extends NgFlowchartStepComponent
  implements OnInit, OnDestroy, AfterViewInit, OnChanges
{
  @ViewChild(NgFlowchartCanvasDirective)
  paymentMethodCanvas!: NgFlowchartCanvasDirective;

  paymentMethods = [
    'credit-card',
    'bank-account',
    'VISA',
    'MasterCard',
    'American Express',
  ];

  nameChanged: boolean = false;

  constructor(public dialog: MatDialog, public snackbar: MatSnackBar, private store: Store<AppState>) {
    super();
  }

  override ngOnInit() {
    super.ngOnInit();
    // Logic here, e.g. fetch data from an API
  }

  override ngAfterViewInit() {
    super.ngAfterViewInit();
  }

  ngOnDestroy() {
    this.paymentMethodCanvas?.getFlow().clear();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.canvas.reRender(true);
  }

  override canDrop(dropEvent: NgFlowchart.DropTarget): boolean {
    let canDrop = true;
    if (!dropEvent) {
      canDrop = false;
    }

    if (dropEvent?.position === 'ABOVE') {
      canDrop = false;
    }

    if (
      dropEvent?.step?.type !== 'smart-routing' &&
      dropEvent?.position === 'BELOW'
    ) {
      canDrop = false;
    }

    if (
      ['RIGHT', 'LEFT'].includes(dropEvent?.position) &&
      dropEvent?.step?.type !== 'payment-method'
    ) {
      canDrop = false;
    }

    if (!canDrop) {
      this.snackbar.open('Invalid drop', 'Close', {
        duration: 3000,
      });
    }

    if (canDrop && this.data.type === 'payment-method') {
      this.dialog
        .open(DialogComponent, {
          data: {
            type: 'select-one',
            step: this,
            list: this.paymentMethods,
            label: 'Payment Method',
            title: 'Select Payment Method',
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
      this.data = {
        name: result,
      };
      this.nameChanged = true;
      this.store.dispatch(stepUpdated());
    } else {
      this.destroy();
    }
    setTimeout(() => {
      this.canvas.reRender(true);
    }, 100);
  }
}
