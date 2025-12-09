import { Component, Input, OnInit } from '@angular/core';
import { InvoiceItem } from '../../models/invoice.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.css']
})
export class BillComponent implements OnInit {
  @Input() invoice: any;
  
  appName = environment.appConfig.appName;
  appSubName = environment.appConfig.appSubName;
  gstin = environment.appConfig.gstin;
  phone = environment.appConfig.phone;

  constructor() { }

  ngOnInit(): void {
  }

}
