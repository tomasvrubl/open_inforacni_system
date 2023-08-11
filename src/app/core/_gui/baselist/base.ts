import { Component,  Input, Output, EventEmitter, ViewChild, ViewContainerRef, Type, OnInit, ComponentRef } from '@angular/core';
import { Router } from '@angular/router';
import { SecurityUserParams } from '../../_obj/user';
import { Response, TableData, Table, TableQuery, ReportPrint} from '../../_obj/common';
import { BaseService } from '../../_services/base.service';
import { TableComponent } from '../../module';

@Component({
    selector: 'base-list',
    templateUrl: './view.html',
    viewProviders: [],
    providers : [ ]
  })

export class BaseListComponent implements OnInit { 

    
    @ViewChild('container', { read: ViewContainerRef })  
    container!: ViewContainerRef; 

    @ViewChild('tabchild') tabchild:TableComponent;

    id:string = "";
    response : Response = new Response();  
    _filter: TableQuery = new TableQuery();
    _printList: ReportPrint[] = [];
    _showPrintPopup: boolean = false;
    _printIDRec: number[] =  [];
    _urlrec: string = ""; 
    detail !:any;
    
    isEditButton: boolean = true;
    isExpandable: boolean = true;
    isDropButton: boolean = true;
    isFilterButton: boolean = true;

    @Input() tab:Table = new Table();
    @Input() isSelector : boolean = false;
    @Input() isMultiSelect : boolean = false;
    @Input() isPrint: boolean = false;
    
    @Output() onSelectedEvent = new EventEmitter();
    @Output() onAutocompleteSelectedEvent = new EventEmitter();
    @Output() onSelectedMultiEvent = new EventEmitter();
    @Output() onSelectCancelEvent = new EventEmitter();
    @Output() onUrlRecChangeEvent = new EventEmitter();
    @Input() css:string;
    
    constructor(protected router:Router, protected detailComp: Type<any>, protected baseService : BaseService) { 
        this.id =  "baselist-id-"+Math.floor(Math.random()*1000); 
    }

    getComponentName() {
        throw new Error('BaseListComponent:getComponentName()  Neni definovany nazev seznamu !!!. Bez nazvu je problem s ukladanim uzivatelskeho nastaveni!!!');
    }

    getCompKey(): string {
        return this.router.url + ':' + this.getComponentName();
    }


    ngOnInit(): void {      

        var key = this.getCompKey();
        //console.log("BaseListComponent:ngOnInit() " + key);

        if(this.baseService.user){
            var tab = this.baseService.user.getSetting(key);
            if(tab != null){
                tab.__proto__ = Table.prototype;
                this.tab = tab;
            }
        }

        if(!this.isSelector && !this.isMultiSelect){
            this.reloadData(this.tab);
        }
        
    }


    /*** pro ovlivnovani zda se maji nacist nove data nebo ne, pokud je komponenta neviditelna netreba nacitat data, podle viditelnosti nacitat nenacitat data */

    @Input() 
    set doReload(val){
        
        if(val && val == true){            
            this.tab.setFilter(this._filter);
            this.reloadData(this.tab);    
        }
        
    }


    get doReload() : boolean {
        return false;
    }


    @Input() 
    set filter(val){
        
        if(!val){            
            return;
        }

        this._filter = val;

        //console.log("BaseListComponent:filter() nastavuji novy filter" + this.getCompKey() + " mojeid: " + this.id);
        this.tab.setFilter(this._filter);
        this.reloadData(this.tab);
    }


    get filter() : TableQuery {
        return this._filter;
    }

        
    @Input() 
    set urlrec(val : string){
        
        if(val == null){
            this._urlrec = "";
        }
        else{
           this._urlrec = val;
        }

        this.onUrlRecChangeEvent.emit(this._urlrec);
    } 

    
    get urlrec(): string {
        return this._urlrec;
    }

      
    onSelected(ev: any){     
        this.onSelectedEvent.emit(ev);        
    }

    onMultiSelect(ev:any){
        this.onSelectedMultiEvent.emit(ev);
    }

    
    getCustomButtons() : any[] {
        return [];
    }

    onCancel(ev:any){
        //console.log("BaseListComponent::onCancel()");
        this.onSelectCancelEvent.emit(ev);        
    }
    
    onEdit(el:any, iswnd:boolean) {        

        //console.log("BaseListComponent::onEdit()");
    } 
   
    
    editRecord(id:number, iswnd:boolean, routeURL: string){

        if(iswnd){
            //this.router.navigate([routeURL]);

            const url = this.router.serializeUrl(
                this.router.createUrlTree([routeURL])
            );

            if(this.baseService.user && this.baseService.user.editokno == 1){ //uzivatel chce otevirat v novem okne
                window.open(url, '_blank');
            }
            else{
                window.open(url, '_self');
            }
            return;
        }        
        else if (!this.detail && this.detailComp){            
            this.detail = this.container.createComponent(this.detailComp).instance;  
            this.detail.urlrec = this.urlrec;
            this.onInitializedDetail(this.detail);
        }
        
        //console.log('BaseList:edit(): ' + id);
        this.detail.edit(id);
    }


    onInitializedDetail(detailComp: any){


    }


    //uloz nastaveni filtru uzivatele
    onSaveSetting(ev:Table){

        var key = this.getCompKey();        
        //console.log(key);

        if(ev == null){ //zrus filter            

            this.baseService.removeUserParam(key).then((resp : Response) => {
                this.response = resp;
                this.baseService.localUserDropSetting(key);
            });
        }
        else{ //uloz nastaveni filtru
            var pp = new SecurityUserParams();
            pp.param = key;
            pp.data = ev.getAsParam();
        
            this.baseService.updateUserParam(pp).then((resp : Response) => {
                this.response = resp;                
                this.baseService.localUserUpdateSetting(resp.data);
            });
        }

    }


    onPrintData(el:any[]){

        //console.log('BaseList::onPrintData()');

        this._printIDRec = Array(el.length);

        for(var i=0; i < el.length; ++i){
            this._printIDRec[i] = el[i].id;
        }
        
        this.baseService.getPrintReports(this.urlrec).then((list: ReportPrint[]) => {
            this._printList = list;

            this._showPrintPopup = false;


            if(list && list.length > 1){
                this._showPrintPopup = true;
            }
            else if(list && list.length > 0){
                this.printReport(list[0].id);
            }

        });        
    }

    printReport(id:number){
        this.baseService.printReport(this._printIDRec, id);
    }

    onDrop(el:any){
        //console.log("BaseListComponent::onDrop()");
    }

    reloadData(table: Table){        
        //console.log("BaseListComponent::reloadData()");
    }


    asyncSetTab(data: TableData){
        //console.log("BaseListComponent::asyncSetTab(), len: " + data.list.length + " selectmode: " + this.isSelector + " name: " + this.getCompKey());
        this.tab.data = data;        

        if(this.tab.data.list.length == 1 && this.isSelector){
           //console.log('Existuje pouze 1 zaznam nastavuji jej...');
            //console.log(this.tab.data.list[0]);
            this.onAutocompleteSelectedEvent.emit(this.tab.data.list[0]);        

        }
    }

    autocomplete(search:string){

        this.tabchild.Fulltext = search;
        /*
        var q = new TableQuery();
        this._filter = q;
        this.tab.setFilter(this._filter);
        this.reloadData(this.tab);
        */
       // console.log('Base:autocomplete()');
    }

}