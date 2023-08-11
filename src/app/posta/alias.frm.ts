import { Component, Input, OnInit} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { PostaAlias } from './_obj/posta';
import { PostaService } from './_services/posta.service';


@Component({
  templateUrl : './_view/alias.frm.html',
  providers: []
})


/*** 
 * Aliasy v postovnim serveru 
 */

export class PostaAliasForm implements OnInit  { 

    urlrec : string = '/posta/alias';

    _showSestavy: boolean = false;
    _showDetail: boolean = false;
    _showList : boolean = false;

    @Input() detail: PostaAlias = null;
    
    constructor(private serv: PostaService, private route: ActivatedRoute) {    

    }
        
    ngOnInit(): void { 
        
        this.route.params.pipe(switchMap((params: Params) => {             
            if(!params['id']){           
                return Promise.resolve(null);
            }
                        
            return this.serv.getAlias(+params['id']);
        })).subscribe((rec: PostaAlias) => {
            if(rec == null){
                this._showList = true;
            }
            else{
                this._showDetail = true;
            }
            
            this.detail = rec;            
        });      

        this.route.data.subscribe(data => {
            if(data.print){
                this._showSestavy = true;
            }
        })
       
    }    
     
}