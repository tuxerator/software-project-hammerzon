import { Component, OnInit } from "@angular/core";
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators,ReactiveFormsModule } from '@angular/forms';
import { Router } from "@angular/router";
import { Address, User } from "../../models/User";
import {AuthService} from '../../services/auth.service';

@Component({
    selector: "app-registration",
    templateUrl: "./registration.component.html",
    styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit{
    public errorMessage?: string;

    public passwordMatchingValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
      const password = control.get('password');
      const confirmPassword = control.get('confirmPassword');
      return password?.value === confirmPassword?.value ? null : { notMatch: true };
    };

    public registerForm: FormGroup = this.formBuilder.group({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      street: new FormControl('', [Validators.required]),
      houseNum: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      postCode: new FormControl('', [Validators.required]),
      country: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required])
    }, {validators: this.passwordMatchingValidator});

    constructor(private formBuilder: FormBuilder,private authService:AuthService,private router:Router){}

    ngOnInit(): void {

    }

    public onSubmit()
    {
      this.registerForm.markAllAsTouched();
      // Sind alle Eingaben valid
      if(this.registerForm.invalid)return;

      // Für besser lesbarkeit des Code
      const form = this.registerForm.value;

      // Neue User und adreese erstellt
      const address : Address = new Address(form.street,form.houseNum,form.city,form.postCode,form.country);

      const newUser:User = new User(form.email,form.password,form.firstName,form.lastName,address);
      // Authservice registerung anfrage an backend schicken
      this.authService.register(newUser).subscribe({
        next: () => {
          this.errorMessage = undefined;
          this.router.navigate(['login']);
        },
        error: (err) => {
          this.errorMessage = err.error.message;
          console.error(err);
        }
      });
    }

    public inputIsInvalid(inputName:string )
    {

    }
}
