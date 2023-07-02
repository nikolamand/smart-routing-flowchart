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

@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.scss'],
})
export class CurrencyComponent
  extends NgFlowchartStepComponent
  implements OnInit, OnDestroy, AfterViewInit, OnChanges
{
  @ViewChild(NgFlowchartCanvasDirective)
  currencyCanvas!: NgFlowchartCanvasDirective;

  currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD'];

  constructor(public dialog: MatDialog, public snackbar: MatSnackBar, private store: Store<AppState>) {
    super();
  }

  override ngOnInit() {
    super.ngOnInit();
  }

  override ngAfterViewInit() {
    super.ngAfterViewInit();
  }

  ngOnDestroy() {
    this.currencyCanvas?.getFlow().clear();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.canvas.reRender();
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
      dropEvent?.step?.type !== 'payment-method' &&
      dropEvent?.position === 'BELOW'
    ) {
      canDrop = false;
    }

    if (
      ['RIGHT', 'LEFT'].includes(dropEvent?.position) &&
      dropEvent?.step?.type !== 'currency'
    ) {
      canDrop = false;
    }

    if (!canDrop) {
      this.snackbar.open('Invalid drop', 'Close', {
        duration: 3000,
      });
    }

    if (canDrop && this.data.type === 'currency') {
      this.dialog
        .open(DialogComponent, {
          data: {
            type: 'select-one',
            step: this,
            list: this.currencies,
            label: 'Currency',
            title: 'Select Currency',
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
      console.log('result', result);
      this.data = {
        name: result,
      };
      this.store.dispatch(stepUpdated());
    } else {
      this.destroy();
    }
    setTimeout(() => {
      this.canvas.reRender();
    }, 100);
  }
}
