export class ObjMaterial {
    public id: number;
    public datum: Date = new Date(); 
    public datum_objednano: Date = null;
    public objednal: number;
    public objednal_oscislo: string;
    public objednal_osoba: string;
    public pracoviste_id: number;
    public pracoviste_nazev: string;
    public pracoviste_kod: string;
    public vytvoreno: string;
    public vytvoril: string;
    public zmeneno: string;
    public zmenil: string;
    public priloha_hash: string; //hash odkazujici na prilohy
    public note: string;

    public schvaleno: string;
    public schvalil: number;
    public schvalil_osoba: string;
    public stav: number;
    
    public cena_celkem: number;
    public polozky: ObjMaterialPol[];

    constructor(){
        this.id = this.objednal = -1;
        
        this.priloha_hash = this.getRandomHash();
        this.objednal_oscislo = '';
        this.objednal_osoba = '';
        this.pracoviste_id = -1;
        this.stav = 0;
        this.pracoviste_nazev = this.pracoviste_kod = '';
        this.cena_celkem = 0;
        this.schvaleno = '';
        this.schvalil = -1;
        this.schvalil_osoba = '';
        this.vytvoreno = '';
        this.vytvoril = '';
        this.zmeneno = '';
        this.zmenil = '';
        this.note = '';
        this.polozky = [];
        return this;
    }    

    getRandomHash(){
        var d = new Date().getMilliseconds() + '-' + Math.floor(Math.random() * 100);
        return 'organizace/objmat/'+d;
    }    
}

export class ObjMaterialPol {
    public id: number;
    public obj_mat_id: number;  
    public popis: string; 
    public pracoviste_id: number;  //na ktere stredisko to jde
    public pracoviste_kod: string;
    public pracoviste_nazev: string;
    public mnozstvi: number;
    public jednotka: string;     //jednotka objednani
    public cena: number;         //orientacni 
    public objednavatel: string; //kdo to objednaval, aby vznikl pozadavek  vetsinou mistr daneho strediska
    public dodani:string;        //datum dodani, kdy bylo zbozi dodano a ktere jeste chybi dodat
    public firma_id: number;     //odkud se material bude objednavat
    public firma_nazev: string;        //odkud se material bude objednavat    
    public firma_adresa: string = '';
    public vytvoril: string;
    public vytvoreno: string; 
    public stav: number;      
    public firma_ico: string = '';
    public zmeneno: string;
    public zmenil: string;
    public objednano: boolean = false;

    constructor(){
        this.id = this.firma_id = this.obj_mat_id = -1;
        this.mnozstvi = this.stav = this.cena = 0;
        this.popis = this.pracoviste_nazev = this.pracoviste_kod = this.jednotka = '';
        this.pracoviste_id = -1;
        this.vytvoril = this.vytvoreno = '';      
        this.firma_nazev = this.firma_adresa = this.firma_ico = '';          
        this.zmeneno = '';
        this.zmenil = '';
        return this;
    }    
}


/*** Telefonni seznam  */
export class Telkontakt { 
    public id: number = -1; 
    public typ: number = 0; // 0-je zaznam v db, 1- osoba z personalistiky
    public nazev: string = ''; 
    public osoba_id: number = -1; 
    public mobil: string = ''; 
    public telefon: string = ''; 
    public email: string = '';    
    public narozeni: string = '';
    public zmeneno: string = '';
    public zmenil: string = '';
}

/***
 * Postovni aliasy, postovniho serveru
 */

export class PostaAliasy {
    public id:number = -1;  
    public soruce: string = '';
    public destination: string[] = [];
    public zmenil : string = '';
    public zmeneno : string = '';
}