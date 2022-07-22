import { FormGroup } from '@angular/forms';

export class ValidationToText
{
  valitationTexts:ValidationTexts;
  angularForm:FormGroup;
  serverMessage?:string;
  constructor(valitationTexts:ValidationTexts,angularForm:FormGroup)
  {
    this.valitationTexts = valitationTexts;
    this.angularForm = angularForm;
  }

  setErrorMessage(message?:string):void
  {
    this.serverMessage = message;
  }

  getText(key:string,):string
  {
    const message = this.serverMessage || '';
    if(!this.angularForm.controls[key].valid)
    {
      const text = this.valitationTexts[key].invalid.getText(message);
      return text ? text : 'Fehler';
    }
    const validations :Validation[]  = this.valitationTexts[key]['valid'];

    let validationText:string|undefined;
    // As long as the result ist
    for(let i = 0; i <validations.length; i++)
    {
      validationText = validations[i].getText(message);
      if (validationText) {
        break;
      }
    }

    console.log(validationText);
    if(validationText)
    {
      return validationText;
    }

    return 'Error No Defined Error Handling';
  }

  isValid(key:string):boolean
  {
    if(!this.angularForm.controls[key].valid) return false;

    if(!this.ContainsKey(key))
    {
      return true;
    }

    const validations :Validation[]  = this.valitationTexts[key]['valid'];

    // As long as the result ist
    for(let i = 0; i < validations.length; i++)
    {
      if(validations[i].getValid(this.serverMessage || ''))
      {
        return false;
      }
    }
    return true;
  }

  ContainsKey(key:string):boolean{
    return !!this.valitationTexts[key];
  }

  getInputClass(key:string):{[key:string]:boolean}
  {
    if(!this.angularForm.controls[key].touched)
    {
      return {};
    }
    if (this.isValid(key))
    {
      return {'is-valid':true,'was-validated':true};
    }
    return {'is-invalid':true,'was-validated':true};
  }

  getFeedbackClass(key:string):{[key:string]:boolean}
  {
    if (this.isValid(key))
    {
      return {'valid-feedback':true};
    }
    return {'invalid-feedback':true};
  }
}

interface Validation{
  getText(serverMessage:string):string|undefined;
  getValid(serverMessage:string):boolean;
}


// Client Side Validation Text
export class ClientSideValidation implements Validation
{

  constructor(public text:string,public valid=true){}

  getText(serverMessage:string):string
  {
    console.log(serverMessage);
    return this.text;
  }

  getValid(): boolean {
    return this.valid;
  }
}

export class ClientSideFnValidation extends ClientSideValidation{

  constructor(public fn:() => string,valid=true)
  {
    super('',valid);
  }


  override getText(): string {
    return this.fn();
  }
}

export class ServerSideValidation implements Validation{
  is:string;
  not?:string;
  message:string;
  constructor(is:string,not:string|undefined,message:string)
  {
    this.is = is;
    this.not = not;
    this.message = message;
  }

  getText(serverMessage:string):string|undefined
  {
    return serverMessage === this.message ? this.is : this.not;
  }

  getValid(serverMessage: string): boolean {
    return serverMessage === this.message;
  }
}

export class ServerSideFnValidation extends ServerSideValidation {

  fn: ()=> string;
  constructor(fn: () => string ,not:string|undefined,message:string)
  {
    super('',not,message);
    this.fn = fn;
    this.not = not;
  }

  override getText(serverMessage:string):string|undefined
  {
    return this.getValid(serverMessage) ? this.fn() : this.not;
  }
}

export class ServerSideFnFnValidation extends ServerSideFnValidation {

  messageFn: () => string;
  constructor(fn: () => string ,not:string|undefined,message :() => string)
  {
    super(fn,not,'');

    this.not = not;
    this.messageFn = message;
  }

  override getValid(serverMessage: string): boolean {
    return serverMessage === this.messageFn();
  }

}

type ValidationTexts =
{
  [key:string]: {
    invalid:Validation
    valid:Validation[]
  }
}
