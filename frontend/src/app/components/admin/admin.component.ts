import { Component, OnInit } from '@angular/core';

export type Tab = {
  name:string,
  icon:string,
  selector:string
}


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  public allTabs?:Tab[];

  public currentTab?:Tab;

  constructor() {

   }

  ngOnInit(): void {
    this.allTabs = [{
      name:'Kategory',
      icon:'bi-bookmarks-fill',
      selector:'app-category'
    },
    {
      name:'Alle Bestellungen',
      icon:'bi-table',
      selector:'app-all-orders'
    },
    {
      name:'Alle Aktivitäten',
      icon:'bi-clock-fill',
      selector:'app-activity'
    }
  ];
  this.currentTab = this.allTabs[0];
  }

  public changeTab(tab:Tab):void
  {
    this.currentTab= tab;
  }

  public getTabClasses(tab:Tab):string[]
  {
    if(tab === this.currentTab)
    {
      return ['active'];
    }
    return ['text-white'];
  }
}
