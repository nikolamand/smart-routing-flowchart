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

  constructor(public dialog: MatDialog) {
    super();
  }

  override ngOnInit() {
    super.ngOnInit();
    // Logic here, e.g. fetch data from an API
  }

  override ngAfterViewInit() {
    super.ngAfterViewInit();

    if (this.data.type === 'currency')
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

  ngOnDestroy() {
    this.currencyCanvas?.getFlow().clear();
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
      console.log('result', result);
      this.data = {
        name: result,
      };
    } else {
      this.destroy();
    }
    setTimeout(() => {
      this.canvas.reRender();
    }, 100);
  }
}
