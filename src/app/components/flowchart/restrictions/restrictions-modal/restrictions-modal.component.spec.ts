import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestrictionsModalComponent } from './restrictions-modal.component';

describe('RestrictionsModalComponent', () => {
  let component: RestrictionsModalComponent;
  let fixture: ComponentFixture<RestrictionsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RestrictionsModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RestrictionsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
