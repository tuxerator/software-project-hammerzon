import { IProduct, Product } from '../Models/Product';
import { Image } from '../Models/Image';
import fs from 'fs';
import path from 'path';
import { Category } from '../Models/Category';
import Helper from '../Utils/helpers';

type PickProduct  = Pick<IProduct,'name'|'prize'|'description'|'ngrams'|'prefixNgrams'|'availability'|'defaultTimeFrame'|'numberOfRatings'|'averageRating'|'duration'>;

export default class ProductTestData {

  public images:string[] = [
    'fliesen-legen.jpeg',
    'garten.jpg',
    'handwerker.jpeg',
    'house.png',
    'interior.jpeg',
    'terrassen.jpeg',
    'umziehen.jpeg',
    'fliesen-legen.jpeg',
  ];

  public list: ( PickProduct & {user:string, ratings: {rating:number,comment:string,user:string,date:Date,helpfulUsers:string[]}[]}) [] = [
    {
      name: 'Fliesenlegen',
      user: '6284efd5b72a93135fb79c88',
      prize: 45,
      description: 'Fliesenlegen leicht gemacht!! Wir legen ihre fliesen in nur wenigen Stunden',
      ngrams : Helper.ngram('Fliesenlegen', 3).join(' '),
      prefixNgrams : Helper.prefixNgram('Fliesenlegen', 3).join(' '),
      duration: new Date('1970-01-01T00:30:00.000Z'), // 1 Sekunde
      availability: [{
        startDate: new Date('2022-08-19T08:00:00.000Z'),
        endDate: new Date('2023-08-19T18:00:00.000Z')
      }],
      defaultTimeFrame:{
        start: new Date('1970-01-01T08:00:00.000Z'),
        end: new Date('1970-01-01T18:00:00.000Z'),
      },
      numberOfRatings : 2,
      averageRating : 3.5,
      ratings : [{
        rating: 3,
        comment: 'Gut',
        user: '6284efd5b72a93135fb79c87',
        date: new Date(),
        helpfulUsers: []
      },{
        rating: 4,
        comment: 'Gut',
        user: '6284efd5b72a93135fb79c88',
        date: new Date(),
        helpfulUsers: ['']
      }]
    },
    {
      name: 'Gartenarbeit',
      user: '6284efd5b72a93135fb79c88',
      prize: 80,
      description: 'Meine Berufsausbildung habe ich vor sechs Jahren bei der Gartenbau GmbH'+
                   ' mit der Fachrichtung Zierpflanzenbau abgeschossen. Neben meinen fachlichen'+
                   ' Fähigkeiten sehe ich meine Stärken auch in der Kommunikation vor Ort mit den Kunden.'+
                   ' Mein Tätigkeitsfeld besteht zurzeit vorwiegend aus den Pflanzen von Blumen,'+
                   ' Stauden und Sträuchern bei Privatkunden.'+
                   ' Auch der Bau von Zäunen und Pergolen gehört zeitweise zu meinen Aufgaben.'+
                   ' Wegen Personalabbaus aufgrund der augenblicklichen wirtschaftlichen Lage sehe ich mich zurzeit nach beruflichen Alternativen um.',
      ngrams : Helper.ngram('Gartenarbeit', 3).join(' '),
      prefixNgrams : Helper.prefixNgram('Gartenarbeit', 3).join(' '),
      duration: new Date('1970-01-01T02:30:00.000Z'), // 1 Sekunde
      numberOfRatings : 2,
      availability: [{
        startDate: new Date('2022-08-19T08:00:00.000Z'),
        endDate: new Date('2023-08-19T18:00:00.000Z')
      }],
      defaultTimeFrame:{
        start: new Date('1970-01-01T08:00:00.000Z'),
        end: new Date('1970-01-01T18:00:00.000Z'),
      },
      averageRating : 1,
      ratings : [{
        rating: 1,
        comment: 'Gut',
        user: '6284efd5b72a93135fb79c87',
        date: new Date(),
        helpfulUsers: []
      },{
        rating: 1,
        comment: 'Gut',
        user: '6284efd5b72a93135fb79c87',
        date: new Date(),
        helpfulUsers: []
      }]
    },
    {
        name:'Tischlerarbeit',
        user:'6284efd5b72a93135fb79c87',
        prize:10,
        description:'„Tischler“ bzw. „Schreiner“ bezeichnet in Deutschland einen Ausbildungsberuf bzw. das „Handwerk“, welches sich auf die schneidende, fügende oder veredelnde Verarbeitung von Holz und Holzwerkstoffen spezialisiert hat. Damit ist der Bau von Möbeln bis hin zu Bauelementen im Sinn der Holztechnik gemeint. Eine Tischler- oder Schreinerei ist die entsprechende Werkstatt.',
        ngrams : Helper.ngram('Tischlerarbeit', 3).join(' '),
        prefixNgrams : Helper.prefixNgram('Tischlerarbeit', 3).join(' '),
        duration: new Date('1970-01-01T02:30:00.000Z'), // 1 Sekunde
        numberOfRatings : 0,
        availability: [{
          startDate: new Date('2022-08-19T08:00:00.000Z'),
        endDate: new Date('2023-08-19T18:00:00.000Z')
        }],
        defaultTimeFrame:{
          start: new Date('1970-01-01T08:00:00.000Z'),
          end: new Date('1970-01-01T18:00:00.000Z'),
        },
        averageRating : 1,
        ratings : []
    },
    {
        name:'Rohbauarbeiten',
        user:'6284efd5b72a93135fb79c87',
        prize:10,
        description:'Unter dem Begriff Rohbau ist ein Bauwerk zu verstehen, dessen Fundament inklusive Fundamentplatte, Außenmauern und Dachkonstruktion bereits fertiggestellt ist. Fenster wurden hier allerdings noch nicht eingebaut, auch die Fassadenverkleidung fehlt, genauso der Innenausbau. Wurde der Dachstuhl aufgesetzt, findet meist ein kleines Richtfest statt, an dem neben dem Bauherrn und dessen Familie alle am Hausbau Beteiligten teilnehmen. Das Richtfest ist der Abschluss der Rohbauarbeiten. Ein Prüfstatiker nimmt nach der Fertigstellung die Rohbauarbeiten als fehlerfrei ab. Erst danach kann mit dem Innenausbau begonnen werden.',
        ngrams : Helper.ngram('Rohbauarbeiten', 3).join(' '),
        prefixNgrams : Helper.prefixNgram('Rohbauarbeiten', 3).join(' '),
        duration:new Date('1970-01-01T12:30:00.000Z'), // 1 Sekunde
        numberOfRatings : 0,
        availability: [{
          startDate: new Date('2022-08-19T08:00:00.000Z'),
        endDate: new Date('2023-08-19T18:00:00.000Z')
        }],
        defaultTimeFrame:{
          start: new Date('1970-01-01T08:00:00.000Z'),
          end: new Date('1970-01-01T18:00:00.000Z'),
        },
        averageRating : 1,
        ratings : []
    },
    {
        name:'Innenarchitketur',
        user:'6284efd5b72a93135fb79c87',
        prize:10,
        description:'Wir machen ihren drinnen zu einer wohlfühl Oase das sie ihr Heim nennen können',
        ngrams : Helper.ngram('Innenarchitektur', 3).join(' '),
        prefixNgrams : Helper.prefixNgram('Innenarchitektur', 3).join(' '),
        duration:new Date('1970-01-01T01:30:00.000Z'), // 1 Sekunde

        availability: [{
          startDate: new Date('2022-08-19T08:00:00.000Z'),
        endDate: new Date('2023-08-19T18:00:00.000Z')
        }],
        defaultTimeFrame:{
          start: new Date('1970-01-01T08:00:00.000Z'),
          end: new Date('1970-01-01T18:00:00.000Z'),
        },
        numberOfRatings : 0,
        averageRating : 1,
        ratings : []
    },
    {
        name:'Terrassenbau',
        user:'6284efd5b72a93135fb79c87',
        prize:10,
        description:'Eine Terrasse von der ihr Nachbar nur Träumen kann.',
        ngrams : Helper.ngram('Terassenbau', 3).join(' '),
        prefixNgrams : Helper.prefixNgram('Terassenbau', 3).join(' '),
        duration:new Date('1970-01-01T05:30:00.000Z'), // 1 Sekunde
        numberOfRatings : 0,
        availability: [{
          startDate: new Date('2022-08-19T08:00:00.000Z'),
        endDate: new Date('2023-08-19T18:00:00.000Z')
        }],
        defaultTimeFrame:{
          start: new Date('1970-01-01T08:00:00.000Z'),
          end: new Date('1970-01-01T18:00:00.000Z'),
        },
        averageRating : 1,
        ratings : []
    },
    {
        name:'Umziehen',
        user:'6284efd5b72a93135fb79c87',
        prize:10,
        description:'Der Umzug passiert hier ohne Problem und ohne Stress.',
        ngrams : Helper.ngram('Umziehen', 3).join(' '),
        prefixNgrams : Helper.prefixNgram('Umziehen', 3).join(' '),
        duration:new Date('1970-01-01T01:30:00.000Z'), // 1 Sekunde
        numberOfRatings : 0,
      availability: [{
        startDate: new Date('2022-08-19T08:00:00.000Z'),
        endDate: new Date('2023-08-19T18:00:00.000Z')
      }],
      defaultTimeFrame:{
        start: new Date('1970-01-01T08:00:00.000Z'),
        end: new Date('1970-01-01T18:00:00.000Z'),
      },
      averageRating : 1,
      ratings : []

    },{
      name: 'Fliesenlegen mit Alten entfernen',
      user: '6284efd5b72a93135fb79c88',
      prize: 45,
      description: 'Fliesenlegen leicht gemacht!! Wir legen ihre fliesen in nur wenigen Stunden',
      ngrams : Helper.ngram('Fliesenlegen mit Alten entfernen', 3).join(' '),
      prefixNgrams : Helper.prefixNgram('Fliesenlegen mit Alten entfernen', 3).join(' '),
      duration: new Date('1970-01-01T00:30:00.000Z'), // 1 Sekunde
      numberOfRatings : 0,
      availability: [{
        startDate: new Date('2022-08-19T08:00:00.000Z'),
        endDate: new Date('2023-08-19T18:00:00.000Z')
      }],
      defaultTimeFrame:{
        start: new Date('1970-01-01T08:00:00.000Z'),
        end: new Date('1970-01-01T18:00:00.000Z'),
      },
      averageRating : 1,
      ratings : []
    },
  ];

  constructor() {


    //Product.deleteMany({});
    this.insertIfNotExistend();
  }

  async insertIfNotExistend(): Promise<void> {
    const vals: IProduct[] = await Product.find({});
    // Only add these Test date if nothing else is in the DB
    if (!vals || vals.length <= 0) {
        const imgs:string[]  = [];
        for(const img of this.images)
        {
          const newImg = await Image.insertMany([{
            type:'image/png',
            data:fs.readFileSync(path.join('./TestDataImages/' + img)),
            is_replaceable:false
          }]);
          imgs.push(newImg[0]._id);
        }
        console.log(imgs);


        const categoryLists = [
          {name:'Schreinern',image_id:imgs[2],color:'#fd7e14',icon:'bi-hammer',custom:false},
          {name:'Elektronik',image_id:imgs[2],color:'#fd7e14',icon:'bi-lightning-fill',custom:false},
          {name:'Umzug',image_id:imgs[2],color:'#fd7e14',icon:'bi-box-seam',custom:false},
          {name:'Malern',image_id:imgs[2],color:'#fd7e14',icon:'bi-brush-fill',custom:false},
          {name:'Maurer',image_id:imgs[2],color:'#fd7e14',icon:'bi-bricks',custom:false},
          {name:'Glaser',image_id:imgs[2],color:'#fd7e14',icon:'bi-shop-window',custom:false}
        ];

        const categoryIds = await Category.insertMany(categoryLists);

        await Product.deleteMany({});

        const users = await Image.find({});
        console.log(users.map(data => data._id));



          console.log('Inserting Products');
          const newList = this.list.map((d,i) => {
            console.log(i);
            const val: PickProduct & {image_id:string,category:string} = {...d,image_id:'',category:''};
            //console.log(imgs[i]);
            val.image_id = imgs[i%imgs.length];
            val.category = categoryIds[i%categoryLists.length]._id;
            console.log(d.availability);
            return val;
          });

          //console.log(newList);
          await Product.insertMany(newList);
          const current: IProduct[] = await Product.find({}).populate('user', '-password').exec();
          console.log(current);
        } else {
          console.log('Products already exist');
        }
    }
  }





