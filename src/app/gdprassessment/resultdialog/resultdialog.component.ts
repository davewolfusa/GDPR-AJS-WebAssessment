import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-resultdialog',
  templateUrl: './resultdialog.component.html',
  styleUrls: ['./resultdialog.component.css']
})
export class ResultDialogComponent implements OnInit {
  
  ranges: any[] = [
            { startValue: 0, endValue: 45, style: { fill: '#4bb648', stroke: '#4bb648' }, endWidth: 10, startWidth: 1 },
            { startValue: 46, endValue: 85, style: { fill: '#ff8000', stroke: '#ff8000' }, endWidth: 13, startWidth: 10 },
            { startValue: 86, endValue: 100, style: { fill: '#e02629', stroke: '#e02629' }, endWidth: 16, startWidth: 13 }
  ];
  ticksMinor = { interval: 5, size: '5%' };
  ticksMajor = { interval: 10, size: '9%' };
  min = 0;
  max = 100;
  
  constructor(public dialogRef: MatDialogRef<ResultDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
  }
  
}
