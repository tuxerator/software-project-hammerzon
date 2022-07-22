import { Component, EventEmitter, Injectable, Input, OnInit, Output, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { NgbDateNativeAdapter, NgbTimeUTCDateAdapter } from '../../../../util/nbgAdapter';
import { NgbDate, NgbDateAdapter, NgbInputDatepicker, NgbTimeAdapter } from '@ng-bootstrap/ng-bootstrap';
import { Availability } from '../../../models/Product';
import { AppointemntAction, OrderService } from '../../../services/order.service';
import { Observable, of, Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import {
  compareDates,
  createAppointment,
  dayInMilliseconds,
  getDayTime,
  updateGroupValidity, utcOffset
} from '../../../../util/util';

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
  @Input() duration = 0;
  @Input() defaultTimeFrame: Availability = new Availability(new Date(0), new Date(0));

  @Input() onAppointmentChanged!: Subject<AppointemntAction>;

  @Output() createAppointmentEvent = new EventEmitter<Availability>();

  @ViewChild('appointDatePicker') datePicker!: NgbInputDatepicker;
  private productId!: string;

  form!: FormGroup;
  dateControl!: FormControl;
  timeControl!: FormControl;

  date: Date | null = null;
  time: Date | null = null;

  private availabilities: Availability[] = [];
  private existingAppointments: Availability[] = [];

  get updateGroupValidity(): (formGroup: FormGroup) => void {
    return updateGroupValidity;
  }

  get console(): Console {
    return console;
  }

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
      validators: [Validators.required],
      asyncValidators: [this.appointmentValidator.validate.bind(this)]
    });
    this.timeControl = new FormControl('', [Validators.required]);

    this.form = this.fb.group({
      dateControl: this.dateControl,
      timeControl: this.timeControl,
    }, {
      validators: [this.validateTime()]
    });

    console.log('form group: %o', this.form);
    console.log('defaultTimeFrame',this.defaultTimeFrame);
    this.time = new Date(getDayTime(this.defaultTimeFrame.startDate));

    this.onAppointmentChanged?.subscribe( {
      next: (appAction: AppointemntAction) => {
          console.log('AppointmentAction: %o', appAction);
          if (appAction.action === 'add') {
            appAction.appointment = new Availability(new Date(appAction.appointment.startDate), new Date(appAction.appointment.endDate));
            this.existingAppointments.push(appAction.appointment);
            if (this.datePicker.isOpen()) {
              this.datePicker.close();
              this.datePicker.open();
            }
          } else if (appAction.action === 'remove') {
            const index = this.existingAppointments.findIndex(ap1 => Availability.compare(ap1, appAction.appointment) === 0);
            this.existingAppointments = [...this.existingAppointments.splice(0, index), ...this.existingAppointments.splice(index + 1, this.existingAppointments.length)];
            if (this.datePicker.isOpen()) {
              this.datePicker.close();
              this.datePicker.open();
            }
          }
        },
      error: (error: any) => {
      console.error('Error in onAppointmentChanged: %o', error);
    }
  }
    );

    this.productId = String(this.route.snapshot.paramMap.get('id'));

    this.orderService.getAvailabilityList(this.productId).subscribe({
      next: (val) => {
        this.availabilities = val.map((availability) => {
          return new Availability(new Date(availability.startDate), new Date(availability.endDate));
        });

        if (this.availabilities.length > 0) {
          this.datePicker.startDate = {
            year: this.availabilities[0].startDate.getFullYear(),
            month: this.availabilities[0].startDate.getMonth() + 1,
            day: this.availabilities[0].startDate.getDate()
          };
        }

        // after receiving the availabilities, get the existing appointments
        this.availabilities.forEach((availability) => {
          const date = new Date(availability.startDate.getFullYear(), availability.startDate.getMonth(), availability.startDate.getDate());
          date.setUTCFullYear(availability.startDate.getUTCFullYear());
          date.setUTCHours(this.defaultTimeFrame.startDate.getUTCHours(), this.defaultTimeFrame.startDate.getMinutes(), this.defaultTimeFrame.startDate.getSeconds());

          // Iterate over all days in the availability and check if there is an appointment
          while (compareDates(date, availability.endDate)) {
            this.orderService.validateAppointment(this.productId, new Availability(date, new Date(date.getTime() + this.defaultTimeFrame.endDate.getTime() - this.defaultTimeFrame.startDate.getTime()))).subscribe({
              error: (err) => {
                console.log(err);
                if (err.error.optional) {
                  const existingAppointment = err.error.optional[0] as Availability[];
                  if (existingAppointment) {
                    existingAppointment.forEach((appointment) => {
                      this.existingAppointments.push(new Availability(new Date(appointment.startDate), new Date(appointment.endDate)));
                    });
                  }
                }
              }
            });
            date.setTime(date.getTime() + dayInMilliseconds);
          }
        });
        setTimeout(console.log.bind(console, 'availabilities: %o\nexistingAppointments: %o', this.availabilities, this.existingAppointments), 500);
      },
      error: (err) => {
        console.log(err);
      }
    });

  }

  markDisabled = (date: NgbDate): boolean => {
    const utcDate = this.ngbDateAdapter.toModel(date);

    // If utcDate is null, the date gets disabled
    if (!utcDate) {
      return true;
    }

    const isInsideAvailability = !(this.availabilities.some(availability => {
      const startDate = new Date(availability.startDate);
      const endDate = new Date(availability.endDate);
      return compareDates(startDate, utcDate) <= 0 &&
        compareDates(utcDate, endDate) <= 0;
    }));

    // If the date is inside an availability, it only gets disabled if it is in an existing appointment
    if (!isInsideAvailability) {

      if (this.existingAppointments.some(appointment => {
        const startDate = appointment.startDate;
        const endDate = appointment.endDate;

        return compareDates(startDate, utcDate) <= 0 && compareDates(utcDate, endDate) <= 0;
      })) {
        const existingAppoint = this.existingAppointments.filter(appointment => {
          return compareDates(appointment.startDate, utcDate) <= 0 && compareDates(utcDate, appointment.endDate) <= 0;
        });

        existingAppoint.sort(Availability.compare);

        let lastAppoint = utcDate.getTime() - utcOffset + this.defaultTimeFrame.startDate.getTime();

        for (const appoint of existingAppoint) {
          console.log('appoint: %o, lastAppoint: %o', appoint, new Date(lastAppoint));
          if (appoint.startDate.getTime() - utcOffset - lastAppoint >= this.duration) {
            return false;
          }

          lastAppoint = appoint.endDate.getTime() - utcOffset;
        }

        const diff = utcDate.getTime() + this.defaultTimeFrame.endDate.getTime() - lastAppoint;

        console.log('diff: %o', diff);

        if (this.defaultTimeFrame.endDate.getTime() - this.defaultTimeFrame.startDate.getTime() < this.duration && diff >= 2 * 60 * 60 * 1000) {
          return false;
        }

        return diff < this.duration;


      }
    }

    // If the date is not inside an availability, it gets disabled
    return isInsideAvailability;
  };

  createAppointment(): void {
    if (!this.form.valid) {
      return;
    }

    if (this.date && this.time) {
      const appointment: Availability = createAppointment(new Date(this.date.getTime() + this.time.getTime()), this.duration, this.defaultTimeFrame);
      console.log('POST appointment: %o', appointment);
      this.createAppointmentEvent.emit(appointment);
      return;
    }
    console.log('Shouldn\'t be reached. Fix your code!\n' +
      'date: %o\n' + 'time: %o', this.date, this.time);
  }

  // Validator which requires the time to be such that the appointment fits into the availability
  validateTime = (): ValidatorFn => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return (_control: AbstractControl): ValidationErrors | null => {
      console.log('validating time: ', this.date, this.time);
      if (this.time && this.date) {
        if (this.time.getTime() - utcOffset < this.defaultTimeFrame.startDate.getTime() || this.time.getTime() - utcOffset > this.defaultTimeFrame.endDate.getTime()) {
          console.log('time is not in the default time frame');
          return {
            timeOutsideDefaultTimeFrame: true
          };
        }

        const existingAppoint = this.existingAppointments;

        existingAppoint.sort(Availability.compare);

        const selectedAppoint = createAppointment(new Date(this.time.getTime() + this.date.getTime()), this.duration, this.defaultTimeFrame);

        for (const appoint of existingAppoint) {
          console.log('appoint: %o, selectedAppoint: %o', appoint, selectedAppoint);
          if (appoint.startDate.getTime() <= selectedAppoint.endDate.getTime() && appoint.endDate.getTime() >= selectedAppoint.startDate.getTime()) {
            console.log('appointment overlaps with existing appointment');
            return {
              overlappingAppointment: {
                appointment: appoint,
              }
            };
          }
        }

        if (this.defaultTimeFrame.endDate.getTime() - this.defaultTimeFrame.startDate.getTime() >= this.duration) {
          if (compareDates(selectedAppoint.startDate, selectedAppoint.endDate)) {
            console.log('appointment is not in the default time frame');
            return {
              appointOutsideDefaultTimeFrame: true
            };
          }
        }
      }
      return null;
    };
  };
}

/**
 * Validator for appointment validation
 */
@Injectable({ providedIn: 'root' })
export class AppointmentValidator {
  constructor() {

  }

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    const value = control.value;
    console.log('validate: %o', value);
    return of(null);
  }
}
