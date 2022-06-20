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

  numberOfRatings? : number;

  averageRating? : number;

  ratings? : Rating[];


  constructor(name: string, 
              description: string, 
              prize: number, 
              duration: Date, 
              appointments: Appointment[], 
              image_id: string,
              ) {
    this.name = name;
    this.description = description;
    this.prize = prize;
    this.duration = duration;
    this.appointments = appointments;
    this.image_id = image_id;
  }
}

export class Rating {
  rating : number;
  comment : string;
  user? : User;

  constructor(rating: number, comment: string) {
    this.rating = rating;
    this.comment = comment;
  }
}


export class Appointment {
  date: Date;
  // gibt an ob es noch zu lesen der Termin noch angegeben wird
  isReserved: boolean;

  constructor(date: Date) {
    this.date = date;
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


