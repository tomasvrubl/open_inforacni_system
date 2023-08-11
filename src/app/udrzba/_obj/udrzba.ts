
//udr_zapis_poruchy
export class ZapisPoruchy {

    public id: number = -1;
    public datum: Date = new Date(); 
    public od: string = '';
    public do: string = '';
    public porucha_id: number = -1;
    public porucha_kod: string = '';
    public porucha: string = '';
    public zdroj_id: number = -1;
    public zdroj_kod: string = '';
    public zdroj: string = '';
    public poznamka: string = '';
    public stav : number = 0;
    public zmeneno: string = '';
    public zmenil: string = '';   
    public vytvoreno: string = '';
    public vytvoril: string = '';   

    public priloha_hash: string = this.getRandomHash(); //hash odkazujici na prilohy

    getRandomHash(){
        var d = Math.floor(Date.now() / 1000) + '-' + Math.floor(Math.random() * 100);
        return 'udrzba/porucha/'+d;
    }   
}

export class VykazPraceOsoba {
    public id: number = -1;
    public vykaz_prace_id: number = -1;
    public osoba_id: number = -1;
    public osoba_oscislo: string = '';
    public osoba: string = '';
    
}


export class VykazPraceZdroj {

    public id: number = -1;
    public vykaz_prace_id: number = -1;
    public zdroj_id: number = -1;
    public zdroj_kod: string = '';
    public zdroj: string = '';

}


export class VykazPrace {
    
    public id: number = -1;
    public datum: Date = new Date(); 
    public od: string = '';
    public do: string = '';
    public porucha_id: number = -1;
    public porucha: ZapisPoruchy = null;
    public poznamka: string = '';
    public zmeneno: string = '';
    public zmenil: string = '';   
    public vytvoreno: string = '';
    public vytvoril: string = '';  

    public osoba: VykazPraceOsoba[] = [];
    public zdroj: VykazPraceZdroj[] = [];

    public priloha_hash: string = this.getRandomHash(); //hash odkazujici na prilohy

    getRandomHash(){
        var d = Math.floor(Date.now() / 1000) + '-' + Math.floor(Math.random() * 100);
        return 'udrzba/vykaz/'+d;
    }   
}

