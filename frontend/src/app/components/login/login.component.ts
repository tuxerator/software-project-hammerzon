import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  public errorMessage?: string;
  public loginForm: FormGroup = this.formBuilder.group({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });
  private returnUrl = '/';

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    console.log('returnUrl: ' + this.returnUrl);

    this.authService.getUser().subscribe({
      next: (user) => {
        if (user) {
          this.router.navigate([this.returnUrl]).catch(err => console.error(err));
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }


  public isValid(key:string):boolean
  {
    if(key === 'email')
    {
      return this.errorMessage !== 'Mail address not found' && !this.loginForm.controls[key].invalid;
    }else
    {
      return this.errorMessage !== 'Wrong password' &&  !this.loginForm.controls[key].invalid;
    }
  }

  public getClasses(key:string):string[]
  {
    if(!this.loginForm.controls[key].touched){
      return ['form-control'];
    }
    if(this.isValid(key))
    {
      return ['form-control','is-valid'];
    }
    return ['form-control','is-invalid'];
  }

  public getTexts(key:string):string
  {
    if(key === 'email')
    {
        return this.errorMessage === 'Mail address not found' ? 'Email existiert nicht' : 'Bitte korrekte Email eingeben';
    }else{
       return this.errorMessage ===  'Wrong password' ? 'Falsches Passwort' : 'Passwort zu kurz (mindestens 8 Zeichen)';
    }
  }

  public onSubmit():void
  {
    this.loginForm.markAllAsTouched();

    if (this.loginForm.invalid) return;

    const form = this.loginForm.value;

    const password = form.password;
    const email = form.email;

    this.authService.login(email, password).subscribe({
      next: () => {
        this.authService.getUser();
        this.router.navigate([this.returnUrl]).catch(err => console.error(err));

      },
      error: (err) => {
        this.errorMessage = err.error.message;
        console.log(this.errorMessage);
      }
    });
  }

}
