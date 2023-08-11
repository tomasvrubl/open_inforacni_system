
export class CustomButton {
    icon: string = 'fas fa-paper-plane';
    label: string = '';
    class: string = 'btn btn-custom';
    title: string = ''; //napoveda
    tocall: (btn: CustomButton, idx?:number, rec?:any) => void;
    enabled: () => boolean;

    constructor(label:string, tocall:(btn: CustomButton, idx?:number, rec?:any)=>void, icon?: string, cls?: string, enabled?:()=>boolean){
        this.label = label;
        this.tocall = tocall;

        if(cls)
            this.class = cls;

        if(icon)
            this.icon = icon;

        if(enabled){
            this.enabled = enabled;
        }
    }

    isEnabled(){

        if(this.enabled){
            return this.enabled();
        }

        return true;
    }
    
}