import { IUser, User } from '../Models/User';

export default class UserTestData{
    public list : (Pick<IUser,'firstName'|'lastName'|'email'|'password'|'role'|'address'> &{_id:string})[] = [
        {
            _id:'6284efd5b72a93135fb79c87',
            firstName : 'Armin',
            lastName : 'Admin',
            email : 'armin@admin.de',
            password: '$2b$10$IrEgO9bVGjaBxdS/GXA4ZuV0SJCnOnh0f69O38Nl89Cu6ncOG2RVa',  // LVnxyNmrQa8WdPs
            role : 'admin',
            address:{
                street: 'Adminstraße',
                houseNum: '42',
                postCode: '42424',
                city: 'Adminstadt',
                country: 'Deutschland'
            }
        },
        {
            _id:'6284efd5b72a93135fb79c88',
            firstName : 'Max',
            lastName : 'Mustermann',
            email : 'max@muster.de',
            password: '$2b$10$GfcJ0S9XRCbJp7q05EFwJOLSGa0Twy3V/W5cJ9raQFCWACDpS5E/6', // LCPTNVq4Rz5Pf2F
            role : 'user',
            address:{
                street: 'Userstraße',
                houseNum: '42',
                postCode: '42424',
                city: 'Userstadt',
                country: 'Deutschland'
            }
        },
    ];

    constructor()
    {
        this.insertIfNotExistend();
        //Order.deleteMany({}).exec();
    }

    async insertIfNotExistend(): Promise<void>  {
      const vals : IUser[] = await User.find({});
      console.log(vals);
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
