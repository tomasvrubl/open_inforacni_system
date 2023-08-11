
export class SecurityUserParams {
    public id: number = -1;
    public security_user_id: number = -1;
    public param : string = '';
    public data : any;    
}



/**
 * osoba ktera je aktualne prihlasena
 */
export class SecurityUser
{

    public id:number = -1;
    public username:string = '';
    public heslo: string = '';
    public platnost: boolean = true;
    public osoba_id: number = -1;
    public osoba_oscislo: string = '';
    public osoba: string = '';
    public prijmeni: string = '';
    public jmeno: string = '';
    public email: string = '';
    public role:any = [];
    public zmeneno: string = '';
    public zmenil: string = '';
    public isadmin: boolean = false;
    public editokno: number = 0;
    public settings: SecurityUserParams[] = []; //nastaveni uzivatelske UserParams

    public isAdmin(){
        return this.isadmin;
    }



    public isAllowed(group: string, role: string, subrole: string){


        if(this.isAdmin()){
            return true;
        }

        var key = group+':'+role;
        if(this.role && this.role.hasOwnProperty(key)){
            
            if(subrole){                
                for(var i=0; i < this.role[key].params.length; ++i){                    
                    if(this.role[key].params[i] == subrole){
                        return true;
                    }
                }
            }
            else{
                return true;
            }

        }

        return false;
    }



    public getOsobaID(){
        return this.osoba_id;
    }

    public getOsoba(){
        return this.prijmeni + ' ' + this.jmeno;
    }
    
    
    public getLogin(){
        return this.username;
    }
    
    public getID() : number {
        return +this.id;
    }
    
    public setHeslo(heslo: string){
        this.heslo = heslo;
    }
       

    public updateSetting(st: SecurityUserParams){

        try{

            while(this.dropSetting(st.param));            
            this.settings.push(st);
            
        }catch(ex){
            
        }

    }


    public dropSetting(param: string){
       
        try{
        
            var l = this.settings;
            for(let i=0; i < l.length; ++i){

                if(l[i].param == param){
                    this.settings.splice(i, 1);
                    return true;
                }
            }

        }catch(ex){
            
        }

        return false;
    }

    public getSetting(param: string): any {

        try{
            if(this.settings.length < 1)
            return null;

        }catch(ex){
            return null;
        }

        var l = this.settings;

        for(let i=0; i < l.length; ++i){
            
            if(l[i].param == param){
                return l[i].data;
            }
        }
        
        return null;
    }

}

export class SecurityUserRole {
    
     id:number;
     role_id:number;
     role_group_id:number;
     role: string;
     skupina: string;
     params: string[]; // role ktere ma
     role_params_all : any[];  //seznam vsech sub roli, ktere muze mit

     user_id: number;
     zmeneno: string;
     zmenil: string;

    constructor() {
      this.id = this.role_id = this.role_group_id = this.user_id = -1;
      this.role = this.skupina = this.zmeneno = this.zmenil = "";
      this.params = []; //jsou to pod role, naprilad povoleni urcitych tlacitek schvalovani objednavek napr.
      this.role_params_all = [];
      return this;
    }  
    
}
    
/***
 * definice osob v systemu
 */
export class Osoba {
    id: number = -1; 
    oscislo: string = '';
    cip: string = '';
    prijmeni: string = '';
    jmeno: string = '';    
    mobil: string = '';
    telefon: string = '';
    email: string = '';
    platnost: boolean = true;
    pracoviste_id: number = -1;
    pracoviste_kod: string = '';
    pracoviste: string = '';    
    rizikovost_id: number = -1;
    rizikovost_kod: string = '';
    rizikovost_druh_prace: string = '';
    datum_narozeni: Date;
    bydliste_ulice: string = '';
    bydliste_cp: string = '';
    bydliste_obec: string = '';
    bydliste_psc: string = '';
    bydliste_stat: string = '';
    zdravotni_pojistovna: string = '';
    prac_zarazeni_id: number = -1;
    rezim_prace: string = '';
    titul: string = '';    
    rodnecislo : string = '';
    zmeneno: string;
    zmenil: string;
}

//definice role opravneni pro uzivatelsky pristup
export class SecurityRole
{
    id:number;
    tag:string;
    note:string;
    group_id:number;
    ts_class: string;
    params: SecuritySubRole[];
    zmeneno: string;
    zmenil: string;

    constructor() {
      this.id = this.group_id = -1;
      this.tag = "";
      this.note = "";      
      this.ts_class = "";
      this.zmeneno = "";
      this.zmenil = "";
      this.params = [];
      return this;
    }
}


// definice sub role, napriklad povoleni konkretnich tlacitek osobe
export class SecuritySubRole {
    tag:string;
    note:string;

    constructor() {
        this.tag = "";
        this.note = "";      
        return this;
    }
}

export class SecurityRoleGroup
{
    id:number;
    name:string;
    note:string;
    zmeneno: string;
    zmenil: string;
    roles: SecurityRole[];

    constructor() {
      this.id = -1;
      this.name = "";
      this.note = "";      
      this.zmeneno = "";
      this.zmenil = "";
      this.roles = [];
      return this;
    }
}

