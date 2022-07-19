import { IProduct, Product } from './Models/Product';
import { Iimage, Image } from './Models/Image';
import fs from 'fs';
import path from 'path';
import { Category } from './Models/Category';
import Helper from './helpers';
import mongoose from 'mongoose';

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

  public list: (Pick<IProduct,'name'|'prize'|'description'|'ngrams'|'prefixNgrams'|'availability'|'defaultTimeFrame'|'numberOfRatings'|'averageRating'|'duration'> & {user:string, ratings: {
    rating:number,
    comment:string,
    user:string,
    date:Date,
    helpfulUsers:string[]
    }[]}) [] = [
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

    await Category.deleteMany({});
    const hammerAndSaw = 'data:image/svg+xml,%3Csvg width=\'100%25\' height=\'100%25\' viewBox=\'0 0 16 16\' version=\'1.1\' xmlns=\'http://www.w3.org/2000/svg\' xmlns:xlink=\'http://www.w3.org/1999/xlink\' xml:space=\'preserve\' xmlns:serif=\'http://www.serif.com/\' style=\'fill-rule:evenodd%3Bclip-rule:evenodd%3Bstroke-linecap:round%3Bstroke-linejoin:round%3Bstroke-miterlimit:1.5%3B\'%3E%3Cpath d=\'M9.972 2.508C10.042 2.308 9.978 2.084 9.812 1.952L9.634 1.823C9.009 1.41 8.3 1.143 7.558 1.04C6.215 0.862 4.504 1.229 2.84 3.133L1.786 3.133C1.653 3.133 1.526 3.186 1.432 3.28L0.146 4.567C-0.047 4.761 -0.047 5.079 0.146 5.273L2.717 7.852C2.811 7.946 2.938 7.999 3.071 7.999C3.204 7.999 3.331 7.946 3.425 7.852L4.711 6.562C4.804 6.468 4.857 6.341 4.857 6.209L4.857 5.57L13.244 14.443C13.338 14.571 13.488 14.646 13.647 14.646C13.779 14.646 13.906 14.594 14 14.5L15.5 13C15.687 12.813 15.695 12.507 15.517 12.311L6.388 3.681C7.135 3.225 8.16 2.842 9.5 2.842C9.712 2.842 9.902 2.708 9.972 2.508Z\' style=\'fill-rule:nonzero%3B\'/%3E%3Cg%3E%3Cpath d=\'M14.951 4.807L12.964 6.57L11.353 6.784L11.4 7.441L10.715 7.587L10.763 8.103L9.219 9.571L8.321 9.55L8.437 10.422L7.489 10.424L7.661 11.276L6.626 11.291L6.956 12.145L5.853 12.092L6.106 12.932L5.068 12.794L5.518 13.686L1.888 14.112L12.711 2.155C13.267 1.499 15.818 4.069 15.077 4.695L15.036 4.731C15.265 4.43 14.907 3.697 14.219 3.071C13.516 2.431 12.733 2.145 12.472 2.432C12.21 2.719 12.569 3.471 13.272 4.111C13.922 4.702 14.639 4.992 14.951 4.807Z\' style=\'stroke:black%3Bstroke-width:1px%3B\'/%3E%3C/g%3E%3C/svg%3E';

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


    const vals: IProduct[] = await Product.find({});
    if (!vals || vals.length <= 0) {
      console.log('Inserting Products');
      const newList = this.list.map((d,i) => {
        console.log(i);
        const val:any = {...d,image_id:'',category:''};
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


