import { AppOptions } from '../types';

class Lazy<T>{
  private _instance?:T;
  public constructor(private _create:(options?:Partial<AppOptions>) => T)
  {

  }
  public getValue(options?:Partial<AppOptions>):T
  {
    if(!this._instance)
    {
      this._instance = this._create(options);
    }
    return this._instance;
  }
}

export default Lazy;
