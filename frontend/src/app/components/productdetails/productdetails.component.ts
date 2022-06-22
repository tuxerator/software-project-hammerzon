import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../models/User';
import { AuthService } from '../../services/auth.service';
import { Category } from 'src/app/models/Category';
import { Product, getAppointmentString, getDurationString, Rating,getCategory } from '../../models/Product';
import { ProductService } from '../../services/product.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  templateUrl: './productdetails.component.html',
  styleUrls: ['./productdetails.component.css']
})

export class ProductdetailsComponent implements OnInit {
  product: Product | undefined;
  //public productID: string;
  user: User | undefined;
  showRatingForm : boolean = false;
  hasOrdered :boolean = false;
  hasRated : boolean = false;
  currentRating : number = 1;
  id:string = '';

  similarProducts?:Product[];
  public addRatingForm : FormGroup = this.formBuilder.group({
    comment : new FormControl('', [Validators.required])
  });

  // Zum formatieren der Daten


  constructor(private route:ActivatedRoute,
              private productService:ProductService,
              private router:Router,
              public authService: AuthService,
              private formBuilder : FormBuilder) {
    console.log('kommt zu Params');
  }

  ngOnInit(): void {
    //Get the Product name from the current route.
    console.log('kommt zu Params');
    const routeParams = this.route.snapshot.paramMap;
    this.id = String(routeParams.get('id'));
    this.changeId(this.id);

    this.user = this.authService.user;
    // is there a user logged in? get the user.
    /*this.authService.getUser().subscribe(
      {
        next: (val) => {
          this.user = val;
        },
        error: (err) => {
          console.log(err);
        }
      }
    );*/
  }

  public changeId(id:string):void
  {
    this.id = id;

    console.log(this.id);
    console.log(this.productService);
    //Find product that correspond with the name provided in route.
    //this.route= ProductInfo.find(product=>product._id===productIDFromRoute);
    this.productService.getProductDetails(this.id).subscribe(
      {
        next: this.onProductRecieved.bind(this),
        error: (err) => {
          console.log(err);
          // Wenn etwas schief läuft einfach wieder zu landing page
          this.router.navigate(['/']);
        }
      }
    );

    this.productService.getSimilarProducts(this.id).subscribe(
      {
        next: (res) => this.similarProducts = res.list,
      }
    );

    this.productService.hasOrdered(this.id).subscribe({
      next:(val) => {
        this.hasOrdered = val;
        console.log('has the user ordered? ' + val);
      },
      error:(err) =>
      {
        console.log(err);
      }
    });

    this.productService.hasRated(this.id).subscribe({
      next:(val) => {
        this.hasRated = val;
        console.log('has the user rated? ' + val);
      },
      error:(err) =>
      {
        console.log(err);
      }
    });


    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });

  }

  getCategory():Category|undefined{
    return this.product ? getCategory(this.product): undefined;
  }

  getDurString(): string {
    return getDurationString(this.product?.duration);
  }

  getTotalPrice():number
  {
    if(this.product)
    {
      return this.product.prize * (this.product.duration.getTime() / (3600000)+1);
    }
    return 0;
  }

  getAppointString(date?: Date): string {
    return getAppointmentString(date);
  }

  deleteProduct():void
  {
    this.productService.removeProduct(this.id).subscribe({
      next:() => {
        this.router.navigate(['/']);
      },
      error:(err) =>
      {
        console.log(err.error);
      }
      }
    );
  }

  onProductRecieved(product:Product):void
  {
      this.product = product;
      this.product.duration = new Date(this.product.duration);
      for (let i = 0; i < this.product.appointments.length; i++) {
        this.product.appointments[i].date = new Date(this.product.appointments[i].date);
      }

      if(this.product.ratings)
      {
        for(let i = 0; i < this.product.ratings.length; i++)
        {
          this.product.ratings[i].date = new Date(this.product.ratings[i].date!);
        }
      }

      console.log(this.product);
      console.log(this.user);

      this.productService.hasRated(this.id).subscribe({
        next:(val) => {
          this.hasRated = val;
          console.log('has the user rated? ' + val);
        },
        error:(err) =>
        {
          console.log(err);
        }
      });
  }


  onSubmit()
  {
    const form = this.addRatingForm.value;
    if(this.user)
    {
      const rating : Rating = new Rating(this.currentRating, form.comment);
      this.productService.submitRating(this.id, rating).subscribe({
        next: this.onProductRecieved.bind(this),
        error:(error) => {
          console.log(error);
        }
       });
    }
  }

  getDate(date?:Date):string{
    return getAppointmentString(date);
  }

  setProduct(product:Product) : void {
    this.product = product;
  }
}
