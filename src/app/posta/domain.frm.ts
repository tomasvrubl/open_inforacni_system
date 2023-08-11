import { Component, Input, OnInit} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { PostaDomena } from './_obj/posta';
import { PostaService } from './_services/posta.service';


@Component({
  templateUrl : './_view/domain.frm.html',
  providers: []
})

/*** 
 * Domény poštovního serveru
 */
export class PostaDomainForm implements OnInit  { 

    urlrec : string = '/posta/domain';

    _showSestavy: boolean = false;
    _showDetail: boolean = false;
    _showList : boolean = false;

    @Input() detail: PostaDomena = null;
    
    constructor(private serv: PostaService, private route: ActivatedRoute) {    

    }
        
    ngOnInit(): void { 
        
        this.route.params.pipe(switchMap((params: Params) => {             
            if(!params['id']){           
                return Promise.resolve(null);
            }
                        
            return this.serv.getDomain(+params['id']);
        })).subscribe((rec: PostaDomena) => {
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