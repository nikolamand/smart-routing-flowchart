import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentChannelModalComponent } from './payment-channels-modal.component';

describe('PaymentChannelModalComponent', () => {
  let component: PaymentChannelModalComponent;
  let fixture: ComponentFixture<PaymentChannelModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentChannelModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentChannelModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
