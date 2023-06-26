import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartRoutingComponent } from './smart-routing.component';

describe('SmartRoutingComponent', () => {
  let component: SmartRoutingComponent;
  let fixture: ComponentFixture<SmartRoutingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmartRoutingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SmartRoutingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
