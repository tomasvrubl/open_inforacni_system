import { Component, Input, OnInit} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Setting, CommonService} from '../core/module';

@Component({
  templateUrl : './_view/setting.frm.html',
  providers: []
})

export class SettingForm implements OnInit  { 

    @Input() rec: Setting = null;
    
    constructor(private commService: CommonService, private route: ActivatedRoute) {              
    }
    
        
    ngOnInit(): void { 

        this.route.params.pipe(switchMap((params: Params) => { 
                
            if(!params['id']){                   
                return Promise.resolve(null);
            }
                
            return this.commService.getSettingParam(+params['id']);
        })).subscribe((setting: Setting) => this.rec = setting); 
             
    }    
    
  
}