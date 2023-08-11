export class Zakazka {
    id: number;
    kod: string;
    extern_kod: string;
    nazev: string;
    tp_id: number;
    tp_vyrobek: string;
    pracoviste_id: number;
    pracoviste_nazev: string;
    datum_od: string;
    datum_do: string;
    ukoncen: boolean;
    plan_ks: number;
    odvedeno_ks: number;
    poznamka: string;    
    zmeneno: string;
    zmenil: string;
    
    constructor(){
        this.pracoviste_id = this.tp_id = this.id = -1;        
        this.plan_ks = this.odvedeno_ks = 0;
        this.ukoncen = false;        
        this.pracoviste_nazev = this.kod = this.poznamka = this.extern_kod = this.nazev = this.tp_vyrobek = 
            this.datum_od = this.datum_do = this.zmeneno = this.zmenil = '';
            
        return this;
    }    
}


export class Odvadeni {
    id: number;
    datum: string;
    osoba_id: number;
    osoba: string;    
    zakazka_id: number;    
    zakazka_vyrobek: string;
    zakazka_nazev: string;    
    zakazka_kod: string;    
    zakazka_extern_kod: string;    
    kalendar_smena_id: number;    
    mnozstvi_shodne: number;
    mnozstvi_neshodne: number;
    vada_kod: string;
    vada_id: number;
    zdroj_id: number;
    zdroj_kod: string;    
    zdroj_nazev: string;
    zmeneno: string;
    zmenil: string;
    
    constructor(){
        this.zakazka_kod = this.zakazka_nazev = this.zakazka_vyrobek = this.zakazka_extern_kod = this.zdroj_kod = this.datum =  this.zdroj_nazev = '';
        this.id = this.zakazka_id = this.vada_id = -1;
        this.mnozstvi_shodne = this.mnozstvi_neshodne = 0;
        this.kalendar_smena_id = -1;
        this.zmeneno = this.zmenil = this.vada_kod = '';
          
    }
}

/*** osoba pro vyrobu, omezene mnozstvi informaci, pouziva se pri vybirani osob ze seznamu */
export class VyrOsoba {
    public id: number = -1;
    public oscislo: string = '';
    public cip : string = '';
    public prijmeni: string = '';
    public jmeno: string = '';
    public pracoviste_id: number = -1;
    public pracoviste: string = '';
    public pracoviste_kod: string = '';
}


/**** Definice praconviho zarazeni ve vyrobe, pouziva se pri odvadeni, vykazu zapisu pracovni smeny*/
export class VyrZarazeni {
    public id: number = -1;
    public kod: string = '';
    public nazev : string = '';
    public platnost: boolean = true;
    public pracoviste_id: number = -1;
    public pracoviste_kod: string = '';
    public pracoviste: string = '';
    public zmeneno: string = '';
    public zmenil: string = ''; 
}

export class VyrZapisSmeny {
    public id: number = -1;
    public datum: Date =  new Date();
    public kalendar_smena_id: number = -1;
    public kalendar_smena: string = '';
    public zdroj_id: number = -1;
    public zdroj_kod: string = '';
    public zdroj: string = '';
    public pracoviste_id: number = -1;
    public pracoviste_kod: string = '';
    public pracoviste: string = '';
    public odv_mnozstvi: number = 0;
    public utrz_forem: number = 0;
    public poznamka: string = '';
    public termosoba: string = ''; //u terminaloveho odvadeni osoba, ktera vytvorila doklad
    public zmeneno: string = '';
    public zmenil: string = ''; 
    public polozky: VyrZapisSmenyZarazeni[]  = [];
}

export class VyrZapisSmenyZarazeni {
    public id: number = -1;    
    public zapissmeny_dkl_id: number = -1;
    public pracovni_zarazeni_id: number = -1;
    public pracovni_zarazeni_kod : string = '';
    public pracovni_zarazeni : string = '';
    public pracovni_zarazeni_platnost : boolean = true;
    public osoba_id : number = -1;    
    public osoba : string = '';
    public osoba_oscislo: string = '';    
    public osoba_platnost: boolean = true;
    public zmeneno: string = '';
    public zmenil: string  = '';

}
