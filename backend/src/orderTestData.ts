import { IOrder, Order } from './Models/Order';
import { IProduct, Product } from './Models/Product';
export default class OrderTestData{

    // productCon = new ProductController();
    public list : any[] = [
        {
            product :  '627a59fe6c23242357e841b1',
            orderingUser : '627d4654fef29f275ceab461',
            timeOfOrder: new Date(),
            finalized : false,
            timeslot : new Date(),
        },
        {
            product : '627a59fe6c23242357e841b2',
            orderingUser : '627d4654fef29f275ceab461',
            timeOfOrder : new Date(),
            finalized : false,
            timeslot : new Date()
        }
    ];

    constructor()
    {
        //this.insertIfNotExistend();
        //Order.deleteMany({}).exec();
    }

    async insertIfNotExistend(): Promise<void>  {
      const vals : IOrder[] = await Order.find({});
      if(!vals || vals.length <= 0)
      {
          console.log('Inserting Orders');
          await Order.insertMany(this.list);
          const current: IOrder[] = await Order.find({});
          console.log(current);
      }else{
          console.log('Orders already exist');
      }
    }
}
