
export class User{
  public _id?:string;
  public firstName:string;
  public lastName:string;
  public email:string;
  public password?:string;
  public role?:'user'|'admin' = 'user';
  public address:Address;

  constructor(mail: string, password: string, firstName: string, lastName: string, address: Address) {
    this.email = mail;
    this.firstName = firstName;
    this.lastName = lastName;
    this.password = password;
    this.address = address;
  }

}

export class Address {

  public street: string;
  public houseNum: string;
  public city: string;
  public postCode: string;
  public country: string;

  constructor(street: string, houseNum: string, city: string, postCode: string, country: string) {
    this.city = city;
    this.country = country;
    this.houseNum = houseNum;
    this.postCode = postCode;
    this.street = street;
  }

}
