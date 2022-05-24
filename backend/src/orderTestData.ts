import { IOrder, Order } from './Models/Order';
import { IProduct, Product } from './Models/Product';

export default class OrderTestData {

  // productCon = new ProductController();
  public list: any[] = [
    {
      product: '627e5c84abdf91cb14e80306',
      orderingUser: '627e212da0cc80c799cbefae',
      timeOfOrder: new Date(),
      finalized: false,
      appointment: { date: new Date(), isReserved: false }
    },
    {
      product: '627e5c84abdf91cb14e80308',
      orderingUser: '627e212da0cc80c799cbefae',
      timeOfOrder: new Date(),
      finalized: false,
      appointment: { date: new Date, isReserved: true }
    }
  ];

  constructor() {
    //this.insertIfNotExistend();
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
    }
  }
}
