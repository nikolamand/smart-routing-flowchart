import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';

const COUNTRIES = [
  'United States',
  'Canada',
  'Mexico',
  'United Kingdom',
  'France',
  'Germany',
  'Spain',
  'Italy',
  'China',
  'Japan',
  'South Korea',
  'Australia',
  'Brazil',
  'Argentina',
  'Serbia',
];

@Component({
  selector: 'app-restrictions-modal',
  templateUrl: './restrictions-modal.component.html',
  styleUrls: ['./restrictions-modal.component.scss'],
})
export class RestrictionsModalComponent {
  public restrictionsForm: FormGroup;

  public countries = COUNTRIES;

  constructor(
    public dialogRef: MatDialogRef<RestrictionsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.restrictionsForm = new FormGroup({
      minAmount: new FormControl(''),
      maxAmount: new FormControl(''),
      geolocation: new FormControl(''),
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    let addedRestrictions = Object.values(this.restrictionsForm.value).some(value => value);

    if (addedRestrictions) {
      this.dialogRef.close(this.data.restrictions);
    }
    else{
      this.dialogRef.close();
      this.data.step.destroy();
    }
  }
}
