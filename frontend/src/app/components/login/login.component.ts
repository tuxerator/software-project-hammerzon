import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  public errorMessage?:string;

  public loginForm: FormGroup = this.formBuilder.group({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router) {
  }

  ngOnInit(): void {
    this.authService.getUser().subscribe({
      next: (user) => {
        if (user) {
          this.router.navigate(['']);
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
      return [];
    }
    if(this.isValid(key))
    {
      return ['is-valid'];
    }
    return ['is-invalid'];
  }

  public getTexts(key:string):string
  {
    if(key === 'email')
    {
        return this.errorMessage === 'Mail address not found' ? 'Email existiert nicht' : 'Bitte korrekte Email eingeben';
    }else{
       return this.errorMessage ===  'Wrong password' ? 'Falsches Passwort' : 'Passwort zu kur minestens 8 Zeichen';
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
        this.router.navigate(['/']);

      },
      error: (err) => {
        this.errorMessage = err.error.message;
        console.log(this.errorMessage);
      }
    });
  }

}
