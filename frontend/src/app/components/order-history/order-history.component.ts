import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import {  ProductInfo } from 'src/app/services/landingpage.service';
import { OrderInfo, OrderService } from 'src/app/services/order.service';
import { ProductDetails, ProductdetailsService } from 'src/app/services/productdetails.service';

@Component({
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {
  orderList? : OrderInfo[];
  combined? : {order: OrderInfo, product: ProductInfo}[] = [];
  user: User|undefined;

  constructor(private OrderService: OrderService,
              private productService: ProductdetailsService,
              private authService : AuthService
    ) { }

    ngOnInit(): void {
      this.listAllOrdersByUser();
    }
  
    listAllOrdersByUser() : void{
      this.OrderService.listAllOrdersByUser().subscribe({
        // next: Value arrived successfully!
        next: value => {
            console.log('List of all Orders from this user:');
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
        this.orderList.forEach((currentOrder) => {
            this.productService.getProductDetails(String(currentOrder.product)).subscribe(
            {
              next: (val)=>{
                  this.combined?.push({order:currentOrder, product: val});
              },
              error: (err)=> {
                console.log(err);
              }
            }
          );
        });
      }
    } 

    

  // get order data by userid
  // combine with productdata
}
