import { VyrZapisSmenyZarazeni } from "src/app/vyroba/module";

export class TerminalLinkaPlan {
    public datum: Date = new Date(); 
    public zdroj_kod: string = '';
    public zdroj : string = 'Neznámý zdroj';
    public poznamka: string = ''; //poznamka k planu na danny den    
    public seznam: TerminalLinkaPlanPol[] = [];
}

export class TerminalLinkaPlanPol {
    public poradi: string = '0';
    public vp: string = '';   //kod vyrobniho prikazu
    public nazev: string = ''; //nazev model
    public jakost: string = ''; //jakost litiny
    public teplota: string = ''; //teplota liti
    public hmotnost: number = 0; //teplota liti
    public ksveforme: number = 0; //pocet kusu ve forme
    public pozadovano: number = 0; //pozadovane mnozstvi k odvadeni
    public pocetforem: number = 0; //pocet forem 
    public odvedeno: number = 0; // dovedeno
    public pokyn: string = ''; //technologicky pokyn pro obsluhu linky    
    public _hodnota : number = 0; // aktualne odvadeno
}



/***
 * zapis smeny zarazeni zamestnance
 */


export class TerminalSmena {    
    public id: number = -1;
    public datum: Date = new Date();
    public kalendar_smena_id: number = -1; // 1 - ranni, 2 - odpoledni,  3 - nocni
    public zdroj_kod: string = '';
    public zdroj_id: number = -1;
    public pracoviste_id: number = -1;
    public poznamka: string = '';
    public forem: number = 0; // celkem vyrobenych forem
    public utrzeno: number = 0;  // z toho utrzeno forem
    public pracovni_zarazeni : VyrZapisSmenyZarazeni[] = []; // seznam zarzeni
}



