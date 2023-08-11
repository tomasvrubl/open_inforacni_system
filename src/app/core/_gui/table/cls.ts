
export class CustomButton
{
   icon: string;
   label: string;
   tocall: any;

  constructor(icon?: string, label?:string, tocall?:any){
      this.icon = icon == null ? '' : icon;
      this.label = label == null ? '' : label;
      this.tocall = tocall;
      return this;
  }
}
