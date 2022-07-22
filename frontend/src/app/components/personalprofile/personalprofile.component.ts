import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Address, User } from '../../models/User';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-personalprofile',
  templateUrl: './personalprofile.component.html'
})
export class PersonalProfileComponent implements OnInit {

  user?: User;
  editMode = false;

  constructor(private formBuilder: FormBuilder, private authService: AuthService) {

  }

  public passwordMatchingValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('newPassword');
    const confirmPassword = control.get('confirmPassword');
    const oldPassword = control.get('oldPassword');
    // (doe the new Password(Pw)'s' match) and
    return password?.value === confirmPassword?.value
    // (old Pw Exist => is new password length greater or equal to 8)
    && ((oldPassword?.value && oldPassword.value !== '') ? password?.value.length >= 8 : true)
      // =>
      ? null : { notMatch: true };
  };

  public profileForm: FormGroup = this.formBuilder.group({
    oldPassword: new FormControl('', []),
    newPassword: new FormControl('', []),
    confirmPassword: new FormControl('', []),
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    street: new FormControl('', [Validators.required]),
    houseNum: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    postCode: new FormControl('', [Validators.required]),
    country: new FormControl('', [Validators.required])
  }, { validators: this.passwordMatchingValidator });

  ngOnInit(): void {
    this.authService.getUser().subscribe({
      next: (user) => {
        if (user) {
          this.user = user;
          //Erstelle für jeden Wert im Nutzer einen
          this.profileForm.get('firstName')?.setValue(user?.firstName);
          this.profileForm.get('lastName')?.setValue(user?.lastName);
          this.profileForm.get('street')?.setValue(user?.address.street);
          this.profileForm.get('houseNum')?.setValue(user?.address.houseNum);
          this.profileForm.get('city')?.setValue(user?.address.city);
          this.profileForm.get('postCode')?.setValue(user?.address.postCode);
          this.profileForm.get('country')?.setValue(user?.address.country);
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  activeEditMode(): void {
    this.editMode = true;
  }

  public onSubmit(): void {
    console.log('Create Debug Log');
    this.profileForm.markAllAsTouched();
    console.log(this.profileForm);
    if (this.profileForm.invalid) return;

    console.log('Through Validation Debug Log');
    const form = this.profileForm.value;
    const address: Address = new Address(form.street, form.houseNum, form.city, form.postCode, form.country);
    const newUser: User = new User(form.email, form.newPassword, form.firstName, form.lastName, address);

    this.authService.updateUser(form.oldPassword === '' ? undefined : form.oldPassword, newUser).subscribe({
      next: () => this.editMode = false,
      error: (err) => console.error(err)
    });
  }

  public isValid(key:string):boolean
  {
    return !this.profileForm.controls[key].invalid;
  }


}


