import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { LandingpageService, ProductInfo } from 'src/app/services/landingpage.service';
import { OrderInfo, OrderList, OrderService } from 'src/app/services/order.service';
import { ProductDetails, ProductdetailsService } from 'src/app/services/productdetails.service';

// works only when logged out right now! 

@Component({
  templateUrl: './all-orders.component.html',
  styleUrls: ['./all-orders.component.css']
})
export class AllOrdersComponent implements OnInit {
  public orderList? : OrderInfo[];
  public productList? : ProductDetails[] = [];
  public combined? : {order: OrderInfo, product: ProductInfo, orderingUser: User}[] = [];

  constructor(private OrderService: OrderService,
              private productService: ProductdetailsService,
              private authService : AuthService
    ) { }

  ngOnInit(): void {
    this.listAllOrders();
  }

  listAllOrders() : void{
    this.OrderService.listAllOrders().subscribe({
      // next: Value arrived successfully!
      next: value => {
          console.log('List of all Orders:');
          this.orderList = value;
          console.log(this.orderList);
          this.getProductInfo();
      },

      // error: There was an error.
      error: err => {
          console.error(err);
      }
    });
    
  }
  /**
   * get additional information about the orders from the user and product schemas
   */
  getProductInfo() : void {
    if(this.orderList)
    {
      this.orderList.forEach((currentOrder,index) => {
          this.productService.getProductDetails(String(currentOrder.product)).subscribe(
          {
            next: (val)=>{
              if(this.productList)
              {
                this.productList.push(val);
              }
              this.authService.getUserById(String(currentOrder.orderingUser)).subscribe(
                {
                  next: (val)=>{
                    if(this.productList)
                    {
                      this.combined?.push({order: currentOrder, product: this.productList[index], orderingUser: val});
                    }
                  },
                  error: (err)=> {
                    console.log(err);
                  }
                }
              );
            },
            error: (err)=> {
              console.log(err);
            }
          }
        );
      });
    }
  } 


}
