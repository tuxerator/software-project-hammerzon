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
  // Default timeframe for availability
  defaultTimeFrame: {
    start: Date;
    end: Date;
  };
  // Möglichen daten wo man die Dienstleistung kaufen kann
  availability: Availability[]
  image_id: string;

  constructor(name: string, description: string, prize: number, duration: Date, defaultTimeFrame: { start: Date, end: Date }, availability: Availability[], image_id: string) {
    this.name = name;
    this.description = description;
    this.prize = prize;
    this.duration = duration;
    this.defaultTimeFrame = {
      start: defaultTimeFrame.start,
      end: defaultTimeFrame.end
    }
    this.availability = availability;
    this.image_id = image_id;
  }
}


export class Availability {
  startDate: Date;
  endDate: Date;
  // gibt an ob es noch zu lesen der Termin noch angegeben wird

  constructor(startDate: Date, endDate: Date) {
    this.startDate = startDate;
    this.endDate = endDate;
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


