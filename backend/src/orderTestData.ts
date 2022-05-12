import { IOrder, Order } from './Models/Order';
import { IProduct, Product } from './Models/Product';
export default class OrderTestData{

    // productCon = new ProductController();
    public list : any[] = [
        {
            orderingUser : 'Max Mustermann',
            timeOfOrder: new Date()

        },
        {
            orderingUser : 'Jürgen',
            timeOfOrder : new Date()
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
