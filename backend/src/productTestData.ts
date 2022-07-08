import { IAvailability, IProduct, Product } from './Models/Product';
import { Iimage, Image } from './Models/Image';
import fs from 'fs';
import path from 'path';
import errorHandler from 'errorhandler';

export default class ProductTestData {

  public images:string[] = [
    'fliesen-legen.jpeg',
    'garten.jpg',
    'handwerker.jpeg',
    'house.png',
    'interior.jpeg',
    'terrassen.jpeg',
    'umziehen.jpeg'
  ];

  public list: any[] = [
    {
      name: 'Fliesenlegen',
      user: '6284efd5b72a93135fb79c88',
      prize: 45,
      description: 'Fliesenlegen leicht gemacht!! Wir legen ihre fliesen in nur wenigen Stunden',
      duration: new Date('1970-01-01T00:30:00.000Z'), // 1 Sekunde
      appointments: [
        { date: new Date(2022, 8, 14, 13), isReserved: false},
        { date: new Date(2022, 8, 15, 13), isReserved: false },
        { date: new Date(2022, 8, 16, 13), isReserved: false },
        { date: new Date(2022, 8, 17, 13), isReserved: false },
        { date: new Date(2022, 8, 18, 13), isReserved: false },
      ],
      image_id: ''
    },
    {
      name: 'Gartenarbeit',
      user: '6284efd5b72a93135fb79c87',
      prize: 80,
      description: 'Meine Berufsausbildung habe ich vor sechs Jahren bei der Gartenbau GmbH'+
                   ' mit der Fachrichtung Zierpflanzenbau abgeschossen. Neben meinen fachlichen'+
                   ' Fähigkeiten sehe ich meine Stärken auch in der Kommunikation vor Ort mit den Kunden.'+
                   ' Mein Tätigkeitsfeld besteht zurzeit vorwiegend aus den Pflanzen von Blumen,'+
                   ' Stauden und Sträuchern bei Privatkunden.'+
                   ' Auch der Bau von Zäunen und Pergolen gehört zeitweise zu meinen Aufgaben.'+
                   ' Wegen Personalabbaus aufgrund der augenblicklichen wirtschaftlichen Lage sehe ich mich zurzeit nach beruflichen Alternativen um.',
      duration: new Date('1970-01-01T02:30:00.000Z'), // 1 Sekunde
      appointments: [
        { date: new Date(2022, 8, 14, 13), isReserved: false },
        { date: new Date(2022, 8, 15, 13), isReserved: false },
        { date: new Date(2022, 8, 16, 13), isReserved: false },
        { date: new Date(2022, 8, 17, 13), isReserved: false },
        { date: new Date(2022, 8, 18, 13), isReserved: false },
        { date: new Date(2022, 8, 19, 13), isReserved: false },
      ],

    },
    {
        name:'Tischlerarbeit',
        user:'6284efd5b72a93135fb79c87',
        prize:10,
        description:'„Tischler“ bzw. „Schreiner“ bezeichnet in Deutschland einen Ausbildungsberuf bzw. das „Handwerk“, welches sich auf die schneidende, fügende oder veredelnde Verarbeitung von Holz und Holzwerkstoffen spezialisiert hat. Damit ist der Bau von Möbeln bis hin zu Bauelementen im Sinn der Holztechnik gemeint. Eine Tischler- oder Schreinerei ist die entsprechende Werkstatt.',
        duration:new Date('1970-01-01T00:30:00.000Z'), // 1 Sekunde
        appointments:[
          { date: new Date(2022, 8, 14, 13), isReserved: false },
          { date: new Date(2022, 8, 15, 13), isReserved: false },
          { date: new Date(2022, 8, 16, 13), isReserved: false },
          { date: new Date(2022, 8, 17, 13), isReserved: false },
          { date: new Date(2022, 8, 18, 13), isReserved: false },
          { date: new Date(2022, 8, 19, 13), isReserved: false },
        ],
    },
    {
        name:'Rohbauarbeiten',
        user:'6284efd5b72a93135fb79c87',
        prize:10,
        description:'Unter dem Begriff Rohbau ist ein Bauwerk zu verstehen, dessen Fundament inklusive Fundamentplatte, Außenmauern und Dachkonstruktion bereits fertiggestellt ist. Fenster wurden hier allerdings noch nicht eingebaut, auch die Fassadenverkleidung fehlt, genauso der Innenausbau. Wurde der Dachstuhl aufgesetzt, findet meist ein kleines Richtfest statt, an dem neben dem Bauherrn und dessen Familie alle am Hausbau Beteiligten teilnehmen. Das Richtfest ist der Abschluss der Rohbauarbeiten. Ein Prüfstatiker nimmt nach der Fertigstellung die Rohbauarbeiten als fehlerfrei ab. Erst danach kann mit dem Innenausbau begonnen werden.',
        duration:new Date('1970-01-01T12:30:00.000Z'), // 1 Sekunde
        appointments:[
          { date: new Date(2022, 8, 14, 13), isReserved: false },
          { date: new Date(2022, 8, 15, 13), isReserved: false },
          { date: new Date(2022, 8, 16, 13), isReserved: false },
          { date: new Date(2022, 8, 17, 13), isReserved: false },
          { date: new Date(2022, 8, 18, 13), isReserved: false },
          { date: new Date(2022, 8, 19, 13), isReserved: false },
        ],
    },
    {
        name:'Innnenarchitketur',
        user:'6284efd5b72a93135fb79c87',
        prize:10,
        description:'Wir machen ihren drinnen zu einer wohlfühl Oase das sie ihr Heim nennen können',
        duration:new Date('1970-01-01T01:30:00.000Z'), // 1 Sekunde
        appointments:[{date:new Date(2022, 8, 19, 13),isReserved:true}],
    },
    {
        name:'Terrassenbau',
        user:'6284efd5b72a93135fb79c87',
        prize:10,
        description:'Eine Terrasse von der ihr Nachbar nur Träumen kann.',
        duration:new Date('1970-01-01T05:30:00.000Z'), // 1 Sekunde
        appointments:[{date:new Date(),isReserved:false}],

    },
    {
        name:'Umziehen',
        user:'6284efd5b72a93135fb79c87',
        prize:10,
        description:'Der Umzug passiert hier ohne Problem und ohne Stress.',
        duration:new Date('1970-01-01T01:30:00.000Z'), // 1 Sekunde
        appointments:[{date:new Date(),isReserved:false}],

    }
  ];

  constructor(amout:number) {
    Product.deleteMany({});


    for (let i = 0; i < amout; i++) {
        const start = new Date((Math.random() * 23) * 60 * 60 * 1000);
        const end = new Date((Math.random() * 23 - start.getHours()) * 60 * 60 * 1000 );
      const product = new Product({
        name: `test${i + 1}`,
        user: '6284efd5b72a93135fb79c87',
        prize: 10,
        description: `This is test product ${i +1}`,
        duration: Math.random() * 36,
        defaultTimeFrame: {
          start: start,
          end: end
        },
        availability: [],
        image_id: '62bb5fb68f0312ffbcd0c817'
      });

      let availability: IAvailability = {
        startDate: new Date,
        endDate: new Date,
      }
      for (let i = 0; i < Math.floor(Math.random() * 100); i++) {
          availability.startDate = new Date(availability.endDate.getTime() + Math.floor(Math.random() * 100) * 24 * 60 * 60 * 1000);
          availability.endDate = new Date(new Date().getTime() + availability.startDate.getTime() + Math.floor(Math.random() * 100) * 24 * 60 * 60 * 1000);

          availability.startDate = new Date(availability.startDate.getTime() + product.defaultTimeFrame.start.getTime());
          availability.endDate = new Date(availability.endDate.getTime() + product.defaultTimeFrame.end.getTime());

          product.availability.push(availability);
        }

        console.log('created product: ', product);
      product.save().catch(errorHandler);
    }
  }

  async insertIfNotExistend(): Promise<void> {
    await Image.deleteMany({});
    const imgs:any[]  = [];
    for(const img of this.images)
    {
      const newImg = await Image.insertMany([{
        type:'image/png',
        data:fs.readFileSync(path.join('./uploads/' + img)),
      }]);
      imgs.push(newImg[0]._id);
    }
    console.log(imgs);

    await Product.deleteMany({});

    const users = await Image.find({});
    console.log(users.map(data => data._id));


    const vals: IProduct[] = await Product.find({});
    if (!vals || vals.length <= 0) {
      console.log('Inserting Products');
      const newList = this.list.map((d,i) => {
        console.log(i);
        console.log(imgs[i]);
        d.image_id = imgs[i];
        return d;
      });
      console.log(newList);
      await Product.insertMany(newList);
      const current: IProduct[] = await Product.find({}).populate('user', '-password').exec();
      console.log(current);
    } else {
      console.log('Products already exist');
    }
  }


}


