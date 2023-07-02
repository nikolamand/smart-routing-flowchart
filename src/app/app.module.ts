import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgFlowchartModule } from '@joelwenzel/ng-flowchart';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SmartRoutingComponent } from './components/flowchart/smart-routing/smart-routing.component';
import { PaymentMethodComponent } from './components/flowchart/payment-method/payment-method.component';
import { CurrencyComponent } from './components/flowchart/currency/currency.component';
import { RestrictionsComponent } from './components/flowchart/restrictions/restrictions.component';
import { PaymentChannelComponent } from './components/flowchart/payment-channel/payment-channel.component';
import { DialogComponent } from './components/flowchart/dialog/dialog.component';
import { RestrictionsModalComponent } from './components/flowchart/restrictions/restrictions-modal/restrictions-modal.component';

import { flowchartReducer } from './store/flowchart.reducer';

@NgModule({
  declarations: [
    AppComponent,
    DialogComponent,
    SmartRoutingComponent,
    PaymentMethodComponent,
    CurrencyComponent,
    RestrictionsComponent,
    PaymentChannelComponent,
    RestrictionsModalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgFlowchartModule,
    MatDialogModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    FormsModule,
    HttpClientModule,
    MatSnackBarModule,
    MatInputModule,
    ReactiveFormsModule,
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
    }),
    StoreModule.forRoot({ flowchart: flowchartReducer }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
