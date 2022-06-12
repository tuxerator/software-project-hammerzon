import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/models/Category';
import { CategoryService } from 'src/app/services/category.service';
import { ImageService } from 'src/app/services/image.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  public categories?:Category[];

  public new_image_id?:string;
  public new_name?:string;

  constructor(private catergoryService:CategoryService,private imageService:ImageService) { }

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories()
  {
    this.catergoryService.getCategoriesList().subscribe({
      next: (obj) => this.categories = obj.categories,
      error: (err) => console.log(err.error)
    });
  }

  uploadImage(inputElement: any) {
    const file: File = inputElement.files[0];
    this.imageService.uploadFileImage(file,this.new_image_id,false).subscribe({
      next: (res) => {
        this.new_image_id = res.id;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  addCategory()
  {
    if(this.new_name && this.new_image_id)
    {
      this.catergoryService.addCategory(new Category(this.new_name,this.new_image_id)).subscribe({
        next: () => this.getCategories(),
        error: (err) => console.log(err)
      });
    }
  }
}
