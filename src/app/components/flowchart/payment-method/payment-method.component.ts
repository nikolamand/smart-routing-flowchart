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

  constructor(public dialog: MatDialog) {
    super();
  }

  override ngOnInit() {
    super.ngOnInit();
    // Logic here, e.g. fetch data from an API
  }

  override ngAfterViewInit() {
    super.ngAfterViewInit();

    if (this.data.type === 'payment-method')
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
      this.data = {
        name: result,
      };
      this.nameChanged = true;
    } else {
      this.destroy();
    }
    setTimeout(() => {
      this.canvas.reRender();
    }, 100);
  }
}
