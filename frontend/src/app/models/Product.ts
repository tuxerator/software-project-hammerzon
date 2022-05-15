
export class Product{
  _id='';

  name:string;
  // Anbieter der Dienstleistung
  user:string;
  // Genauere Beschreibung des Dienstleistung
  description:string;
  // Preis der Dienstleistung
  prize:number;
  // Zeit dauer der Dienstleistung
  duration:Date;
  // Möglichen daten wo man die Dienstleistung kaufen kann
  appointments:Appointment[];

  constructor(name:string,description:string,prize:number,duration:Date,appointments:Appointment[]){
    this.name = name;
    this.user = '';
    this.description = description;
    this.prize = prize;
    this.duration = duration;
    this.appointments = appointments;
  }
}


export class Appointment{
    date:Date;
    // gibt an ob es noch zu lesen der Termin noch angegeben wird
    isReserved:boolean;

    constructor(date:Date)
    {
      this.date = date;
      this.isReserved = false;
    }
}


