import { Component, EventEmitter, Injectable, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors } from '@angular/forms';
import { NgbDateNativeAdapter, NgbTimeUTCDateAdapter } from '../../../../util/nbgAdapter';
import { NgbDate, NgbDateAdapter, NgbTimeAdapter } from '@ng-bootstrap/ng-bootstrap';
import { Availability } from '../../../models/Product';
import { OrderService } from '../../../services/order.service';
import { Observable, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { compareDates, dayInMilliseconds } from '../../../../util/util';

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
  @Input() defaultTimeFrame: Availability = new Availability(new Date(0), new Date(0));

  @Output() createAppointmentEvent = new EventEmitter<Availability>();

  private productId!: string;

  form!: FormGroup;
  dateControl!: FormControl;
  timeControl!: FormControl;

  date: Date | null = null;
  time: Date | null = null;

  private availabilities: Availability[] = [];
  private existingAppointments: Availability[] = [];

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

    this.productId = String(this.route.snapshot.paramMap.get('id'));

    this.orderService.getAvailabilityList(this.productId).subscribe({
      next: (val) => {
        this.availabilities = val.map((availability) => {
          return new Availability(new Date(availability.startDate), new Date(availability.endDate));
        });

        // after receiving the availabilities, get the existing appointments
        this.availabilities.forEach((availability) => {
          let date = new Date(availability.startDate.getFullYear(), availability.startDate.getMonth(), availability.startDate.getDate());
          date.setUTCFullYear(availability.startDate.getUTCFullYear());
          date.setUTCHours(this.defaultTimeFrame.startDate.getUTCHours(), this.defaultTimeFrame.startDate.getMinutes(), this.defaultTimeFrame.startDate.getSeconds());

          // Iterate over all days in the availability and check if there is an appointment
          while (compareDates(date, availability.endDate)) {
            this.orderService.validateAppointment(this.productId, new Availability(date, new Date(date.getTime() + this.defaultTimeFrame.endDate.getTime() - this.defaultTimeFrame.startDate.getTime()))).subscribe({
              next: (val) => {

              },
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
        setTimeout(console.log.bind(console, 'existingAppointments: %o', this.existingAppointments), 500);
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
        return compareDates(startDate, utcDate) == 0 && compareDates(utcDate, endDate) == 0;
      })) {
        const existingAppoint = this.existingAppointments.filter(appointment => {
          return compareDates(appointment.startDate, utcDate) == 0 && compareDates(utcDate, appointment.endDate) == 0;
        });

        existingAppoint.sort(Availability.compare);

        let lastAppoint = utcDate.getTime() + this.defaultTimeFrame.startDate.getTime();

        for (const appoint of existingAppoint) {
          console.log('appoint: %o, lastAppoint: %o', appoint, new Date(lastAppoint));
          if (appoint.startDate.getTime() - lastAppoint >= this.duration) {
            return false;
          }

          lastAppoint = appoint.endDate.getTime();
        }

        if (this.defaultTimeFrame.endDate.getTime() - lastAppoint >= this.duration) {
          return false;
        }

        return true;
      }
    }

    // If the date is not inside an availability, it gets disabled
    return isInsideAvailability;
  }

  createAppointment()
    :
    void {
    if (this.date && this.time
    ) {
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
