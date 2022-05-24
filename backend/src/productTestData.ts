import { IAppointment, IProduct, Product } from './Models/Product';
import { Image } from './Models/Image';

export default class ProductTestData{
  public list : any[] = [
    {
        name:'Holz Stuhl',
        user:'6284efd5b72a93135fb79c87',
        prize:10,
        description:'Beschreibung ...',
        duration:new Date(), // 1 Sekunde
        appointments:[{date:new Date(),isReserved:false},
                       {date:new Date(2022, 6, 15, 13),isReserved:false},
                       {date:new Date(), isReserved:true},
                       {date:new Date(), isReserved:false},
                       {date:new Date(), isReserved:false},
                       {date:new Date(), isReserved:false},
                       {date:new Date(), isReserved:false},
                       {date:new Date(), isReserved:false},
                       {date:new Date(), isReserved:false},
                       {date:new Date(), isReserved:false},
                       {date:new Date(), isReserved:false},
                       {date:new Date(), isReserved:false}],image_id:'6284f11cb72a93135fb79d1d'
    },
    {
        name:'Dachleiter',
        user:'6284efd5b72a93135fb79c87',
        prize:10,
        description:'Beschreibung ...',
        duration:new Date(), // 1 Sekunde
        appointments:[{date:new Date(),isReserved:true}],image_id:'6284f11cb72a93135fb79d1d'
    },
    {
        name:'Zimmerstreichen',
        user:'6284efd5b72a93135fb79c87',
        prize:10,
        description:'Beschreibung ...',
        duration:new Date(), // 1 Sekunde
        appointments:[{date:new Date(),isReserved:true}],image_id:'6284f11cb72a93135fb79d1d'
    },
    {
        name:'Zimmerstreichen',
        user:'6284efd5b72a93135fb79c87',
        prize:10,
        description:'Beschreibung ...',
        duration:new Date(), // 1 Sekunde
        appointments:[{date:new Date(),isReserved:true}],image_id:'6284f11cb72a93135fb79d1d'
    },
    {
        name:'Zimmerstreichen',
        user:'6284efd5b72a93135fb79c87',
        prize:10,
        description:'Beschreibung ...',
        duration:new Date(), // 1 Sekunde
        appointments:[{date:new Date(),isReserved:true}],image_id:'6284f11cb72a93135fb79d1d'
    },
    {
        name:'Zimmerstreichen',
        user:'6284efd5b72a93135fb79c87',
        prize:10,
        description:'Beschreibung ...',
        duration:new Date(), // 1 Sekunde
        appointments:[{date:new Date(),isReserved:false}],image_id:'6284f11cb72a93135fb79d1d'
    },
    {
        name:'Zimmerstreichen',
        user:'6284efd5b72a93135fb79c87',
        prize:10,
        description:'Beschreibung ...',
        duration:new Date(), // 1 Sekunde
        appointments:[{date:new Date(),isReserved:false}],image_id:'6284f11cb72a93135fb79d1d'
    },
    {
        name:'Zimmerstreichen',
        user:'6284efd5b72a93135fb79c87',
        prize:10,
        description:'Beschreibung ...',
        duration:new Date(), // 1 Sekunde
        appointments:[{date:new Date(),isReserved:false}],image_id:'6284f11cb72a93135fb79d1d'
    },
    {
        name:'Zimmerstreichen',
        user:'6284efd5b72a93135fb79c87',
        prize:10,
        description:'Beschreibung ...',
        duration:new Date(), // 1 Sekunde
        appointments:[{date:new Date(),isReserved:false}],image_id:'6284f11cb72a93135fb79d1d'
    },
    {
        name:'Zimmerstreichen',
        user:'6284efd5b72a93135fb79c87',
        prize:10,
        description:'Beschreibung ...',
        duration:new Date(), // 1 Sekunde
        appointments:[{date:new Date(),isReserved:false}],
        image_id:'6284f11cb72a93135fb79d1d'
    },
    {
        name:'Zimmerstreichen',
        user:'6284efd5b72a93135fb79c87',
        prize:10,
        description:'Beschreibung ...',
        duration:new Date(), // 1 Sekunde
        appointments:[{date:new Date(),isReserved:false}],
        image_id:'6284f11cb72a93135fb79d1d'
    },
    {
        name:'Zimmerstreichen',
        user:'6284efd5b72a93135fb79c87',
        prize:10,
        description:'Beschreibung ...',
        duration:new Date(), // 1 Sekunde
        appointments:[{date:new Date(),isReserved:false}],
        image_id:'6284f11cb72a93135fb79d1d'
    },
  ];

  constructor()
  {
    //Product.deleteMany({});
    this.insertIfNotExistend();
  }

  async insertIfNotExistend(): Promise<void>  {

    await Product.deleteMany({});

    const users  = await Image.find({});
    console.log(users.map(data => data._id));


    const vals : IProduct[] = await Product.find({});
    if(!vals || vals.length <= 0)
    {
        console.log('Inserting Products');
        await Product.insertMany(this.list);
        const current: IProduct[] = await Product.find({}).populate('user','-password').exec();
        console.log(current);
    }else{
        console.log('Products already exist');
    }
  }



}


