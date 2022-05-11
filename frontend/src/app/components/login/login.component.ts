import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit{

  public loginForm: FormGroup = this.formBuilder.group({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(private formBuilder: FormBuilder,private authService:AuthService,private router:Router){}

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

  public onSubmit():void
  {
    this.loginForm.markAllAsTouched();

    if(this.loginForm.invalid)return;

    const form = this.loginForm.value;

    const password = form.password;
    const email = form.email;

    this.authService.login(email,password).subscribe({
      next: () =>
      {
        this.authService.getUser();
        this.router.navigate(['/']);

      },
      error: (err) => console.log(err)
    });
  }

}
