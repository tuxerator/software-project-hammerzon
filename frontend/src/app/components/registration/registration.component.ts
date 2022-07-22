import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { Address, User } from '../../models/User';
import { AuthService } from '../../services/auth.service';

@Component({
  styleUrls: ['./registration.component.css'],
  selector: 'app-registration',
  templateUrl: './registration.component.html'

})
export class RegistrationComponent implements OnInit {
  public errorMessage?: string;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router) {
  }

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
      password: new FormControl('', [Validators.required,Validators.minLength(8)]),
      confirmPassword: new FormControl('', [Validators.required,this.passwordMatchingValidator])
    });


    ngOnInit(): void {
      if(this.authService.isLogedIn())
      {
        this.router.navigate(['/']);
      }
    }


  public onSubmit(): void {
    console.log('Create Debug Log');
    this.registerForm.markAllAsTouched();
    // Sind alle Eingaben valid
    console.log(this.registerForm);
    if (this.registerForm.invalid) return;
    console.log('Through Validation Debug Log');
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

  public isValid(key:string):boolean
  {
    if(key === 'email')
    {
      return this.errorMessage !== 'Email already exists' && !this.registerForm.controls[key].invalid;
    }
    return !this.registerForm.controls[key].invalid;
  }



    public getEmailInvalidText():string
    {
      return this.errorMessage === 'Email already exists' ? 'Email existiert schon' : 'Keine gültige Email';
    }

    public getEmailClass():string[]{

        if(!this.registerForm.controls['email'].touched){
          return [];
        }

        if(this.isValid('email'))
        {
          return ['is-valid'];
        }

        return ['is-invalid'];
    }


}

