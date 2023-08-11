/***
 * Napojeni na postovni server 
 */


export class PostaAlias { 
    public id: number = -1; 
    public domain_id: number = 1; 
    public source: string = ''; 
    public destination: string = ''; 
    public zmeneno: string = '';
    public zmenil: string = '';
}



export class PostaDomena { 
    public id: number = -1; 
    public name: string = ''; 
    public zmeneno: string = '';
    public zmenil: string = '';
}

export class PostaUser {
    public id : number = -1;
    public domain_id: number = 1;
    public password : string = '';
    public email : string = '';
    public zmeneno: string = '';
    public zmenil: string = '';
}