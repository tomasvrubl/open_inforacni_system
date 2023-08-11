export class PersPracCinnost { 
    public id: number = -1; 
    public nazev: string = '';
    public lhuta: number = 0; 
    public order: number = 0;  //poradi jedna se pouze o razeni ve formulari prohlidky
    public platnost: boolean = true; 
    public zakon_riziko : string = '';    
    public zakon_skupina : string = '';    
    public poznamka: string = ''; 
    public zmeneno: string = ''; 
    public zmenil: number = -1; 

    
}



export class PersRizikovost { 
    public id: number = -1; 
    public skupina_id: number = -1; 
    public skupina_nazev: string = ''; 
    public kod: string = ''; 
    public druh_prace: string = ''; 
    public rezim_prace: string = '';     
    public popis_prace: string = ''; 
    public hluk: number = 0; 
    public prach: number = 0; 
    public vibrace: number = 0; 
    public fyzicka_zatez: number = 0; 
    public zatez_teplem: number = 0; 
    public pracovni_poloha: number = 0; 
    public zrakova_zatez: number = 0; 
    public chemicke_latky_smesi: number = 0; 
    public neionizujici_zareni: number = 0; 
    public zatez_chladem: number = 0; 
    public psychicka_zatez: number = 0; 
    public cinnost: any[] = [];
    public zmenil: number = -1; 
    public zmeneno: string = ''; 
}

export class PersSkoleni {     
    public id: number = -1; 
    public datum_skoleni: Date = null; 
    public perioda_skoleni: number = -1; 
    public platnost_skoleni: string = ''; 
    public nazev_skoleni: string = ''; 
    public lektor: string = ''; 
    public zmenil: number = -1; 
    public zmeneno: string = ''; 
}

export class PersSkupina { 
    public id: number = -1; 
    public nazev: string = ''; 
    public zmeneno: string = ''; 
    public zmenil: number = -1; 

}

export class PersZdravProhlidka { 

    public id: number = -1; 
    public zadost_vystavena: Date = new Date(); 
    public zadanky_predany: Date = null; 
    public datum_prohlidky: Date = null;
    public platnost_prohlidky: Date = null;
    public mimoradna_prohlidka : Date = null;
    public typ: number = 0; 
    public osoba_id : number = -1;
    public osoba_osoba: string = '';
    public osoba_oscislo: string = '';
    public posudkovy_zaver: string = '';
    public t0_0 : boolean = false;
    public t0_1 : boolean = false;
    public t1_0 : boolean = false;
    public t2_0 : boolean = false;
    public t2_1 : boolean = false;
    public t2_2 : boolean = false;
    public t2_3 : boolean = false;
    public t2_4 : boolean = false;
    public t2_5 : boolean = false;
    public t2_6 : boolean = false;
    public t2_7 : boolean = false;
    public t2_8 : boolean = false;
    public t2_9 : boolean = false;
    public t2_10 : boolean = false;
    public prac_zarazeni : string = '';
    public druh_prace : string = '';
    public rezim_prace : string = '';    
    public f_prach : number = 0;
    public f_chem : number = 0;
    public f_hluk : number = 0;
    public f_vibrace : number = 0;
    public f_zareni : number = 0;
    public f_poloha : number = 0;
    public f_teplo : number = 0;
    public f_chlad :number = 0;;
    public f_zrak : number = 0;
    public f_psychika : number = 0;
    public f_biologicka : number = 0;
    public f_tlak : number = 0;
    public f_fyz : number = 0;
    public is_zpusobily : boolean = false;
    public is_nezpusobily : boolean = false;
    public is_zpusobilypodm : boolean = false;
    public is_ztrata_zpusobilosti : boolean = false;
    public note_podminka : string = '';

    public platnost_prohlidky_roky : number = 0;
    public duvod_pravidlo : string = "";

    public prohlidky_cinnost : any[] = [];
    
    public priloha_hash: string = this.getRandomHash(); //hash odkazujici na prilohy

    public zmeneno: string = ''; 
    public zmenil: number = -1; 


    getRandomHash(){
        var d = Math.floor(Date.now() / 1000) + '-' + Math.floor(Math.random() * 100);
        return 'personalistika/zdravotni_prohlidka/'+d;
    }    
}


