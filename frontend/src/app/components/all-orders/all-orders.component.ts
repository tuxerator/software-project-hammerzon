import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
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
  public productList : ProductDetails[] = [];
  public combined? : {order: OrderInfo, product: ProductInfo}[] = [];

  constructor(private OrderService: OrderService,
              private productService: ProductdetailsService
    ) { }

  ngOnInit(): void {
    this.listAllOrders();
  }

  listAllOrders() : void {
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
  getProductInfo() : void {
    if(this.orderList)
    {
      this.orderList.forEach(currentOrder => {
        this.productService.getProductDetails(String(currentOrder.product)).subscribe(
          {
            next: (val)=>{
              console.log(val);
              this.combined?.push({order: currentOrder, product:val});
              console.log(this.combined);
            },
            error: (err)=> {
              console.log(err);
            }
          }
        );
      });
    }
  } 

  getUserInfo() : void {
    if(this.orderList)
    {
      this.orderList.forEach(currentOrder => {
        this.productService.getProductDetails(String(currentOrder.product)).subscribe(
          {
            next: (val)=>{
              console.log(val);
              this.combined?.push({order: currentOrder, product:val});
              console.log(this.combined);
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
