export class Pracoviste {
    public id: number = -1;
    public kod: string = '';
    public nazev: string = '';
    public platnost: boolean = true;
    public kalendar_id: number = -1;
    public kalendar_kod: string = '';
    public kalendar: string = '';
    public poznamka: string = '';
    public zmeneno: string = '';
    public zmenil: string = '';
}

export class MernaJednotka {
    public id: number = -1;
    public kod: string = '';
    public nazev: string = '';
    public platnost: boolean = true;  
    public zmeneno: string = '';
    public zmenil: string = '';
}

export class Vada {
    public id: number = -1;
    public kod: string = '';
    public nazev: string = '';
    public platnost: boolean = true;  
    public zmeneno: string = '';
    public zmenil: string = '';
}

export class Porucha {
    public id: number = -1;
    public kod: string = '';
    public nazev: string = '';
    public platnost: boolean = true;  
    public zmeneno: string = '';
    public zmenil: string = '';

}


/***
 * definice stroj
 */
export class Zdroj {
    public id : number = -1;
    public kod: string = '';
    public nazev: string = '';
    public platnost: boolean = true;
    public planovat: boolean = false;
    public poznamka: string = '';
    public pracoviste_id: number = -1;
    public pracoviste_kod: string = '';
    public pracoviste: string = '';
    public kalendar_id: number = 0;
    public kalendar: string = '';
    public kalendar_kod: string = '';
    public zmeneno: string = '';
    public zmenil: string = '';   
}


/***
 * definice kalendar
 */
export class Kalendar {
    public id: number = -1;
    public nazev: string = '';
    public kod: string = '';
    public smeny: any[] = [];
    public platnost: boolean = true;
    public platnost_od: Date = new Date();
    public platnost_do: Date = null;    
    public zmeneno: string = '';
    public zmenil: string = '';
  
}


/***
 * definice kalendar smena
 */
export class KalendarSmena {
    public id: number = -1;
    public nazev: string = '';
    public kalendar_id: number = -1;
    public smena_zacatek: string = '0:0';
    public smena_konec: string = '0:0';
    public pondeli: boolean = true;
    public utery: boolean = true;
    public streda: boolean = true;
    public ctvrtek: boolean = true;
    public patek: boolean = true;
    public sobota: boolean = true;
    public nedele: boolean = true;
    public zmeneno: string = '';
    public zmenil: string = '';
}


/***
 * definice sklad
 */
export class Sklad {
    public id: number = -1;
    public nazev: string = '';
    public kod: string = '';
    public extern_kod: string = '';    
    public platnost: boolean = true;    
    public zmeneno: string = '';
    public zmenil: string = ''; 
}


/***
 * definice sklad karta
 */
export class SkladKarta {
    public id: number = -1;
    public sklad_id: number = -1;
    public sklad_nazev: string = '';
    public nazev: string = '';
    public kod: string = '';
    public extern_kod: string = '';
    public platnost: boolean = true;    
    public mnozstvi: number = 0;
    public jednotka_id: number = -1;    
    public jednotka_kod: string = '';
    public jednotka_nazev: string = '';
    public mnozstvi2: number = 0;
    public jednotka2_id: number = -1;
    public jednotka2_kod: string = '';
    public jednotka2_nazev: string =  '';
    public zmeneno: string = '';
    public zmenil: string = '';    
    public _sklad: any[] = [];
}


export class Operace {
    public id: number = -1;
    public platnost: boolean = true;    
    public nazev: string = '';    
    public poznamka: string = '';
    public zmeneno: string = '';
    public zmenil: string = '';       
}

export class OperaceZdroj {
    public id: number = -1;
    public zdroj_id: number = -1;    
    public zmeneno: string = '';
    public zmenil: string = '';    
}



