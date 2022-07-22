import { Order, Status } from 'src/app/models/Order';
import { Availability, getAppointmentString, getDateString } from 'src/app/models/Product';
import { OrderService } from 'src/app/services/order.service';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/User';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';



@Component({
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {
  orderList? : Order[];
  user? : User;
  public status = Status;
  url = '';

  constructor(private orderService: OrderService,
              private authService: AuthService,
              private router: Router,
              @Inject(DOCUMENT) private document: any
  )
  {
    (window as any).pdfMake.vfs = pdfFonts.pdfMake.vfs;
  }

  ngOnInit(): void {
    this.listAllOrdersByUser();
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

    this.url = this.document.URL;
    console.log(this.url);
  }

  listAllOrdersByUser(): void {
    this.orderService.listAllOrdersByUser().subscribe({
      // next: Value arrived successfully!
      next: value => {
        console.log('List of all Orders from this user:');
        this.orderList = value;
        console.log(this.orderList);
        for(let i = 0; i < this.orderList.length; i++)
        {
          this.orderList[i].timeOfOrder = new Date(this.orderList[i].timeOfOrder);
        }
        for(let i = 0; i < this.orderList.length; i++)
        {

          this.orderList[i].appointment.startDate = new Date(this.orderList[i].appointment.startDate);
          this.orderList[i].appointment.endDate = new Date(this.orderList[i].appointment.endDate);
        }
        console.log(this.orderList);
      },

      // error: There was an error.
      error: err => {
        console.error(err);
      }
    });
  }
  async makeInvoice(index:number): Promise<void> {
    if(this.orderList && this.user)
    {
      const order = this.orderList[index];
      const user = this.user;
      const product = order.product;
      const duration = new Date(product.duration);
      const cost = product.prize * (duration.getTime() / (3600 * 1000));
      const url = this.url;
      let logo  = '';
      await fetch('/assets/hammerzon1.base64')
        .then(response => response.text())
        .then(data => {
          console.log(data);
          logo = data;
        });
      console.log(url);
      const document : TDocumentDefinitions = {
        content: [
        {
          columns: [
            {
              text : 'Rechnung', fontSize: 24
            },
            {
              image: logo,
              width: 150,
              alignment: 'right'
            }
          ]
        },
        {
          text: `Rechnungsnummer: ${order._id}\n\n`
        },
        {
          text: `${user.firstName} ${user.lastName}
                 ${user.address.street}
                 ${user.address.postCode} ${user.address.city}\n\n`
        },
        {
          layout : 'lightHorizontalLines',
          table : {
            headerRows : 1,
            body : [
              ['Dienstleistung', 'Handwerker', 'Termin', 'Preis'],
              [product.name, `${product.user?.firstName} ${product.user?.lastName}`, this.getDateString(order.appointment), `${cost} €`]
            ]
          }
        },
        {
          text : '\n\n'
        },
        {
          qr : url
        }
        ]
      };
      pdfMake.createPdf(document).download(`rechnung-${order._id}.pdf`);
    }
  }

  getDateString(date?:Availability):string
  {
    if(date)
    {
        return getAppointmentString(date);
    }
    return 'Fehler';
  }


  getTimeOrderString(date?: Date): string {
    if(date)
    {
        return getDateString(date);
    }
    return 'Fehler';
  }

}
