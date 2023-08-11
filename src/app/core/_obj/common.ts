

export class Response 
{
   kod: number = -1;
   nazev: string = '';
   data: any;
}

export class MenuItem {
    id:number = -1;
    name:string = '';
    icon:string = '';
    url:string = '';
    note:string = '';
    parent_id:number = -1;
    role_id:number = -1;
    role_group_id:number = -1;
    sortorder:number = 0;
    zmeneno:string = '';
    zmenil:number = -1;
}

/* nahravani souboru */
export class UploadStatus {
    progress:number; 
    state: 'PENDING' | 'IN_PROGRESS' | 'DONE';
    response: Response;

    constructor(state, progress, response?){
        this.progress = progress;
        this.state = state;
        this.response = response;
    }
}

/*** definice prilohy */
export class Attachment {

    id: number = -1;
    url: string = '';
    note: string = '';
    skupina: string = '';
    mime: string = '';
    tagy: string = '';
    url_rec: string = '';
    velikost: number = 0;
    zmenil: string = '';
    zmeneno: string = '';
    temphash: string = '';
    nazev: string = '';
    path: string = '';
}


/*** definice prilohy */
export class ReportPrint {
   id: number = -1; 
   nazev: string = ''; 
   note: string = ''; 
   url: string = '';    
   url_rec: string = '';  //interni url /modul/formular
   path: string = '';
   zmenil: number = -1; 
   zmeneno: string = ''; 
}


export class Setting {
    id:number = -1;
    kod: string = '';
    param: string = '';
    param2: string = '';
    param3: string = '';
    poznamka: string = '';
    zmeneno: string = '';
    zmenil: string = '';    
}

export class Widget {
    
    nazev: string = '';
    id: number = -1
    params: any = {};  
}



export class TabFilter {
    static readonly O_EQ = 0;
    static readonly O_MENSI = 1;
    static readonly O_VETSI = 2;
    static readonly O_MENSI_ROVNO = 3;
    static readonly O_VETSI_ROVNO = 4;
    static readonly O_RUZNE = 5;
    static readonly O_LIKE = 6;
    static readonly O_IN = 7;
    static readonly O_NOT_IN = 8;
    
    operator: number; 
    value: string;  
    
    constructor(){
        return this;
    }  
}

export class TabColumn {
    static readonly SORT_NONE = 0;
    static readonly SORT_ASC = 1;
    static readonly SORT_DESC = 2;

    static readonly TYPE_STRING = 0;
    static readonly TYPE_NUMBER = 1;
    static readonly TYPE_BOOL = 2;
    static readonly TYPE_DATE = 3;
    static readonly TYPE_DATETIME = 4;
    static readonly TYPE_URL = 5;
    static readonly TYPE_INT = 6;
    static readonly TYPE_TIME = 7;

    
    label: string;
    type: number = 0; // 0 - string, 1 - number, 2 - boolean, 3 - datum, 4 - datetime, 5 - url, 6 - cele cislo
    nosum: boolean = false;
    fulltext: boolean = false; // zda bude pouzity pri vyhledavani fulltextem
    clmn: string; //nazev polozky
    sort: number = 0; // 0 - zadny sort, 1 - ASC, 2 - DESC
    filter: any[];
    css_class : string = '';
    _isfilter: boolean;
    
    constructor(label:string, clmn: string){
        this.label = label == null ? "" : label;
        this.filter = [];
        this.clmn = clmn; 
        this.sort = 0; 
        this.type = 0;
        this._isfilter = false;       
        return this;
    }
    
}



export class TableQuery {
    static readonly JOIN_OR = 1;
    static readonly JOIN_AND = 0;
    clmn: any[] = [];
    fulltext: any[] = []; //fulltextove vyhledavani
    q_join: number = 0; // 0 - AND,  1 - OR
    page: number = 0;
    limit: number = 15;    
    extrafilter: any[] = []; //extra filter staticky je spojeny nelze jej ovlivnovat uzivatelsky   AND (extra1 AND extra2 AND ...)
}



export class Table {
    header: any[];
    fulltext: any[] = []; //query fulltext {clmn, val}, {clmn, val} spoji se to OR
    extraFilter: any[] = []; //extra filter staticky 
    q_join :number = 0;
    _data: TableData;
    
    constructor(){        
        this._data  = new TableData();        
        this.header = [];
        return this;
    }  


    get data(): TableData {
        return this._data;
    }

    set data(val){
        this._data = val;
    }

    clearFilter(){
        for (var j = 0; j < this.header.length; ++j){                
            this.header[j].filter = [];
        }
        
        this.q_join = 0;
    }

    getAsParam(): Table{

        var t = new Table();
        t.header = this.header;
        t._data.limit = this.data.limit;
        return t;
    }


    getQuery() : TableQuery {
                
        var query = new TableQuery();

        query.page = this.data.page;
        query.limit = this.data.limit;
        query.clmn = this.header;
        query.q_join = this.q_join;
        query.fulltext = this.fulltext;
        query.extrafilter = this.extraFilter;        
        return query;
    }

    
    setFilter(f: TableQuery){

        this.clearFilter();
        this.data.limit = f.limit;
        this.q_join = f.q_join;
        
        for (var i = 0; i < f.clmn.length; ++i){            
            for (var j = 0; j < this.header.length; ++j){                
                if (this.header[j].clmn == f.clmn[i].clmn){
              
                    this.header[j].sort = f.clmn[i].sort;
                    this.header[j].filter = f.clmn[i].filter;
                    break;
                }
                
            }    
        }        
    }

    copyHeader(){
        var r = [];
        
        for (let i = 0; i < this.header.length; ++i){            
            r.push(this.header[i]);
        }
        
        return r;
    }
    
}

export class TableData {
    list: any[] = [];
    total: number = 0; //celkovy pocet zaznamu
    limit: number = 150; //pocet zaznamu na strance
    page: number = 0;  //aktualni strana    
}

export declare interface iDetail {
    saveme(): void;
    newone(): void;
    edit(id:number) : void;
    dropme() : void;       
}
