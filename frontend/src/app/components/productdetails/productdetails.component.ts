import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../models/User';
import { AuthService } from '../../services/auth.service';
import { Category } from 'src/app/models/Category';
import { Product, getAppointmentString, getDurationString, Rating,getCategory, roundTo2Digits } from '../../models/Product';
import { ProductService } from '../../services/product.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ReadableByteStreamControllerCallback } from 'stream/web';

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
  public loading:{product:boolean, similar:boolean,hasRated:boolean,hasOrdered:boolean,image:boolean} = {product:false,similar:false,hasRated:false,hasOrdered:false,image:false};


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

    //this.user = this.authService.user;
    // is there a user logged in? get the user.
    this.authService.getUser().subscribe(
      {
        next: (val) => {
          this.user = val;
        },
        error: (err) => {
          console.log(err);
        }
      }
    );
  }

  public onImageLoaded()
  {
    this.loading.image = false;
    console.log(this.loading.image);
  }

  public changeId(id:string):void
  {
    this.id = id;

    this.loading.product = true;
    this.loading.similar = true;
    this.loading.hasOrdered = true;
    this.loading.hasRated = true;
    this.loading.image = true;

    console.log(this.id);
    console.log(this.productService);
    //Find product that correspond with the name provided in route.
    //this.route= ProductInfo.find(product=>product._id===productIDFromRoute);
    this.productService.getProductDetails(this.id).subscribe(
      {
        next: (product:Product)=> {
          //this.product = product;
          this.onProductRecieved(product);
          this.loading.product = false;

        },
        error: (err) => {
          console.log(err);
          this.loading.product = false;
          // Wenn etwas schief läuft einfach wieder zu landing page
          this.router.navigate(['/']);
        }
      }
    );

    this.productService.getSimilarProducts(this.id).subscribe(
      {
        next: (res) => {
          this.similarProducts = res.list;
          this.loading.similar = false;
        },
      }
    );

    this.productService.hasOrdered(this.id).subscribe({
      next:(val) => {
        this.hasOrdered = val;
        console.log('has the user ordered? ' + val);
        this.loading.hasOrdered = false;
      },
      error:(err) =>
      {
        console.log(err);
        this.loading.hasOrdered = false;
      }
    });

    this.productService.hasRated(this.id).subscribe({
      next:(val) => {
        this.hasRated = val;
        console.log('has the user rated? ' + val);
        this.loading.hasRated = false;
      },
      error:(err) =>
      {
        console.log(err);
        this.loading.hasRated = false;
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
    this.loading.product = true;
    this.productService.removeProduct(this.id).subscribe({
      next:() => {
        this.router.navigate(['/']);
        this.loading.product = false;
      },
      error:(err) =>
      {
        console.log(err.error);
        this.loading.product = false;
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
      //this.loading.product = true;

      this.productService.hasRated(this.id).subscribe({
        next:(val) => {
          this.hasRated = val;
          console.log('has the user rated? ' + val);
          //this.loading.product = false;
        },
        error:(err) =>
        {
          console.log(err);
          //this.loading.product = false;
        }
      });
  }


  onSubmit()
  {
    console.log('On Submit');
    const form = this.addRatingForm.value;
    if(this.user)
    {
      console.log('is On Submit and User');
      this.loading.hasRated = true;
      const rating : Rating = new Rating(this.currentRating, form.comment);
      this.productService.submitRating(this.id, rating).subscribe({
        next: (product) => {
          this.onProductRecieved(product);
          this.loading.hasRated = false;
        },
        error:(error) => {
          console.log(error);
          this.loading.hasRated = false;
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

  //erhöhen/reduzieren des "hilfreiche Bewertungen" counters

  canRateAsHelpful(array : string[]) : boolean{
    const id = this.user?._id;
    if(id){
      return !array.includes(id);
    }
    return false;
  }

  rateAsHelpful(rating : Rating) : void{
    const id = this.user?._id;
    const pid = this.product?._id;
    if(id && pid){
      rating.helpfulUsers.push(id);
      this.productService.updateRating(pid , rating).subscribe({
        next:
          this.onProductRecieved.bind(this),
        error:(err) =>
        {
          console.log(err);
        }
      });
    }
  }

  unrateAsHelpful(rating: Rating) : void {
    const pid = this.product?._id;
    const id = this.user?._id;
    console.log('pid');
    console.log(pid);
    console.log('id');
    console.log(id);
    if(id && pid){
      console.log(rating.helpfulUsers);
      console.log(id);
      rating.helpfulUsers = rating.helpfulUsers.filter(elem =>  elem !== id);
      this.productService.updateRating(pid , rating).subscribe({
        next:
          this.onProductRecieved.bind(this),
        error:(err) =>
        {
          console.log(err);
        }
      });
    }
  }


  public get roundTo2Digits():(val: number) => string
  {
    return roundTo2Digits;
  }

}


