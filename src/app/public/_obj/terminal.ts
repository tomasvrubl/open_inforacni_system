
export class TerminalUser {
    public oscislo: string ='';
    public osoba: string = '';
    public cip: string = '';
    
}


export class TerminalOdvadeni {

    public oscislo: string = ''; // osobni kod osoby, ktera dovadi
    public vp: string = '';  //kod vyrobniho prikazu
    public shodneks: number = 0;  // shodne kusy
    public neshodneks: number = 0; // neshodne kusy
    public vadakod: string = ''; // kod vady
    public datum: Date = new Date();

}
