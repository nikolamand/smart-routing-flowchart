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
} from '@joelwenzel/ng-flowchart';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { RestrictionsModalComponent } from './restrictions-modal/restrictions-modal.component';
import { stepUpdated } from 'src/app/store/flowchart.actions';
import { AppState } from 'src/app/store/flowchart.reducer';


@Component({
  selector: 'app-restrictions-step',
  templateUrl: './restrictions.component.html',
  styleUrls: ['./restrictions.component.scss'],
})
export class RestrictionsComponent
  extends NgFlowchartStepComponent
  implements OnInit, OnDestroy, AfterViewInit, OnChanges
{
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

  ngOnChanges(changes: SimpleChanges): void {
    this.canvas.reRender();
  }

  ngOnDestroy(): void {

  }

  override canDrop(dropEvent: NgFlowchart.DropTarget): boolean {
    let canDrop = true;

    if (!dropEvent) {
      canDrop = false;
    }

    if (['RIGHT', 'LEFT'].includes(dropEvent?.position) && dropEvent?.step?.type !== 'restrictions') {
      return false;
    }

    if (
      dropEvent?.step?.type !== 'currency' &&
      dropEvent?.position === 'BELOW'
    ) {
      return false;
    }

    if (
      dropEvent?.step?.type !== 'payment-channel' &&
      dropEvent?.position === 'ABOVE'
    ) {
      return false;
    }

    console.log('canDrop', canDrop);

    if (!canDrop) {
      this.snackbar.open('Invalid drop', 'Close', {
        duration: 3000,
      });
    }

    if (canDrop) {
      this.editStep();
    }

    return canDrop;
  }

  overridecanDeleteStep(): boolean {
    return true;
  }

  editStep() {
    this.dialog
      .open(RestrictionsModalComponent, {
        data: {
          step: this,
          label: 'Restrictions',
          title: 'Select Restrictions',
          restrictions: this.data?.restrictions,
        },

        hasBackdrop: true,
        width: '500px',
      })
      .afterClosed()
      .subscribe((result: any) => {
        if (result) {
          result = Object.keys(result).map((key) => {
            return {
              key,
              value: result[key],
              label: key
                .split(/(?=[A-Z])/)
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' '),
            };
          }).filter(item => item.value);;
        }
        this.setRestrictions(result);
        this.store.dispatch(stepUpdated());
      });
  }

  deleteStep() {
    this.data = {
      ...this.data,
      restrictions: null,
    };
    this.canvas.reRender();
    this.store.dispatch(stepUpdated());
  }

  setRestrictions(result: any) {
    if (result) {
      this.data = {
        ...this.data,
        restrictions: result,
      };
      setTimeout(() => {
        this.canvas.reRender();
      }, 300);
    }
  }
}
