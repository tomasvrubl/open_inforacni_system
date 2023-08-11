
export class Plan {
    id: number;
    datum:string;
    zdroj_id:number;
    kalendar_id:number;
    pracoviste_id: number;
    polozky: any[];
    zmeneno: string;
    zmenil: string;
        
    constructor(){
        this.id = -1;
        this.datum = '';
        this.pracoviste_id = -1;
        this.kalendar_id = -1;
        this.zdroj_id = -1;        
        this.zmeneno = '';
        this.zmenil = '';   
        this.polozky = [];     
        return this;
    }    
}

export class PlanPolozka {
    id: number;
    plan_id: number;
    poradi: number;
    skupina: number;
    vyr_zakazka_kod: string;    
    vyrobek: string;
    nazev: string;
    pokyn: string;
    kalendar_id: number;
    kalendar_smena_id: number;    
    mnozstvi: number;
    zmeneno: string;
    zmenil: string;
    _odvedeno: number;
    _zbyva: number;
    _plan:number;

    
    constructor(){
        this.id = -1;
        this.plan_id = -1;
        this.poradi = 0;        
        this.skupina = -1;
        this.vyr_zakazka_kod = '';
        this.nazev = '';
        this.pokyn = '';
        this.kalendar_id = -1;
        this.kalendar_smena_id = -1;
        this.mnozstvi = 0;                
        this.zmeneno = '';
        this.zmenil = '';
        this._odvedeno = 0;
        this._zbyva = 0;
        this._plan = 0;        
        return this;
    }    
}


