import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../models/User';
import { AuthService } from '../../services/auth.service';

import {
  Product,
  getAppointmentString,
  getDurationString,
  Availability,
  Rating,
  roundTo2Digits,
  getCategory, getDateString
} from '../../models/Product';
import { ProductService } from '../../services/product.service';
import { Subject } from 'rxjs';
import { AppointemntAction, OrderService } from '../../services/order.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Category } from '../../models/Category';

@Component({
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  product!: Product;
  //public productID: string;
  user: User | undefined;
  appointmentDate?: Date;
  defaultTimeFrame!: Availability;
  appointmentChanged: Subject<AppointemntAction> = new Subject<AppointemntAction>();

  //@ViewChild('selector') appointmentSelector:AppointmentSelectorComponent;

  showRatingForm = false;
  showMoreRating = false;
  hasOrdered = false;
  hasRated = false;
  currentRating = 1;
  public addRatingForm: FormGroup = this.formBuilder.group({
    comment: new FormControl('', [Validators.required])
  });

  similarProducts?: Product[];

  id = '';

  // Zum formatieren der Daten
  public loading: { product: boolean, similar: boolean, hasRated: boolean, hasOrdered: boolean, image: boolean } = {
    product: false,
    similar: false,
    hasRated: false,
    hasOrdered: false,
    image: false
  };


  constructor(private route: ActivatedRoute,
              private productService: ProductService,
              private router: Router,
              public authService: AuthService,
              public orderService: OrderService,
              private formBuilder: FormBuilder,
  ) {
  }

  public get roundTo2Digits(): (val: number) => string {
    return roundTo2Digits;
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

    console.log(this.id);
    console.log(this.productService);
    //Find product that correspond with the name provided in route.
    //this.route= ProductInfo.find(product=>product._id===productIDFromRoute);
    this.loading.product = true;
/*
    this.productService.getProductDetails(this.id).subscribe(
      {
        next: (val) => {
          this.onProductRecieved(val);
          this.product.duration = new Date(this.product.duration);

          console.log('Availabilities', this.product.availability);



          this.defaultTimeFrame = new Availability(new Date(this.product.defaultTimeFrame.start), new Date(this.product.defaultTimeFrame.end));

          console.log('Set defaultTimeFrame',this.defaultTimeFrame);

          this.orderService.getAppointmentChanged(this.product).subscribe(this.appointmentChanged.next.bind(this.appointmentChanged));

          this.loading.product = false;

          console.log(this.product);
          console.log(this.user);
        },
        error: (err) => {
          console.log(err);
          // Wenn etwas schief läuft einfach wieder zu landing page
          this.router.navigate(['/']);
        }
      }
    );
*/

    this.user = this.authService.user;

    console.log('product: ', this.product);
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

  public onImageLoaded(): void {
    this.loading.image = false;
    console.log(this.loading.image);
  }

  public changeId(id: string): void {
    window.scrollTo({
      top: 0,
      left: 0,
    });

    window.scroll({
      top: 0,
      left: 0,
    });
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
        next: (product: Product) => {
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
      next: (val) => {
        this.hasOrdered = val;
        console.log('has the user ordered? ' + val);
        this.loading.hasOrdered = false;
      },
      error: (err) => {
        console.log(err);
        this.loading.hasOrdered = false;
      }
    });

    this.productService.hasRated(this.id).subscribe({
      next: (val) => {
        this.hasRated = val;
        console.log('has the user rated? ' + val);
        this.loading.hasRated = false;
      },
      error: (err) => {
        console.log(err);
        this.loading.hasRated = false;
      }
    });


  }

  onProductRecieved(product: Product): void {
    this.product = product;
    this.product.duration = new Date(this.product.duration);
    for (let i = 0; i < this.product.availability.length; i++) {
      this.product.availability[i].startDate = new Date(this.product.availability[i].startDate);
      this.product.availability[i].endDate = new Date(this.product.availability[i].endDate);
    }

    this.defaultTimeFrame = new Availability(new Date(this.product.defaultTimeFrame.start), new Date(this.product.defaultTimeFrame.end));

    if (this.product.ratings) {
      for (let i = 0; i < this.product.ratings.length; i++) {
        const currentRating = this.product.ratings[i];
        if (currentRating.date) {
          this.product.ratings[i].date = new Date(currentRating.date);
        }
      }
    }

    console.log(this.product);
    console.log(this.user);
    //this.loading.product = true;

    this.productService.hasRated(this.id).subscribe({
      next: (val) => {
        this.hasRated = val;
        console.log('has the user rated? ' + val);
        //this.loading.product = false;
      },
      error: (err) => {
        console.log(err);
        //this.loading.product = false;
      }
    });
  }

  onSubmit(): void {
    console.log('On Submit');
    const form = this.addRatingForm.value;
    if (this.user) {
      console.log('is On Submit and User');
      this.loading.hasRated = true;
      const rating: Rating = new Rating(this.currentRating, form.comment);
      this.productService.submitRating(this.id, rating).subscribe({
        next: (product) => {
          this.onProductRecieved(product);
          this.loading.hasRated = false;
        },
        error: (error) => {
          console.log(error);
          this.loading.hasRated = false;
        }
      });
    }
  }

  getDate(date?: Date): string {
    if(date)
    {
    return getDateString(date);
    }
    return 'Fehler';
  }

  //erhöhen/reduzieren des "hilfreiche Bewertungen" counters

  setProduct(product: Product): void {
    this.product = product;
  }

  canRateAsHelpful(array: string[]): boolean {
    const id = this.user?._id;
    if (id) {
      return !array.includes(id);
    }
    return false;
  }

  rateAsHelpful(rating: Rating): void {
    const id = this.user?._id;
    const pid = this.product?._id;
    if (id && pid) {
      rating.helpfulUsers.push(id);
      this.productService.updateRating(pid, rating).subscribe({
        next:
          this.onProductRecieved.bind(this),
        error: (err) => {
          console.log(err);
        }
      });
    }
  }

  unrateAsHelpful(rating: Rating): void {
    const pid = this.product?._id;
    const id = this.user?._id;
    console.log('pid');
    console.log(pid);
    console.log('id');
    console.log(id);
    if (id && pid) {
      console.log(rating.helpfulUsers);
      console.log(id);
      rating.helpfulUsers = rating.helpfulUsers.filter(elem => elem !== id);
      this.productService.updateRating(pid, rating).subscribe({
        next:
          this.onProductRecieved.bind(this),
        error: (err) => {
          console.log(err);
        }
      });
    }
  }

  getAppointString(app?: Availability): string {
    if (app) {
      return getAppointmentString(app);
    }
    return 'Fehler';
  }

  deleteProduct(): void {
    this.productService.removeProduct(this.id).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.log(err.error);
        }
      }
    );

  }


  /**
   * Routs to order-product page if user is logged in otherwise routes to login page.
   */
  orderProduct(appointment: Availability): void {
    this.orderService.currentlySelectedAppointment = appointment;
    this.router.navigate(['order-product'], { relativeTo: this.route }).catch(err => console.log(err));

    /*if (this.user) {
      this.orderService.currentlySelectedAppointment = appointment;
      this.router.navigate(['order-product'], {
        relativeTo: this.route
      }).catch(err => console.log(err));
    } else {
      this.router.navigate(['login', {returnUrl: this.state.url}]).catch(err => console.log(err));
    }*/
  }

  getCategory(): Category | undefined {
    return this.product ? getCategory(this.product) : undefined;
  }

  getDurString(): string {
    return getDurationString(this.product?.duration);
  }

  getTotalPrice(): number {
    if (this.product) {
      return this.product.prize * (this.product.duration.getTime() / (3600000));
    }
    return 0;
  }

}
