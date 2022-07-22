import { User } from './User';

export interface Activity{
  user:User;
  desc:string;
  highlights:Highlight[]
  date:Date
}

export interface Highlight{
  text:string,
  bsColor:string
}
