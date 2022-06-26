import { Component, forwardRef, Host, Input, OnInit, Optional, SkipSelf } from '@angular/core';
import { ControlContainer, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ValidationToText } from 'src/app/validationToText';

@Component({
  selector: 'app-validatable-input',
  templateUrl: './validatable-input.component.html',
  styleUrls: ['./validatable-input.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ValidatableInputComponent),
      multi: true
    }
  ]
})
export class ValidatableInputComponent implements ControlValueAccessor,OnInit {

  @Input()
  validatorController!: ValidationToText;

  @Input()
  formControlName!:string;
  @Input()
  label?:string;
  @Input()
  placeholder?:string;
  @Input()
  readonly?:boolean=false;

  private onChange = (value:string):void => {};

  private onTouched = ():void => {};

  private touched = false;

  private disabled = false;

  public value = 'Hallo Tets';

  constructor(@Optional() @Host() @SkipSelf()
  private controlContainer: ControlContainer) { }

  writeValue(val: string): void {
    this.value = val;
  }

  registerOnChange(onChange: (value: string) => void): void {
    this.onChange = onChange;
  }
  registerOnTouched(onTouched: () => void): void {
    this.onTouched = onTouched;
  }

  public change():void
  {
    console.log('Called Changed');
    console.log(this.value);
    //this.value = value;
    this.onChange(this.value || '');
    this.markAsTouched();
  }

  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  ngOnInit(): void {
  }

}
