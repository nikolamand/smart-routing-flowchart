import { Component, TemplateRef, ViewChild } from '@angular/core';
import {
  NgFlowchartCanvasDirective,
  NgFlowchartStepRegistry,
  NgFlowchart,
} from '@joelwenzel/ng-flowchart';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { Actions } from '@ngrx/effects';

import { ThemeService } from './services/theme.service';
import { SmartRoutingComponent } from './components/flowchart/smart-routing/smart-routing.component';
import { PaymentMethodComponent } from './components/flowchart/payment-method/payment-method.component';
import { CurrencyComponent } from './components/flowchart/currency/currency.component';
import { PaymentChannelComponent } from './components/flowchart/payment-channel/payment-channel.component';
import { RestrictionsComponent } from './components/flowchart/restrictions/restrictions.component';
import { addStep, undo, redo, stepUpdated } from './store/flowchart.actions';
import { AppState } from './store/flowchart.reducer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'workspace';

  callbacks: NgFlowchart.Callbacks = {};
  options: NgFlowchart.Options = {
    stepGap: 40,
    orientation: 'HORIZONTAL',
    zoom: { mode: 'MANUAL' },
  };

  @ViewChild('normalStep')
  normalStepTemplate!: TemplateRef<any>;

  @ViewChild('fileInput') fileInput: any;

  sampleJson: any;

  showDescription: number | null = null;

  customOps = [
    {
      paletteName: 'Smart Routing',
      step: {
        template: SmartRoutingComponent,
        type: 'smart-routing',
        data: {
          type: 'smart-routing',
          name: 'Smart Routing',
        },
      },
      description:
        'Base node for smart routing, it can accept payment method nodes. \nOnly one smart routing node can be placed on the canvas. \nDrag and drop to add smart routing.',
    },
    {
      paletteName: 'Payment Method',
      step: {
        template: PaymentMethodComponent,
        type: 'payment-method',
        data: {
          type: 'payment-method',
          name: 'Payment Method',
        },
      },
      description:
        'Payment method node, it can accept currency nodes. \nFirst one must be placed on smart routing node, the rest are placed on the left/right side of the other payment method nodes. \nDrag and drop to add payment method',
    },
    {
      paletteName: 'Currency',
      step: {
        template: CurrencyComponent,
        type: 'currency',
        data: {
          type: 'currency',
          name: 'Currency',
        },
      },
      description:
        'Currency node, it can accept payment channel nodes. \nFirst one must be placed on payment method node, the rest are placed on the left/right side of the other currency nodes. \nDrag and drop to add currency',
    },
    {
      paletteName: 'Restrictions',
      step: {
        template: RestrictionsComponent,
        type: 'restrictions',
        data: {
          type: 'restrictions',
          name: 'Restrictions',
        },
      },
      description: 'Restrictions node, it can accept payment channel nodes. \nFirst one must be placed on payment method node, the rest are placed on the left/right side of the other restrictions nodes. \nDrag and drop to add restrictions',
    },
    {
      paletteName: 'Payment Channel',
      step: {
        template: PaymentChannelComponent,
        type: 'payment-channel',
        data: {
          type: 'payment-channel',
          name: 'Payment Channel',
        },
      },
      description:
        'Payment channel node, last node in tree. \nIt can be placed on currency node or restriction node if there is one. \nDrag and drop to add payment channel',
    },
  ];

  @ViewChild(NgFlowchartCanvasDirective)
  canvas!: NgFlowchartCanvasDirective;

  disabled = false;

  currentFlow: any;

  constructor(
    private stepRegistry: NgFlowchartStepRegistry,
    private http: HttpClient,
    private actions$: Actions,
    private store: Store<AppState>,
    private actionsSubject$: Actions,
    private themeService: ThemeService
  ) {
    this.store.select('flowchart').subscribe((flowchartState) => {
      console.log('flowchartState', flowchartState);
      const parsedJson = JSON.parse(flowchartState.current);

      this.currentFlow = flowchartState;
      // Check if the current state exists
      if (parsedJson) {
        // Load the current state
        this.canvas.getFlow().upload(parsedJson);
      }
      if(parsedJson === null && this.canvas) {
        this.clearData();
      }
    });
    this.actionsSubject$
      .subscribe((action: any) => {
        if (action.type === '[Flowchart] Step Updated') {
          const currentJson = this.canvas.getFlow().toJSON();
          this.store.dispatch(addStep({ step: currentJson }));
        }
      });

    this.callbacks.onDropError = this.onDropError.bind(this);
    this.callbacks.onMoveError = this.onMoveError.bind(this);
  }

  ngAfterViewInit() {
    this.stepRegistry.registerStep('smart-routing', SmartRoutingComponent);
    this.stepRegistry.registerStep('payment-method', PaymentMethodComponent);
    this.stepRegistry.registerStep('currency', CurrencyComponent);
    this.stepRegistry.registerStep('payment-channel', PaymentChannelComponent);
    this.stepRegistry.registerStep('restrictions', RestrictionsComponent);

    this.onThemeChange({ target: { value: 'light' } });
  }

  onDropError(error: NgFlowchart.DropError) {
    console.log('ERROR drop:', error);
  }

  onMoveError(error: NgFlowchart.MoveError) {
    console.log('ERROR move:', error);
  }

  toggleDarkTheme(isDarkTheme: boolean = false) {
    this.themeService.toggleDarkTheme(isDarkTheme);
  }

  onThemeChange(event: any) {
    if(event.target.value === 'default'){
      // get system theme
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
      this.toggleDarkTheme(systemTheme.matches);
      return;
    }
    this.toggleDarkTheme(event.target.value === 'dark');
  }

  showDefaultJson() {
    this.http.get('assets/sample.json').subscribe((data) => {
      this.sampleJson = data;
      if (!this.sampleJson) return;
      //update steps based on sample json, this will automatically upload the flow with subscribtion to the store
      this.store.dispatch(addStep({ step: JSON.stringify(this.sampleJson) }));
    });
  }

  //uploadJson open a dialog to upload a json file and update the flow
  uploadJson() {
  }

handleFileInput(event: Event) {
  const input = event.target as HTMLInputElement;

  if (input.files && input.files[0]) {
    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const content = e.target.result;
      try {
        const jsonContent = JSON.parse(content);

        // Assuming this is where you want to update your flow:
        this.store.dispatch(addStep({ step: JSON.stringify(jsonContent) }));
      } catch (error) {
        console.error('Error parsing JSON:', error);
        // Handle error, maybe show user feedback
      }
    };

    reader.readAsText(file);
  }
}

  showFlowData() {
    let json = this.canvas.getFlow().toJSON(4);

    var x = window.open();
    x?.document.open();
    x?.document.write(
      '<html><head><title>Flowchart Json</title></head><body><pre>' +
        json +
        '</pre></body></html>'
    );
    x?.document.close();
  }

  clearData() {
    this.canvas.getFlow().clear();
  }

  onGapChanged(event: any) {
    this.options = {
      ...this.options,
      stepGap: parseInt(event.target.value),
    };
  }

  onSequentialChange(event: any) {
    this.options = {
      ...this.options,
      isSequential: event.target.checked,
    };
  }

  onDisabledChange(event: any) {
    this.disabled = event.target.checked;
  }

  onOrientationChange(event: any) {
    this.options = {
      ...this.options,
      orientation: event.target.value,
    };

    this.canvas.setOrientation(event.target.value);
  }

  onDelete(id: any) {
    this.canvas.getFlow().getStep(id).destroy(true);
  }

  onScaleChange($event: any) {
    this.canvas.setScale($event.target.value);
  }

  showDescriptionFor(index: number) {
    if (this.showDescription === index) {
      this.showDescription = null;
      return;
    }
    this.showDescription = index;
  }

  undo() {
    this.store.dispatch(undo());
    console.log('undo', this.store);
  }

  redo() {
    this.store.dispatch(redo());
  }
}
