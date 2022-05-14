import { IAppointment, IProduct, Product } from './Models/Product';

export default class ProductTestData{
  public list : any[] = [
    {
        name:'Holz Stuhl',
        user:'Holzig GmbH',
        prize:10,
        description:'Beschreibung ...',
        duration:new Date(), // 1 Sekunde
        appointments:[{date:new Date(),isReserved:false}]
    },
    {
        name:'Dachleiter',
        user:'Aufstiegs GmbH',
        prize:10,
        description:'Beschreibung ...',
        duration:new Date(), // 1 Sekunde
        appointments:[{date:new Date(),isReserved:true}]
    },
    {
        name:'Zimmerstreichen',
        user:'Streich-ich GmbH',
        prize:10,
        description:'Beschreibung ...',
        duration:new Date(), // 1 Sekunde
        appointments:[{date:new Date(),isReserved:true}]
    },
    {
        name:'Zimmerstreichen',
        user:'Streich-ich GmbH',
        prize:10,
        description:'Beschreibung ...',
        duration:new Date(), // 1 Sekunde
        appointments:[{date:new Date(),isReserved:true}]
    },
    {
        name:'Zimmerstreichen',
        user:'Streich-ich GmbH',
        prize:10,
        description:'Beschreibung ...',
        duration:new Date(), // 1 Sekunde
        appointments:[{date:new Date(),isReserved:true}]
    },
    {
        name:'Zimmerstreichen',
        user:'Streich-ich GmbH',
        prize:10,
        description:'Beschreibung ...',
        duration:new Date(), // 1 Sekunde
        appointments:[{date:new Date(),isReserved:false}]
    },
    {
        name:'Zimmerstreichen',
        user:'Streich-ich GmbH',
        prize:10,
        description:'Beschreibung ...',
        duration:new Date(), // 1 Sekunde
        appointments:[{date:new Date(),isReserved:false}]
    },
    {
        name:'Zimmerstreichen',
        user:'Streich-ich GmbH',
        prize:10,
        description:'Beschreibung ...',
        duration:new Date(), // 1 Sekunde
        appointments:[{date:new Date(),isReserved:false}]
    },
    {
        name:'Zimmerstreichen',
        user:'Streich-ich GmbH',
        prize:10,
        description:'Beschreibung ...',
        duration:new Date(), // 1 Sekunde
        appointments:[{date:new Date(),isReserved:false}]
    },
    {
        name:'Zimmerstreichen',
        user:'Streich-ich GmbH',
        prize:10,
        description:'Beschreibung ...',
        duration:new Date(), // 1 Sekunde
        appointments:[{date:new Date(),isReserved:false}]
    },
    {
        name:'Zimmerstreichen',
        user:'Streich-ich GmbH',
        prize:10,
        description:'Beschreibung ...',
        duration:new Date(), // 1 Sekunde
        appointments:[{date:new Date(),isReserved:false}]
    },
    {
        name:'Zimmerstreichen',
        user:'Streich-ich GmbH',
        prize:10,
        description:'Beschreibung ...',
        duration:new Date(), // 1 Sekunde
        appointments:[{date:new Date(),isReserved:false}]
    },
  ];

  constructor()
  {
    this.insertIfNotExistend();
  }

  async insertIfNotExistend(): Promise<void>  {
    //await Product.deleteMany({});


    const product = new Product({
        name:'Zimmerstreichen',
        user:'Streich-ich GmbH',
        prize:10,
        description:'Beschreibung ...',
        duration:new Date(), // 1 Sekunde
        appointments:[{date:new Date(),isReserved:false}]
    });
    product.save();



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


