import { Component,  OnInit, Input, Output, EventEmitter} from '@angular/core';
import { SkladKarta, Sklad } from './_obj/ciselnik';
import { CiselnikService } from './_services/ciselnik.service';
import { iDetail, ItemList, Response, Table } from '../core/module';

@Component({
  selector: 'sklad-karta-detail',
  templateUrl : './_view/sklad.karta.detail.html',
  providers: [ ]
})

export class SkladKartaDetail  implements iDetail, OnInit { 

    response : Response;  
    selectSkladList: boolean;
    tabSklady : Table;
    jednotky : ItemList[] = [];
    @Input() karta : SkladKarta ;    
    @Output() kartaChanged = new EventEmitter();

        
    @Input()     
    set sklad(val: Sklad){
        
        if(val == null || val.id < 1)
            return;
            
        this.tabSklady.data.list.push({id: val.id, kod: val.kod, nazev: val.nazev, platnost: val.platnost, zmenil: val.zmenil, zmeneno: val.zmeneno});                
    }
    
    
    constructor(private cisService: CiselnikService) {  
        this.selectSkladList = false;            
        this.karta = new SkladKarta();            
        this.response = new Response();    
        this.tabSklady = new Table();
        this.tabSklady.header = [
            { label: 'Kód skladu', clmn: 'kod' },
            { label: 'Název', clmn: 'nazev' },
            { label: 'Platnost', clmn: 'platnost', type: 2 },
            { label: 'Změněno', clmn: 'zmeneno', type: 4 },
            { label: 'Změnil', clmn: 'zmenil' }
        ];
    }
    
     ngOnInit(): void {                
        this.cisService.getJednotkaList().then((jednotky : any[]) =>  {
            this.jednotky = jednotky;
        });          
    }
  
    onSubmit() {}
    
    saveme() {
        
       if(this.karta.id < 0){           
           this.karta._sklad = this.tabSklady.data.list;           
       }
        
       this.cisService.updateSkladKarta(this.karta).then((response :Response) =>  {
            this.response = response;
            this.karta = response.data;
            this.kartaChanged.emit(this);
       });        
    }
    
    newone(){
        this.edit(-1);
    }

    edit(id:number){
        this.cisService.getSkladKarta(id).then((j: SkladKarta) => this.karta = j);
    }
    
    dropme(){        
        this.cisService.dropSkladKarta(this.karta).then((response :Response) =>  {
             this.response = response;

            if (response.kod == 0){
                this.cisService.getSklad(-1).then((j: SkladKarta) => this.karta = j).then(()=>this.kartaChanged.emit(this));            
            }  
        });            
    }
    
    selectJednotkaChange(el:any){    
        this.karta.jednotka_id = el.options[el.selectedIndex].value;
        console.log(el);
    }
    
    selectJednotka2Change(el:any){    
        this.karta.jednotka2_id = el.options[el.selectedIndex].value;
        console.log(el);
    }
    
    onSelectedSkladList(arr){
        
        let isin;
        for(var i=0; i < arr.length; ++i){
            
            isin = false;
            for (var j = 0; j < this.tabSklady.data.list.length; ++j){
                if(this.tabSklady.data.list[j].id == arr[i].id)
                {
                    isin = true;
                    break;
                }
            }
            
            if(!isin){
                this.tabSklady.data.list.push(arr[i]);    
            }            
        }
                       
        this.selectSkladList=false;
    }
    
   

}