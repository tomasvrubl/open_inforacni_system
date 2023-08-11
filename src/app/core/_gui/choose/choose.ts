import { Component, Input, Output, EventEmitter, ViewChild, OnInit, ComponentRef} from '@angular/core';
import { Router } from '@angular/router';
import { AdHostDirective } from '../adhost.directive'
import { BaseListComponent } from '../baselist/base';


@Component({
  selector: 'mw-choose',
  styleUrls: [ './style.css' ],
  templateUrl: './view.html',
  viewProviders: [],
  providers : [ ]
})
   
export class ChooseComponent implements OnInit { 

        
    @ViewChild(AdHostDirective, {static: true}) adHost!: AdHostDirective;
    componentRef : ComponentRef<BaseListComponent> = null;

    _isToggle : boolean = false; //zda je otevrene popup tlacitkem ...
    _selectedVal : any = null;
    _txtValue: string = "";
    @Input() id : string;
    @Input() popupTitle: string ="";
    @Input() label: string = "";
    @Input() txtPlaceholder: string = "";
    @Input() txtLabel: string;    
    @Input() TypeOfList : any; //typ seznamu 
    @Input() urlDetail : string = null;
    @Input() readonly : boolean = false;
    
    @Input() extraFilter : any = null; //filtr pro odfiltrovani dat, ktere chci zobrazit pouze v seznamu


    @Output() onInputChanged = new EventEmitter();
    @Output() onSelectedEvent = new EventEmitter();

    @Input() showPopup :boolean  = false;  
   
    constructor(protected router:Router) {

        const stringArr = [];
        for(let i = 0; i < 2; i++){
          const S4 = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
          stringArr.push(S4);
        }

        this.id = "choo-"+stringArr.join('-');
    }


    ngOnInit(): void {
        this.loadComponent();
        this._isToggle = false;
    }

    
    loadComponent() {
    
        //console.log('loadComponent() id: ' + this.label);
        const viewContainerRef = this.adHost.viewContainerRef;
        viewContainerRef.clear();
    
        this.componentRef = viewContainerRef.createComponent<BaseListComponent>(this.TypeOfList);
        this.componentRef.instance.isSelector = true;
        this.componentRef.instance.onSelectedEvent.subscribe(val => {
          this.showPopup = false;
          this._selectedVal = val;
          this.onSelectedEvent.emit(val);
        });

        //autocomplete select
        this.componentRef.instance.onAutocompleteSelectedEvent.subscribe(val => {

            //console.log('loadComponent()->onAutocompleteSelectedEvent id: ' + this.label);

            if(this._isToggle){
                return;
            }

            
            this.showPopup = false;
            this._selectedVal = val;
            this.onSelectedEvent.emit(val);
          });


        
    }
    


    @Input() 
    set txtValue(val){
        
        if(!val){
            this._txtValue = "";
        }
        else{
            this._txtValue = val;
        }       
    }


    get txtValue() : string {
        return this._txtValue;
    }


    navigateDetail() {

        const url = this.router.serializeUrl(
            this.router.createUrlTree([this.urlDetail])
        );

        window.open(url, '_blank');
    }

    showBrowser(){        
       // console.log('showBrowser()');
        this.showPopup=true;

        this._isToggle = true;
        if(this.componentRef.instance){ 
         //   console.log('showBrowser()-> autocomplete()');

            if(this.extraFilter){
                this.componentRef.instance.tab.extraFilter = this.extraFilter;
            }
         
            this.componentRef.instance.autocomplete(this.txtValue.trim());
        }
    }
    
    

    onKey(ev:any){    
        //console.log('onKey() '   + this.label);
        //console.log(ev);
        this.showPopup = false;   

        var val = this.txtValue.trim();

        if(val.length < 1){

            if( this._selectedVal != null){
                this.onSelectedEvent.emit(null);
            }
            this.txtLabel = "";
            this._selectedVal = null;
            return;
        }

        if(val.length < 2){
            return;
        }

        this.showPopup = true;  

        if(this.componentRef.instance){ 
            //console.log('componentRef.instance.autocomplete()');

            if(this.extraFilter){
                this.componentRef.instance.tab.extraFilter = this.extraFilter;
            }
         
            this.componentRef.instance.autocomplete(this.txtValue.trim());
        }
    }

    /*
    onContentSelectedEvent(ev:any){

        this.onSelectedEvent.emit(ev);
    }*/
     
}
