import { Component, Input, Output, EventEmitter} from '@angular/core';
import { Response } from '../core/module';
import { HlaseniService} from './_services/hlaseni.service';
import { HlaseniTyp} from './_obj/hlaseni'

@Component({
  selector: 'hlaseni-typ-detail',
  templateUrl : './_view/hlaseni.typ.detail.html',
  providers: [ ]
})

export class HlaseniTypDetail { 

    response : Response;  

    @Input() typ : HlaseniTyp;    
    @Output() typChanged = new EventEmitter();
    
    
    constructor(private serv: HlaseniService) {              
        this.typ = new HlaseniTyp();            
        this.response = new Response();    
    }
    

    onSubmit() {}
    
    saveme() {
        this.serv.updateHlaseniTyp(this.typ).then((response :Response) =>  {
            this.response = response;
            this.typ = response.data;
            this.typChanged.emit(this);
       });        
    }
    
    newone(){
        this.serv.getHlaseniTyp(-1).then((j: HlaseniTyp) => this.typ = j);
    }
    
    dropme(){        
        this.serv.dropHlaseniTyp(this.typ).then((response :Response) =>  {
             this.response = response;

            if (response.kod == 0){
                this.serv.getHlaseniTyp(-1).then((j: HlaseniTyp) => this.typ = j).then(()=>this.typChanged.emit(this));            
            }  
        });            
    }
    
   

}