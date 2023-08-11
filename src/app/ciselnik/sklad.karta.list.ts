import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { SkladKarta, Sklad } from './_obj/ciselnik';
import { CiselnikService } from './_services/ciselnik.service';
import { Response, TableData,Table} from '../core/module';


@Component({
  selector: 'sklad-karta-list',
  templateUrl : './_view/sklad.karta.list.html',
  providers : [  ]
})

export class SkladKartaList implements OnInit { 


    response : Response;  
    tabKarta: Table;
    skladKarta: SkladKarta = null;
    _cboSklad: Sklad[];
    _sklad_id:number;
    @Input() isSelector : boolean = false;
    @Input() isMultiSelect : boolean = false;
    @Output() onSelectedSkladKarta = new EventEmitter();
    @Output() onSelectedSkladKartaList = new EventEmitter();
    @Output() onSelectCancel = new EventEmitter();
    
    constructor(private ciselnikService: CiselnikService,  private router: Router, private route: ActivatedRoute) {
        this.response = new Response();
        this.tabKarta = new Table();
        this.tabKarta.header = [
            { label: 'Kód', clmn: 'kod' },
            { label: 'Název', clmn: 'nazev' },
            { label: 'Množství', clmn: 'mnozstvi' },
            { label: 'Jednotka', clmn: 'jednotka' },
            { label: 'Množství 2', clmn: 'mnozstvi2' },
            { label: 'Jednotka 2', clmn: 'jednotka2' },
            { label: 'Platnost', clmn: 'platnost', type: 2 },
            { label: 'Externí kód', clmn: 'extern_kod' },            
            { label: 'Sklad', clmn: 'sklad' },  
            { label: 'Změněno', clmn: 'zmeneno', type: 4 },
            { label: 'Změnil', clmn: 'zmenil' },
            { label: 'SkladID', clmn: 'sklad_id', hidden: true },
            { label: 'Jednotka ID', clmn: 'jednotka_id', hidden: true },
            { label: 'Jednotka2 ID', clmn: 'jednotka2_id', hidden: true }
            
        ];
            
        this._cboSklad = [];
        this._sklad_id = -1;
    }
    
    ngOnInit(): void {           
        
        
        this.ciselnikService.getSkladList().then((skl:Sklad[])=> {
            this._cboSklad = skl;
        });
        
        this.route.params.pipe(switchMap((params: Params) => { 
                
            if(!params['skladid']){                   
                return this.ciselnikService.getSkladKartaTable(null);
            }
            
            var query = this.tabKarta.getQuery();
            query.clmn.push({clmn: 'sklad_id', type: 1, filter: [{operator: 0, value: +params['skladid']}]});
            
            return this.ciselnikService.getSkladKartaTable(query);
        })).subscribe(response => {
            this.tabKarta.header.pop();
            this.asyncSetTab(response);
        });    
             
    }
    
    asyncSetTab(data: TableData){
        this.tabKarta.data = data;
    }
    
    
    onEdit(el:any, iswnd:boolean) {               
        if(iswnd){
            this.router.navigate(['/ciselnik/sklad/karta/'+ el.id]);
        }                
        else{
            this.ciselnikService.getSkladKarta(el.id).then((data:SkladKarta) => {
                this.skladKarta = data;
            });    
        }
    } 
   
    onDrop(el:any){
        this.ciselnikService.dropSkladKarta(el).then(response => this.asyncReloadData(response));
    }
    
    asyncReloadData(response: Response) {        
       this.response = response;       
       this.ciselnikService.getSkladKartaTable(this.tabKarta.getQuery()).then(response => this.asyncSetTab(response)); 
       
    }
    
      
    onSelected(ev: any){     
        this.onSelectedSkladKarta.emit(ev);        
    }
    
    onMultiSelect(ev:any){
        this.onSelectedSkladKartaList.emit(ev);
    }
    
    onCancel(ev:any){
        this.onSelectCancel.emit(ev);        
    }
    
 
    onSkladChange(val:number){       

        this.skladKarta = null;

        if(this.isMultiSelect || this.isSelector){            
            var query = this.tabKarta.getQuery();

            for(var i=0; i < query.clmn.length; ++i){
                if(query.clmn[i].clmn == 'sklad_id'){
                    query.clmn.splice(i, 1);
                    break;
                }
            }

            if(val > 0){
                query.clmn.push({clmn: 'sklad_id', type: 1, filter: [{operator: 0, value: val}]});            
            }
            
            this.ciselnikService.getSkladKartaTable(query).then(response => this.asyncSetTab(response)); 
        }
        else{

            if(val > 0){
                this.router.navigate(['/ciselnik/sklad/'+val+'/karta/list']);           
            }
            else{
                this.router.navigate(['/ciselnik/sklad/karta/list']);           
            }
            
        }
        
    }  
}