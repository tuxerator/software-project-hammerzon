import { IProduct, Product } from './Models/Product';

export default class ProductTestData{
  public list : any[] = [
    {
        name:'Holz Stuhl',
        user:'Holzig GmbH',
        prize:10,
        description:'Beschreibung ...',
        duration:new Date(), // 1 Sekunde
        timeslots:[]
    },
    {
        name:'Dachleiter',
        user:'Aufstiegs GmbH',
        prize:10,
        description:'Beschreibung ...',
        duration:new Date(), // 1 Sekunde
        timeslots:[]
    },
    {
        name:'Zimmerstreichen',
        user:'Streich-ich GmbH',
        prize:10,
        description:'Beschreibung ...',
        duration:new Date(), // 1 Sekunde
        timeslots:[]
    },
    {
        name:'Zimmerstreichen',
        user:'Streich-ich GmbH',
        prize:10,
        description:'Beschreibung ...',
        duration:new Date(), // 1 Sekunde
        timeslots:[]
    },
    {
        name:'Zimmerstreichen',
        user:'Streich-ich GmbH',
        prize:10,
        description:'Beschreibung ...',
        duration:new Date(), // 1 Sekunde
        timeslots:[]
    },
    {
        name:'Zimmerstreichen',
        user:'Streich-ich GmbH',
        prize:10,
        description:'Beschreibung ...',
        duration:new Date(), // 1 Sekunde
        timeslots:[]
    },
    {
        name:'Zimmerstreichen',
        user:'Streich-ich GmbH',
        prize:10,
        description:'Beschreibung ...',
        duration:new Date(), // 1 Sekunde
        timeslots:[]
    },
    {
        name:'Zimmerstreichen',
        user:'Streich-ich GmbH',
        prize:10,
        description:'Beschreibung ...',
        duration:new Date(), // 1 Sekunde
        timeslots:[]
    },
    {
        name:'Zimmerstreichen',
        user:'Streich-ich GmbH',
        prize:10,
        description:'Beschreibung ...',
        duration:new Date(), // 1 Sekunde
        timeslots:[]
    },
    {
        name:'Zimmerstreichen',
        user:'Streich-ich GmbH',
        prize:10,
        description:'Beschreibung ...',
        duration:new Date(), // 1 Sekunde
        timeslots:[]
    },
    {
        name:'Zimmerstreichen',
        user:'Streich-ich GmbH',
        prize:10,
        description:'Beschreibung ...',
        duration:new Date(), // 1 Sekunde
        timeslots:[]
    },
    {
        name:'Zimmerstreichen',
        user:'Streich-ich GmbH',
        prize:10,
        description:'Beschreibung ...',
        duration:new Date(), // 1 Sekunde
        timeslots:[]
    },
  ];

  constructor()
  {
    this.insertIfNotExistend();
  }

  async insertIfNotExistend(): Promise<void>  {
    const vals : IProduct[] = await Product.find({});
    if(!vals || vals.length <= 0)
    {
        console.log('Inserting Products');
        await Product.insertMany(this.list);
        const current: IProduct[] = await Product.find({});
        console.log(current);
    }else{
        console.log('Products already exist');
    }
  }
}


