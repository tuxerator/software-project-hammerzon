import { User } from './User';

export class Product {
  _id = '';

  name: string;
  // Anbieter der Dienstleistung
  user?: User;
  // Genauere Beschreibung des Dienstleistung
  description: string;
  // Preis der Dienstleistung
  prize: number;
  // Zeit dauer der Dienstleistung
  duration: Date;
  // Möglichen daten wo man die Dienstleistung kaufen kann
  appointments: Appointment[];

  image_id: string;

  constructor(name: string, description: string, prize: number, duration: Date, appointments: Appointment[], image_id: string) {
    this.name = name;
    this.description = description;
    this.prize = prize;
    this.duration = duration;
    this.appointments = appointments;
    this.image_id = image_id;
  }
}


export class Appointment {
  startTime: Date;
  endTime: Date;
  // gibt an ob es noch zu lesen der Termin noch angegeben wird
  isReserved: boolean;

  constructor(date: Date, duration: Date) {
    this.startTime = date;
    this.endTime = new Date(this.startTime.getTime() + duration.getTime())
    this.isReserved = false;
  }
}

const dateFormater = Intl.DateTimeFormat(
  'default', // a locale name; "default" chooses automatically
  {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  }
);

export const getDurationString = (duration?: Date): string => {
  return duration?.getHours() + ' std. ' + duration?.getMinutes() + ' min';
};


export const getAppointmentString = (date?: Date): string => {
  return dateFormater.format(date);
};


