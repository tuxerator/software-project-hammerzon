import { IOrder, Order } from './Models/Order';
import { IUser, User } from './Models/User';
export default class UserTestData{

    public list : any[] = [
        {
            firstName : 'Max',
            lastName : 'Mustermann',
            email : 'max@gmail.com',
            password: 'Password123!',
            role : 'user',
            address:{
                street: 'Musterstrasse',
                houseNum: '23',
                postCode: '54321',
                city: 'Stadt',
                country: 'Deutschland'
            }
        }
    ];

    constructor()
    {
        this.insertIfNotExistend();
        //Order.deleteMany({}).exec();
    }
  
    async insertIfNotExistend(): Promise<void>  {
      const vals : IUser[] = await User.find({});
      if(!vals || vals.length <= 0)
      {
          console.log('Inserting Users');
          await User.insertMany(this.list);
          const current: IUser[] = await User.find({}).exec();
          console.log(current);
      }else{
          console.log('User already exist');
      }
    }
}