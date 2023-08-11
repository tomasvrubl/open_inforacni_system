import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Response } from '../core/module';
import { HlaseniService } from './_services/hlaseni.service';
import { Hlaseni } from './_obj/hlaseni'


@Component({
  selector: 'hlaseni-detail',
  templateUrl : './_view/hlaseni.detail.html',
  providers : [  ]
})

export class HlaseniDetail implements OnInit { 
 
    response : Response = new Response();  
    aTyp : any[] = [];
    showZdrojList: boolean;
    @Input() hlaseni: Hlaseni = new Hlaseni();
    
    
    constructor(private serv: HlaseniService,  private route: ActivatedRoute, private router: Router) {
               
        this.serv.getHlaseniTypList().then((lst : any[])  => this.aTyp = lst);
        this.showZdrojList = false;
    }
    
    ngOnInit(): void {   
        this.route.params.pipe(switchMap((params: Params) => { 
                
            if(!params['id']){                   
                return Promise.resolve(null);
            }
                
            return this.serv.getHlaseniDet(+params['id']);
        })).subscribe((rec: Hlaseni) => this.hlaseni = rec);   
    }
    
    newone() : void {
        this.serv.getHlaseniDet(-1).then((resp: Hlaseni) => this.hlaseni = resp);          
    }
    
    reloadData() : void {        
        this.serv.getHlaseniDet(this.hlaseni.id).then((resp: Hlaseni) => this.hlaseni = resp);          
    }

    saveme() : void {

        this.serv.updateHlaseni(this.hlaseni).then((resp: Response) => {
            this.response = resp;
            this.hlaseni = resp.data;
        });
    }

    onZdrojChanged(ev: any){
        
        this.hlaseni.zdroj_kod = ev.kod;
        this.hlaseni.zdroj = ev.nazev;
        this.showZdrojList = false;
        this.saveme();     
    }
    
    dropme(){

    }
    
   
}