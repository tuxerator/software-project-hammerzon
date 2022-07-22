import { Component, OnInit } from '@angular/core';

@Component({
  templateUrl: './order-finalized.component.html',
  styleUrls: ['./order-finalized.component.css']
})
export class OrderFinalizedComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
    const mdbackdrop = document.querySelector('.modal-backdrop');
    if (mdbackdrop){
      mdbackdrop.classList.remove('modal-backdrop', 'show');
    }
  }

}
