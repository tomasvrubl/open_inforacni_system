import { Component, Input, OnInit} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { ObjMaterial } from './_obj/organizace';
import { OrganizaceService } from './_services/organizace.service';


@Component({
  templateUrl : './_view/objmat.frm.html',
  providers: []
})

export class ObjMaterialuForm implements OnInit  { 

    _showSestavy: boolean = false;
    @Input() isSelector : boolean = false;
    @Input() detail: ObjMaterial = null;
    

    constructor(private srv: OrganizaceService,
                private route: ActivatedRoute) {              
                
    }
    
        
    ngOnInit(): void { 
        
        this.route.params.pipe(switchMap((params: Params) => { 
                
            if(!params['id']){                   
                return Promise.resolve(null);
            }
                
            return this.srv.getObjMaterialu(+params['id']);
        })).subscribe((t: ObjMaterial) => this.detail = t);      
             
        this.route.data.subscribe(data => {
            if(data.print){
                this._showSestavy = true;
            }
        })
    }    
  
  
}