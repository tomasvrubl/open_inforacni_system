
export class Auto {
   public id: number = -1;       //poradi modelu ve forme
   public nazev: string = "";
   public spz: string = "";
   public osoba: string = "";    
   public osoba_oscislo: string = "";  
   public osoba_id: number = -1;
   public stavkm: number = 0;
   public ciskarty: string = "";
   public vs: string = "";
   public natural: boolean = false;   
   public lpg: boolean = false;
   public diesel:boolean = false;
   public kwh:boolean = false;
   public kwh_spotreba:number = 0;
   public kwh_baterie:number = 0;
   public def_palivo: number = 0;
   public prum_spotreba: number = 0;
   public nadrz_l: number = 0;
   public zmeneno: string = "";
   public zmenil: string = "";
   public platnost: boolean = false;
    
    get getStrPalivo() {
          
        let str = this.natural ? 'natural, ' : '';
        str += this.diesel ? 'diesel, ' : '';
        str += this.lpg ? 'LPG' : '';
        str += this.kwh ? 'kWh' : '';
        
        if (str.charAt(str.length - 2) == ','){
            str = str.substr(0, str.length - 2);
        }
       
        return str;
    }

     
    get getStrVychoziPalivo(){
        
        let r = 'není';
        switch (this.def_palivo){
            case 1: 
              r = 'natural';
              break;             
            case 2:
              r = 'diesel';
              break;
            case 3:
              r = 'LPG';
            case 4:
              r = 'kWh';
              break;                         
        }
        
        return r;
    }
}


export class AutoVykazSumar{
    public id: number = -1; 
    public rok: number = 0; 
    public mesic: number = 0; 
    public autoid: number = -1;
    public auto_nazev: string = '';
    public auto_spz: string = '';
    public osobaid: number = -1;
    public osoba_oscislo: string = '';
    public osoba_osoba: string = '';
    public poc_stav: number = 0; 
    public kon_stav: number = 0; 
    public diesel_prum_spotreba: number = 0;    
    public diesel_palivo_nakup_l: number = 0;
    public diesel_palivo_nakup_prumkc: number = 0;
    public diesel_palivo_nakup_kc: number = 0;
    public diesel_poc_stav_l: number = 0;
    public diesel_kon_stav_l: number = 0;        
    public natural_prum_spotreba: number = 0;    
    public natural_palivo_nakup_l: number = 0;
    public natural_palivo_nakup_prumkc: number = 0;
    public natural_palivo_nakup_kc: number = 0;
    public natural_poc_stav_l: number = 0;
    public natural_kon_stav_l: number = 0;            
    public lpg_prum_spotreba: number = 0;    
    public lpg_palivo_nakup_l: number = 0;
    public lpg_palivo_nakup_prumkc: number = 0;
    public lpg_palivo_nakup_kc: number = 0;
    public lpg_poc_stav_l: number = 0;
    public lpg_kon_stav_l: number = 0;        
    public kwh_nabijeni: number = 0;  //mnozstvi nabite elektriny
    public kwh_nabijeni_prumkc: number = 0;
    public kwh_nabijeni_kc: number = 0;
    public kwh_pocatecni_stav: number = 0;
    public kwh_konecny_stav: number = 0;
    public kwh_prum_spotreba: number = 0;
    public ost_kc: number = 0;
    public zmeneno: string = "";
    public zmenil: string = "";
    public list: any[] = [];
    public _tmp_diesel_km:number = 0;
    public _tmp_natural_km:number = 0;
    public _tmp_lpg_km:number = 0;    
    public _tmp_kwh_km:number = 0;    

}

export class AutoVykazTempl {
   id: number = -1;     
   cesta: string = "";
   km: number = 0;
   km_private: number = 0;
   _ischk:boolean = false;
   
}

export class AutoVykaz {
   id: number = -1;   
   datum: Date = new Date();
   poradi: number = 0;   
   cesta: string = '';
   km: number = 0;
   km_private: number = 0;
   tankovanikc: number = 0;
   tankovanil: number = 0;
   nabijeni_kwh:number = 0;
   nabijeni_kc: number = 0;
   ovydkc: number = 0;
   ovyd: string = '';   
   diesel:boolean = false;
   natural: boolean = false;
   lpg: boolean = false;
   kwh: boolean = false;      
   zmeneno: string = '';
   zmenil: string = '';
   auto_vykaz_sumar_id: number = -1;
   _stat_kc_za_l: number = 0;
   _hash: string = '';

   constructor() {        
        this.genHash();
        return this;
    }
        
    genHash(){
        this._hash = Date.now() + "" + Math.random().toString(36).substr(2, 10);
    }
    
    getHash(){
        return this._hash;
    }
        
    getCenaZaPalivo(){
        var v = this.tankovanikc == 0 || this.tankovanil == 0 ? 0 : this.tankovanikc/this.tankovanil;
        this._stat_kc_za_l =  isNaN(v) ? 0 : Math.round(v*100) / 100;        
        return this._stat_kc_za_l;
    }
    
    
    setPalivo(palivo:number){
        
        this.natural = this.diesel = this.lpg = this.kwh = false;
        switch (palivo){
            case 1: 
              this.natural = true;
              break;             
            case 2:
              this.diesel = true;
              break;
            case 3:
              this.lpg = true;
            case 4:
              this.kwh = true;
              break;                         
        }        
    }
   
}
