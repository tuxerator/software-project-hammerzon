import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../models/User';
import { AuthService } from '../../services/auth.service';

import { Product, getAppointmentString, getDurationString, Availability } from '../../models/Product';
import { ProductService } from '../../services/product.service';
import { delay, timeout } from 'rxjs';

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

  id: string = '';

  // Zum formatieren der Daten


  constructor(private route: ActivatedRoute,
              private productService: ProductService,
              private router: Router,
              public authService: AuthService) {
  }

  ngOnInit(): void {
    //Get the Product name from the current route.
    console.log('kommt zu Params');
    const routeParams = this.route.snapshot.paramMap;
    this.id = String(routeParams.get('id'));

    console.log(this.id);
    console.log(this.productService);
    //Find product that correspond with the name provided in route.
    //this.route= ProductInfo.find(product=>product._id===productIDFromRoute);
    this.productService.getProductDetails(this.id).subscribe(
      {
        next: (val) => {
          this.product = val;
          this.product.duration = new Date(this.product.duration);
          /*for (let i = 0; i < this.product.appointments.length; i++) {
            this.product.appointments[i].date = new Date(this.product.appointments[i].date);
          }*/

          this.defaultTimeFrame = new Availability(new Date(this.product.defaultTimeFrame.start), new Date(this.product.defaultTimeFrame.end));

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

  tryOrder() {
    if (this.product && this.appointmentDate) {
      const appointment = {
        startDate: this.appointmentDate,
        endDate: this.appointmentDate?.getTime() + this.product?.duration.getTime()
      }
    }
  }

  getDurString(): string {
    return getDurationString(this.product?.duration);
  }

  getAppointString(app?: Availability): string {
    if (app) {
      return getAppointmentString(app);
    }
    return 'Fehler';
  }

  deleteProduct() {
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
  orderProduct(appointment: Availability) {
    if (this.user) {
      this.router.navigate(['order-product'], {
        relativeTo: this.route
      });
    } else {
      this.router.navigate(['login']);
    }
  }

}
