export class Odmena {
    id: number = -1;
    datum: Date = new Date(); 
    osoba_id: number = -1;
    osoba_osoba: string = '';
    osoba_oscislo: string = '';
    castka: number = 0;
    poznamka: string = '';   
    zmeneno: string = '';
    zmenil: string = '';
    vyplaceno: string = '';
    vyplatil: string = '';
    
}


export class PersPracKategorie { 
    public id: number = -1; 
    public kod: string = ''; 
    public nazev: string = ''; 
    public zmeneno: string = ''; 
    public zmenil: number = -1; 
}

