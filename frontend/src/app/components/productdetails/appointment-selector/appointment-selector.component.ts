import { Component, EventEmitter, Injectable, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors } from '@angular/forms';
import { NgbDateNativeAdapter, NgbTimeUTCDateAdapter } from '../../../../util/nbgAdapter';
import { NgbCalendar, NgbDate, NgbDateAdapter, NgbTimeAdapter } from '@ng-bootstrap/ng-bootstrap';
import { Availability } from '../../../models/Product';
import { OrderService } from '../../../services/order.service';
import { Observable, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { compareDates, ngbDateToDate } from '../../../../util/util';

@Component({
  selector: 'app-appointment-selector',
  templateUrl: './appointment-selector.component.html',
  styleUrls: ['./appointment-selector.component.css'],
  providers: [
    { provide: NgbDateAdapter, useClass: NgbDateNativeAdapter },
    { provide: NgbTimeAdapter, useClass: NgbTimeUTCDateAdapter }
  ]
})
export class AppointmentSelectorComponent implements OnInit {
  @Input() duration: number = 0;

  @Output() createAppointmentEvent = new EventEmitter<Availability>();

  private id!: string;

  form!: FormGroup;
  dateControl!: FormControl;
  timeControl!: FormControl;

  date: Date | null = null;
  time: Date | null = null;

  private availabilities: Availability[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private orderService: OrderService,
    private appointmentValidator: AppointmentValidator,
    private ngbDateAdapter: NgbDateAdapter<Date>
  ) {
  }

  ngOnInit(): void {
    // Create FormControls
    this.dateControl = new FormControl('', {
      asyncValidators: [this.appointmentValidator.validate.bind(this)]
    });
    this.timeControl = new FormControl('');

    this.form = this.fb.group({
      dateControl: [],
      timeControl: [],
    });

    this.id = String(this.route.snapshot.paramMap.get('id'));

    this.orderService.getAvailabilityList(this.id).subscribe({
      next: (val) => {
        this.availabilities = val;
        console.log('availabilities: %o', this.availabilities);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  markDisabled = (date: NgbDate): boolean => {
    const utcDate = this.ngbDateAdapter.toModel(date);
    if (!utcDate) {
      return true;
    }
    return !(this.availabilities.some(availability => {
      const startDate = new Date(availability.startDate);
      const endDate = new Date(availability.endDate);
      return compareDates(startDate, utcDate) <= 0 &&
        compareDates(utcDate, endDate) <= 0;
    }));
  }

  createAppointment(): void {
    if (this.date && this.time) {
      const availability: Availability = {
        startDate: new Date(this.date.getTime() + this.time.getTime()),
        endDate: new Date(this.date.getTime() + this.time.getTime() + this.duration),
      };
      this.createAppointmentEvent.emit(availability);
      return;
    }
    console.log('Shouldn\'t be reached. Fix your code!\n' +
      'date: %o\n' + 'time: %o', this.date, this.time);
  }
}

/**
 * Validator for appointment validation
 */
@Injectable({ providedIn: 'root' })
export class AppointmentValidator {
  constructor(private orderService: OrderService) {
  }

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    const value = control.value;
    console.log('validate: %o', value);
    return of(null);
  }
}
