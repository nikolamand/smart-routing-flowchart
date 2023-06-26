import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentChannelComponent } from './payment-channel.component';

describe('PaymentChannelComponent', () => {
  let component: PaymentChannelComponent;
  let fixture: ComponentFixture<PaymentChannelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentChannelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
