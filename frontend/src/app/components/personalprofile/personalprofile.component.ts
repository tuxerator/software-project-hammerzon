import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { Address, User } from '../../models/User';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators,ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'personalprofile',
    templateUrl: './personalprofile.component.html'
})
export class PersonalProfileComponent implements OnInit{

    user?: User;
    editMode: boolean = false;

    public passwordMatchingValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
        const password = control.get('newPassword');
        const confirmPassword = control.get('confirmPassword');
        return password?.value === confirmPassword?.value ? null : { notMatch: true };
      };



    public profileForm: FormGroup = this.formBuilder.group({
        firstName: new FormControl('', [Validators.required]),
        lastName: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.email]),
        street: new FormControl('', [Validators.required]),
        houseNum: new FormControl('', [Validators.required]),
        city: new FormControl('', [Validators.required]),
        postCode: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        oldPassword: new FormControl('', [Validators.required]),
        newPassword: new FormControl('', [Validators.required]),
        confirmPassword: new FormControl('', [Validators.required])
      }, {validators: this.passwordMatchingValidator});

      

    constructor(private formBuilder: FormBuilder,private authService: AuthService){

    }

    ngOnInit(): void {
        this.authService.getUser().subscribe({
            next: (user) => {
                if (user){
                    this.user = user;
                }
            },
            error: (err) => {
                console.log(err);
            }
        });
    }

    activeEditMode(){
        this.editMode = !(this.editMode);
    }

    public onSubmit(): void{
        console.log('Create Debug Log');
        this.profileForm.markAllAsTouched();
        
        if(this.profileForm.invalid)return;
        console.log('Through Validation Debug Log');
        const form = this.profileForm.value;
        const address : Address = new Address(form.street,form.houseNum,form.city,form.postCode,form.country);
        const newUser:User = new User(form.email,form.newPassword,form.firstName,form.lastName,address);
        this.authService.updateUser(form.oldPassword,newUser);
            
        
        
    }

    
    
}


