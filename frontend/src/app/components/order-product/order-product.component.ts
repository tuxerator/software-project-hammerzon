import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService, PostOrder } from 'src/app/services/order.service';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { Availability, getAppointmentString, getDurationString, Product } from 'src/app/models/Product';
import { ProductService } from 'src/app/services/product.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { PaymentService, PaymentType } from 'src/app/services/payment.service';
import { ClientSideFnValidation, ClientSideValidation, ServerSideFnFnValidation, ServerSideFnValidation, ServerSideValidation, ValidationToText } from 'src/app/validationToText';



@Component({
  templateUrl: './order-product.component.html',
  styleUrls: ['./order-product.component.css']
})
export class OrderProductComponent implements OnInit , OnDestroy{
  product: Product | undefined;
  user: User | undefined;
  appointment: Availability | undefined;
  orderRegistered : Boolean|undefined;
  cancelled : Boolean = false;


  paymentType:PaymentType = PaymentType.HCIPAL;
  modalState: 'confirm'|'pay'|'waiting' = 'confirm';
  merchantName = '';
  // Validator werden ausgewählt abhängig von wo wir uns befinden im Modal und welches Zahlungsmethode gewählt wurde
  public accountForm: FormGroup = this.formBuilder.group({
    account: new FormControl('', this.PaymentTypeValidators({
      // Zahlungs Methode     // confirm-State                    // pay-state
      [PaymentType.HCIPAL]: [[Validators.email,Validators.required],[]],
      [PaymentType.SWPSAFE]:[[Validators.required],[]],
      [PaymentType.BACHELORCARD]:[[Validators.required],[]],
    })),
    password: new FormControl('', this.PaymentTypeValidators({
      [PaymentType.HCIPAL]: [[],[Validators.required]],
      [PaymentType.SWPSAFE]:[[],[Validators.required]],
      [PaymentType.BACHELORCARD]:[[],[Validators.required,this.maxInt(999)]],
    })),
    fullName: new FormControl('',this.PaymentTypeValidators({
      [PaymentType.HCIPAL]: [[],[]],
      [PaymentType.SWPSAFE]:[[],[]],
      [PaymentType.BACHELORCARD]:[[],[Validators.required]],
    })),
    expirationMonth: new FormControl('',this.PaymentTypeValidators({
      [PaymentType.HCIPAL]: [[],[]],
      [PaymentType.SWPSAFE]:[[],[]],
      [PaymentType.BACHELORCARD]:[[],[Validators.required,this.maxInt(12)]],
    })),
    expirationYear: new FormControl('',this.PaymentTypeValidators({
      [PaymentType.HCIPAL]: [[],[]],
      [PaymentType.SWPSAFE]:[[],[]],
      [PaymentType.BACHELORCARD]:[[],[Validators.required,this.maxInt(99)]],
    })),
  });

  public valdationdToText = new ValidationToText(
    {
      'account': {
        valid:[
                new ServerSideFnValidation(this.getPaymentTypeDependentText('Emailadresse nicht gefunden', 'Swpsafe-Code nicht gültig', 'Karte nicht vorhanden'),undefined,'Bad Request'),
                new ServerSideValidation('Account kommt aus nicht aus Deutschland',undefined,'Is not from germany'),
                new ServerSideValidation('Nicht Genügend Guthaben',undefined,'Not enough balance on account'),
                new ServerSideValidation('Dieser Termin wurde schon gebucht',undefined,'Appointment overlaps with existing appointment'),
                new ClientSideFnValidation(this.getPaymentTypeDependentText('Email gültig','Swp-Code gültig','Kartenummer korrekt'),false)
              ],
        invalid:new ClientSideFnValidation(this.getPaymentTypeDependentText('Ungültige Email','Swp-Code erwartet','Kartennummer erwartet'))
      },
      'password': {
        valid:[
                new ServerSideFnFnValidation(this.getPaymentTypeDependentText('Passwort nicht korrekt','','Sicherheitscode nicht korrekt'),undefined,this.getPaymentTypeDependentText('Invalid data','','Invalid data')),
                new ServerSideValidation('Nicht Genügend Guthaben',undefined,'Not enough balance on account'),
                new ServerSideValidation('Sicherheits Code nicht korrekt',undefined,'Missing data: Missing payment>paymentDetails>securityCode'),
                new ClientSideValidation('Korrektes Passwort',false)
              ],
        invalid: new ClientSideValidation('Ungültige Eingabe')
      },
      'fullName': {
        valid:[
          new ClientSideValidation('Name gültig',false)
        ],
        invalid:new ClientSideValidation('Bitte Name eingeben',false)
      },
      'expirationMonth':{
        valid:[
          new ServerSideValidation('Ablaufsdatum (MM/JJ) fehlerhaft',undefined,'Invalid expiry date format'),
          new ServerSideValidation('Ablaufsdatum (MM/JJ) fehlerhaft',undefined,'Invalid data'),
          new ClientSideValidation('Ablaufsdatum gültig',false)
        ],
        invalid: new ClientSideValidation('Gültiges Ablaufsdatum (MM/JJ) erwartet')
      },
      'expirationYear':{
        valid:[
          new ServerSideValidation('Ablaufsdatum (MM/JJ) fehlerhaft',undefined,'Invalid expiry date format'),
          new ServerSideValidation('Ablaufsdatum (MM/JJ) fehlerhaft',undefined,'Invalid data'),
          new ClientSideValidation('Ablaufsdatum gültig',false)
        ],
        invalid: new ClientSideValidation('Gültiges Ablaufsdatum (MM/JJ) erwartet')
      }
    },
    this.accountForm
  );

  constructor(private route:ActivatedRoute,
              private productService:ProductService,
              private authService: AuthService,
              private orderService: OrderService,
              private router: Router,
              private formBuilder: FormBuilder,
              private payment:PaymentService) {
  }

  public getPaymentTypeDependentText(hcipal:string,swpsafe:string,bachelorcard:string):() => string
  {
    return () => {
      switch(this.paymentType)
      {
        case PaymentType.HCIPAL:
          return  hcipal;

        case PaymentType.SWPSAFE:
          return  swpsafe;

        case PaymentType.BACHELORCARD:
          return  bachelorcard;
      }
    };
  }

  public PaymentTypeValidators(validatorsByPaymenttype: {[key in PaymentType]:ValidatorFn[][]}): ValidatorFn {
    return (control:AbstractControl):null|ValidationErrors => {
      const i = this.modalState === 'pay' ? 1 : 0;
      const validators:ValidatorFn[] = validatorsByPaymenttype[this.paymentType][i];

      for(const validator of validators)
      {
        const err = validator(control);
        if(err !== null)
        {
          return err;
        }
      }
      return null;
    };
  }

  // Returns a Validator Which check weather a given control is parseable to a int and is smaller than a given number
  public maxInt (number:number)
  {
    return (control:AbstractControl) : null|ValidationErrors =>
    {
      const value = parseInt(control.value);

      if (value === undefined || isNaN(value)) {
        return {
          notAnumber: true
        };
      }

      if(value > number || value < 0)
      {
        return {
          numberToBig: true
        };
      }

      return null;
    };
  }

  abort(): void {
    this.modalState = 'confirm';
    this.accountForm.markAsUntouched();
    //this.errorMessage = undefined;
    this.valdationdToText.setErrorMessage(undefined);
    const keys = Object.keys(this.accountForm.controls);
    keys.forEach(key => {
      this.accountForm.controls[key].setValue('');
    });
  }

  confirm(): void{
    if(this.modalState === 'confirm')
    {
      this.accountForm.markAllAsTouched();
      console.log(this.accountForm);
      if(this.accountForm.valid)
      {
        const account = this.accountForm.value.account;
        this.merchantName = `${this.product?.user?.firstName} ${this.product?.user?.lastName} - Hammerzon (Handwerker Portal Gruppe 01)`;
        this.payment.getRightCountry(this.paymentType,account,this.merchantName)
        .subscribe({
          next: () => {
            this.modalState = 'pay';
            this.valdationdToText.setErrorMessage(undefined);
        },
          error: (err) => this.valdationdToText.setErrorMessage(err.error.message),
        });
      }
    }
  }



  pay():void
  {
    if(this.modalState === 'pay')
    {
      this.accountForm.markAllAsTouched();
      //this.valdationdToText.setErrorMessage(undefined);
      console.log(this.accountForm);
      if(this.accountForm.valid && this.product && this.orderService.currentlySelectedAppointment)
        {
          const password = this.accountForm.value.password;
          const expirationMonth= this.accountForm.value.expirationMonth;
          const expirationYear = this.accountForm.value.expirationYear;
          const fullName = this.accountForm.value.fullName;
          const postOrder: PostOrder = {productId:this.product._id, appointment:this.orderService.currentlySelectedAppointment};
          this.modalState = 'waiting';
          this.payment.getPaymentFinish(this.paymentType,postOrder,password,fullName,this.merchantName,`${expirationMonth}/${expirationYear}`)
          .subscribe({
            next: () => {
              this.closeModal();
              const url = `productdetails/${this.product?._id}/order-product/order-finalized`;
              this.router.navigateByUrl(url);
            },
            error: (err) => {
              console.log(err.error.message);
              this.valdationdToText.setErrorMessage(err.error.message);
              this.modalState = 'pay';

            }
          });
      }
    }
  }

  switchPaymentType(type:PaymentType):void {
    this.paymentType = type;
  }

  public get PaymentType():typeof PaymentType {
    return PaymentType;
  }

  public get Object() : ObjectConstructor
  {
    return Object;
  }
  ngOnDestroy(): void {
      this.closeModal();
  }

  ngOnInit(): void {
    // get the productinfo again
    const routeParams = this.route.snapshot.paramMap;
    const productIDFromRoute = String(routeParams.get('id'));
    this.appointment = this.orderService.currentlySelectedAppointment;


    /**
     * get information about the product , register the order (make functions?)
     */
    this.productService.getProductDetails(productIDFromRoute).subscribe(
      {
        next: (val) => {
          this.product = val;
          this.product.duration = new Date(this.product.duration);

        },
        error: (err) => {
          console.log(err);
        }
      }
    );
    // get the userinfo
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

  closeModal():void
  {
    document.querySelector('#modal')?.classList.remove('show');
    const body = document.querySelector('body');
    body?.classList.remove('modal-open');
    body?.style.removeProperty('overflow');
    const mdbackdrop = document.querySelector('.modal-backdrop');
    if (mdbackdrop){
      mdbackdrop.classList.remove('modal-backdrop', 'show');
    }
  }

  getDurString(): string {
    return getDurationString(this.product?.duration);
  }

  getAppointString(): string {
    if(this.appointment)
    {
    return getAppointmentString(this.appointment);
    }return 'Fehler';
  }
}
