import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbDateNativeAdapter, NgbTimeDateAdapter } from '../../../../util/nbgAdapter';
import { NgbDateAdapter, NgbTimeAdapter } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-appointment-selector',
  templateUrl: './appointment-selector.component.html',
  styleUrls: ['./appointment-selector.component.css'],
  providers: [
    { provide: NgbDateAdapter, useClass: NgbDateNativeAdapter },
    { provide: NgbTimeAdapter, useClass: NgbTimeDateAdapter }
  ]
})
export class AppointmentSelectorComponent implements OnInit {
  form!: FormGroup;
  dateControl!: FormControl;
  timeControl!: FormControl;

  date: Date | null = null;
  time: Date | null = null;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
    // Create FormControls
    this.dateControl = new FormControl('');
    this.timeControl = new FormControl('');

    this.form = this.fb.group({
      dateControl: [],
      timeControl: [],
    });
  }

}
