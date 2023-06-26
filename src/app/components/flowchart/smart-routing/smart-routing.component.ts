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
  selector: 'app-smart-routing-step',
  templateUrl: './smart-routing.component.html',
  styleUrls: ['./smart-routing.component.scss'],
})
export class SmartRoutingComponent
  extends NgFlowchartStepComponent
  implements OnInit, OnDestroy, AfterViewInit, OnChanges
{
  @ViewChild(NgFlowchartCanvasDirective)
  currencyCanvas!: NgFlowchartCanvasDirective;


  constructor(public dialog: MatDialog) {
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
    this.currencyCanvas?.getFlow().clear();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.canvas.reRender();
  }

  override canDrop(dropEvent: NgFlowchart.DropTarget): boolean {
    return true;
  }

  overridecanDeleteStep(): boolean {
    return true;
  }
}
