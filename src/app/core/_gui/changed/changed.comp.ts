import { Component, Input} from '@angular/core';


@Component({
  selector: 'mw-changed',
  styleUrls: [ './style.css' ],
  templateUrl: './view.html'
})


export class ChangedInfo { 
      
    _zmeneno : string;
    _vytvoreno : string;
    _schvaleno : string;
    @Input() zmenil : string;
    @Input() vytvoril : string;
    @Input() schvalil : string;
    
    constructor() { 
        this.zmeneno = this.zmenil = "";
        this.schvalil = this.vytvoril = null;

    }
    
    
    @Input() 
    set zmeneno(val: any){        
        
        if(val && val.hasOwnProperty('date')){
            this._zmeneno = val.date.substr(0, val.date.indexOf('.'));            
            let p = this._zmeneno.split(" ");
            let dd = p[0].split("-");            
            this._zmeneno = dd[2]+"."+dd[1]+"."+dd[0]+" "+p[1];            
        }
        else{
            this._zmeneno = val;    
        }
    }
    
    get zmeneno(){
        return this._zmeneno;
    }    
    

    @Input() 
    set vytvoreno(val: any){        
        
        if(val && val.hasOwnProperty('date')){
            this._vytvoreno = val.date.substr(0, val.date.indexOf('.'));            
            let p = this._vytvoreno.split(" ");
            let dd = p[0].split("-");            
            this._vytvoreno = dd[2]+"."+dd[1]+"."+dd[0]+" "+p[1];            
        }
        else{
            this._vytvoreno = val;    
        }
    }
    
    get vytvoreno(){
        return this._vytvoreno;
    }    



    @Input() 
    set schvaleno(val: any){        
        
        if(val && val.hasOwnProperty('date')){
            this._schvaleno = val.date.substr(0, val.date.indexOf('.'));            
            let p = this._schvaleno.split(" ");
            let dd = p[0].split("-");            
            this._schvaleno = dd[2]+"."+dd[1]+"."+dd[0]+" "+p[1];            
        }
        else{
            this._schvaleno = val;    
        }
    }
    
    get schvaleno(){
        return this._schvaleno;
    }    
     
}