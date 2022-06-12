import { IOrder, Order, Status } from './Models/Order';
import { IProduct, Product } from './Models/Product';

export default class OrderTestData {

  // productCon = new ProductController();
  public list: any[] = [
    {
      product: '6284efd5b72a93135f555555',
      orderingUser: '6284efd5b72a93135fb79c88',
      timeOfOrder: new Date(),
      appointment: { date: new Date(), isReserved: true },
      status : Status.NNA
    },
    {
      product: '6284efd5b72a93135f555555',
      orderingUser: '6284efd5b72a93135fb79c88',
      timeOfOrder: new Date(),
      appointment: { date: new Date, isReserved: true },
      status : Status.NNA
    }
  ];

  constructor() {
    this.insertIfNotExistend();
    //Order.deleteMany({}).exec();
    
  }

  async insertIfNotExistend(): Promise<void> {
    const vals: IOrder[] = await Order.find({});
    if (!vals || vals.length <= 0) {
      console.log('Inserting Orders');
      await Order.insertMany(this.list);
      const current: IOrder[] = await Order.find({});
      console.log(current);
    } else {
      console.log('Orders already exist');
      const current: IOrder[] = await Order.find({});
      console.log(current);
    }
  }
}
