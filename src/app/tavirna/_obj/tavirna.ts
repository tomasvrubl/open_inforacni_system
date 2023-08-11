export class JakostKov {
    public id: number = -1;
    public nazev: string = '';
    public platnost: boolean = true;
    public poznamka: string = '';
    public externi_kod: string = '';
    public zmeneno: string = '';
    public zmenil: string = '';
    public slozeni: any[];
    public priloha_hash: string = this.getRandomHash(); //hash odkazujici na prilohy

    getRandomHash(){
        var d = Math.floor(Date.now() / 1000) + '-' + Math.floor(Math.random() * 100);
        return 'tavirna/jakost/'+d;
    }    

}

export class JakostKovSlozeni {
    public id: number = -1;
    public jakost_id: number = -1;
    public karta_id: number = -1;
    public karta_kod: string = '';
    public karta_nazev: string = '';
    public jednotka_id: number = -1;
    public jednotka_kod: string = '';
    public jednotka_nazev : string = ''; 
    public platnost: boolean = true;
    public zmenil: string = '';
    public zmeneno: string = '';
}


export class TavirnaPec {
    public id: number = -1;
    public kod: string = '';
    public nazev : string = ''; 
    public zdroj_id: number = -1;
    public zdroj_kod: string = '';
    public zdroj_nazev: string = '';
    public poznamka: string = '';
    public platnost: boolean = true;
    public zmenil: string = '';
    public zmeneno: string = '';
    public pec: string = "0";
    public rok: string = (new Date().getFullYear() % 2000).toString();
    public kampan : string = "000";
    public tavba : string = "000";

    public priloha_hash: string = this.getRandomHash(); //hash odkazujici na prilohy

    getRandomHash(){
        var d = Math.floor(Date.now() / 1000) + '-' + Math.floor(Math.random() * 100);
        return 'tavirna/pec/'+d;
    }    
}


export class LabVzorek { 
    public id: number = -1;     
    public buben: number = 0; 
    public eutekt_sc: number = 0; 
    public zmeneno: string = ''; 
    public zmenil: number = -1; 
    public poradi: number = 1; 
    public datum: Date = new Date(); 
    public lab_c: number = 0; 
    public lab_si: number = 0; 
    public lab_mn: number = 0; 
    public lab_p: number = 0; 
    public lab_cr: number = 0; 
    public lab_ni: number = 0; 
    public lab_cu: number = 0; 
    public lab_al: number = 0; 
    public lab_mg: number = 0; 
    public lab_s: number = 0; 
    public lab_zbyt_mg: number = 0; 
    public platnost: boolean = true; 
    public istvarna: boolean = false; 
    public cislo_tavby: string = ''; 
    public material: string = ''; 
    public laborant: string = ''; 
    public norma: string = ''; 


    public priloha_hash: string = this.getRandomHash(); //hash odkazujici na prilohy

    getRandomHash(){
        var d = Math.floor(Date.now() / 1000) + '-' + Math.floor(Math.random() * 100);
        return 'tavirna/laborator/vzorek/'+d;
    }    
}
   