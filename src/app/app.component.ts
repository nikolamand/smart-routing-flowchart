import {
  Component,
  TemplateRef,
  ViewChild,
  ElementRef,
  Renderer2,
} from '@angular/core';
import {
  NgFlowchartCanvasDirective,
  NgFlowchartStepRegistry,
  NgFlowchart,
} from '@joelwenzel/ng-flowchart';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

import { SmartRoutingComponent } from './components/flowchart/smart-routing/smart-routing.component';
import { PaymentMethodComponent } from './components/flowchart/payment-method/payment-method.component';
import { CurrencyComponent } from './components/flowchart/currency/currency.component';
import { PaymentChannelComponent } from './components/flowchart/payment-channel/payment-channel.component';

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
    rootPosition: 'TOP_CENTER',
  };

  isDisabled: boolean = false;

  @ViewChild('normalStep')
  normalStepTemplate!: TemplateRef<any>;

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
        'Base node for smart routing, it can accept payment method nodes',
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
        'Base node for payment method, it can accept currency nodes, drag and drop to add payment method',
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
        'Base node for currency, it can accept restrictions nodes or payment channel nodes, drag and drop to add currency',
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
        'Base node for payment channel, it is the last node in the tree so id does not accept any other nodes, drag and drop to add payment channel',
    },
  ];

  @ViewChild(NgFlowchartCanvasDirective)
  canvas!: NgFlowchartCanvasDirective;

  disabled = false;

  constructor(
    private stepRegistry: NgFlowchartStepRegistry,
    private http: HttpClient,
    private snackbar: MatSnackBar
  ) {
    this.callbacks.onDropError = this.onDropError.bind(this);
    this.callbacks.onMoveError = this.onMoveError.bind(this);
    this.callbacks.onDropStep = this.onDropStep.bind(this);
  }

  ngAfterViewInit() {
    this.stepRegistry.registerStep('smart-routing', SmartRoutingComponent);
    this.stepRegistry.registerStep('payment-method', PaymentMethodComponent);
    this.stepRegistry.registerStep('currency', CurrencyComponent);
    this.stepRegistry.registerStep('payment-channel', PaymentChannelComponent);
  }

  onDropError(error: NgFlowchart.DropError) {
    console.log('ERROR drop:', error);
  }

  onMoveError(error: NgFlowchart.MoveError) {
    console.log('ERROR move:', error);
  }

  onDropStep(dropEvent: NgFlowchart.DropEvent) {
    console.log('DROP:', dropEvent);

    const canDrop = this.checkIfCanDrop(dropEvent);
    if(!canDrop) {
      this.snackbar.open('Invalid drop', 'Close', {
        duration: 3000,
      });
      dropEvent.step.destroy();
    }
    console.log('canDrop:', canDrop);
  }

  checkIfCanDrop(dropEvent: NgFlowchart.DropEvent) {
    const droppedNodeType = dropEvent.step.data.type;
    const parentNode = dropEvent.parent?.data.type;

    if (droppedNodeType === 'smart-routing' && !parentNode) {
      return true;
    }

    if (droppedNodeType === 'payment-method' && parentNode === 'smart-routing') {
      return true;
    }

    if (droppedNodeType === 'currency' && parentNode === 'payment-method') {
      return true;
    }

    return false;
  }

  showUpload() {
    this.http.get('assets/sample.json').subscribe((data) => {
      this.sampleJson = data;
      if (!this.sampleJson) return;
      this.canvas.getFlow().upload(this.sampleJson);
    });
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
    this.isDisabled = event.target.checked;
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

  showDescriptionFor(index: number) {
    if (this.showDescription === index) {
      this.showDescription = null;
      return;
    }
    this.showDescription = index;
  }
}
