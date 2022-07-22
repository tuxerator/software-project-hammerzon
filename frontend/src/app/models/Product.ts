import { Category } from './Category';
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
  defaultTimeFrame: { start: Date, end: Date };
  // Möglichen daten wo man die Dienstleistung kaufen kann
  availability: Availability[];
  image_id: string;

  category?:Category | string;

  numberOfRatings? : number;

  averageRating? : number;

  ratings? : Rating[];

  constructor(name: string,
              description: string,
              prize: number,
              duration: Date,
              defaultTimeFrame: { start: Date, end: Date },
              availability: Availability[],
              image_id: string,
              category?: string) {
    this.name = name;
    this.description = description;
    this.prize = prize;
    this.duration = duration;
    this.defaultTimeFrame = defaultTimeFrame;
    this.availability = availability;
    this.image_id = image_id;
    this.category = category;
  }
}

export class Rating {
  rating : number;
  comment : string;
  user? : User;
  date?:Date;
  helpfulUsers : string[] = [];

  constructor(rating: number, comment: string) {
    this.rating = rating;
    this.comment = comment;
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

  public static compare = (a: Availability, b: Availability): number => {
    const startA = a.startDate.getTime();
    const startB = b.startDate.getTime();
    const endA = a.endDate.getTime();
    const endB = b.endDate.getTime();

    const startDiff = startA - startB;
    if (!startDiff) {
      return endA - endB;
    }

    return startDiff;
  };
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
  return duration?.getUTCHours() + ' Std. ' + duration?.getUTCMinutes() + ' Min.';
};

export const getCategory = (product:Product): Category|undefined =>
{
  return product.category as Category;
};

export const getAppointmentString = (appointment?: Availability): string => {
  if (appointment) {
    return dateFormater.format(appointment.startDate);
  }
  return 'Keine Terminangabe';
};

export const getDateString = (date:Date): string => {
  return dateFormater.format(date);
};


export const roundTo2Digits = (val:number):string =>
{
    return (Math.round(val * 100) / 100) + '';
};
