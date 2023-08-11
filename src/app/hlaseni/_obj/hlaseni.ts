
export class HlaseniTyp 
{
   id: number;
   nazev: string;
   kod: string;
   platnost: boolean;
   zmeneno: string;
   zmenil: string;
   constructor() {
      this.id = -1;
      this.nazev = this.zmeneno = this.zmenil = this.kod = "";
      this.platnost = true;
      return this;
   }
  
}


export class Hlaseni {
    id: number;
    stav: number;   // 0 - VYTVORENO, 1 - PREVZATO, 2 - UZVRENO 
    typ: number;
    typ_s: string;
    text: string;
    prevzato: string;
    prevzal: string;    
    vytvoreno: string;
    vytvoril: string;
    uzavreno: string;
    uzavrel: string;
    uzavreno_duvod: string;    
    zdroj_id: number;
    zdroj_kod: string;
    zdroj: string;
    pacoviste_id: number;
    pracoviste: string;
    pracoviste_kod: string;
    

    constructor(){
        this.id = this.pacoviste_id = this.zdroj_id = -1;
        this.stav = this.typ = 0;
        this.text = this.prevzato = this.prevzal = this.vytvoreno = this.vytvoril = this.uzavreno = this.uzavrel = this.uzavreno_duvod = "";        
        this.pracoviste = this.zdroj = this.typ_s = this.zdroj_kod = this.pracoviste_kod = "" ;
    }    
                
}


export class HlaseniVyjadreni {
    id: number;
    hlaseni_id: number;
    text: string;
    vytvoreno: string;
    vytvoril: string;   
    
    constructor(){
        this.id = this.hlaseni_id = -1;
        this.text = this.vytvoreno = this.vytvoril = "";
    }
    
}