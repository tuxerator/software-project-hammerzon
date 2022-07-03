
export class Category{
  _id='';
  name:string;
  image_id:string;
  color:string;
  icon:string;
  custom:boolean;

  constructor(name:string,image_id:string,color:string,icon:string,custom:boolean){
    this.name = name;
    this.image_id = image_id;
    this.color = color;
    this.icon = icon;
    this.custom = custom;
  }
}
