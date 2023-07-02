import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Store } from '@ngrx/store';
import {
  NgFlowchart,
  NgFlowchartStepComponent,
  NgFlowchartCanvasDirective,
} from '@joelwenzel/ng-flowchart';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AppState } from 'src/app/store/flowchart.reducer';
import { stepUpdated } from 'src/app/store/flowchart.actions';

@Component({
  selector: 'app-smart-routing-step',
  templateUrl: './smart-routing.component.html',
  styleUrls: ['./smart-routing.component.scss'],
})
export class SmartRoutingComponent
  extends NgFlowchartStepComponent
  implements OnInit, OnDestroy, AfterViewInit, OnChanges
{
  constructor(
    public dialog: MatDialog,
    public snackbar: MatSnackBar,
    private store: Store<AppState>
  ) {
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
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.canvas.reRender();
  }

  override init(drop: any, viewContainer: any): void {
    super.init(drop, viewContainer);
    console.log('init smart routing', this.data);
  }

  override canDrop(dropEvent: NgFlowchart.DropTarget): boolean {
    let canDrop = true;

    if (dropEvent) {
      this.snackbar.open('Invalid drop', 'Close', {
        duration: 3000,
      });
      canDrop = false;
    }

    if(canDrop){
      this.store.dispatch(stepUpdated());
    }
    return canDrop;
  }

  overridecanDeleteStep(): boolean {
    return true;
  }
}
