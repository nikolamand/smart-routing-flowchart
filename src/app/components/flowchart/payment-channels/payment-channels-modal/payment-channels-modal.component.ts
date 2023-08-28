import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-payment-channels-modal',
  templateUrl: './payment-channels-modal.component.html',
  styleUrls: ['./payment-channels-modal.component.scss']
})
export class PaymentChannelModalComponent implements OnInit{
  fields: any[any] = [];
  useLoadBalancing: boolean = false;
  loadBalancingType: string | null = null;
  initialData: any = {};
  channels: any = {};

  constructor(
    public dialogRef: MatDialogRef<PaymentChannelModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    console.log('data', this.data);
    this.initialData = JSON.parse(JSON.stringify(this.data));
    if(this.data?.data?.channels?.fields?.length > 0){
      this.channels = this.data.data.channels;
      this.fields = this.data.data.channels.fields;
      this.useLoadBalancing = !!this.data.data.channels.useLoadBalancing;
      this.loadBalancingType = this.data.data.channels.LoadBalancingType || this.data.data.channels.loadBalancingType;

      // Sorting the fields array based on sortOrder.
      this.fields.sort((a:any, b: any) => a.sortOrder - b.sortOrder);
    }
  }
  getSubField(channel: any, key: any): any {
    return channel.fields?.find(field => field.key === key) || {};
}

  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.fields, event.previousIndex, event.currentIndex);
    // If sortOrder needs to reflect the new order after drag-and-drop:
    this.fields.forEach((channel: any, index: number) => channel.sortOrder = index);
  }


  onCancel(): void {
    console.log('this.initialData', this.initialData);
    this.fields = JSON.parse(JSON.stringify(this.initialData.data.channels.fields));
    this.dialogRef.close();
  }

  onSave(): void {
    // Handle the sorting logic here if the user changes sortOrder using drag and drop.
    this.fields.sort((a: any, b: any) => a.sortOrder - b.sortOrder);

    // Then, close the dialog or handle other logic.
    this.dialogRef.close();
  }

}
