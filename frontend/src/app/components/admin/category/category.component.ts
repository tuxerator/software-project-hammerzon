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
  public new_color?:string = '#fff';
  public new_icon?:string;
  public is_custom = false;

  constructor(private catergoryService:CategoryService,private imageService:ImageService) { }

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories(): void {
    this.catergoryService.getCategoriesList().subscribe({
      next: (obj) => this.categories = obj.categories,
      error: (err) => console.log(err.error)
    });
  }

  uploadImage(inputElement: HTMLInputElement): void {
    if (!inputElement.files || inputElement.files.length === 0) {
      return;
    }
    const file: File = inputElement.files[0];
    this.imageService.uploadFileImage(file, this.new_image_id, false).subscribe({
      next: (res) => {
        this.new_image_id = res.id;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  colorChanged(colorElement:any)
  {
    this.new_color = colorElement.value;
  }

  addCategory(): void {
    console.log(this.new_color);
    if (this.new_name && this.new_image_id && this.new_color && this.new_icon) {
      this.catergoryService.addCategory(new Category(this.new_name, this.new_image_id, this.new_color, this.new_icon, this.is_custom)).subscribe({
        next: () => {
          this.getCategories();
          this.new_name = undefined;
          this.new_image_id = undefined;
          this.new_color = undefined;
        },
        error: (err) => console.log(err)
      });
    }
    else
    {
      console.log('one element could not be found');
    }
  }
}
