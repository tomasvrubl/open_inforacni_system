import { Component, Input, OnInit} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { MenuItem, CommonService} from '../core/module';

@Component({
  templateUrl : './_view/menu.frm.html',
  providers: []
})

export class MenuDefForm implements OnInit  { 

    urlrec : string = '/admin/menu';

    _showDetail: boolean = false;
    _showList : boolean = false;

    @Input() menuitem: MenuItem;
    
    constructor(private commonService: CommonService, private route: ActivatedRoute) {              
        this.menuitem = null;
    }
    

    ngOnInit(): void { 
        
        this.route.params.pipe(switchMap((params: Params) => {             
            if(!params['id']){           
                return Promise.resolve(null);
            }
                        
            return this.commonService.getMenuItem(+params['id']);
        })).subscribe((rec: MenuItem) => {
            if(rec == null){
                this._showList = true;
            }
            else{
                this._showDetail = true;
            }
            
            this.menuitem = rec;            
        });      
    }    
     

}