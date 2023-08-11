import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService, Response, TableData, Table, TableQuery, ReportPrint, TabColumn, SecurityUserParams } from '../core/module';
import { PersPracCinnost } from './module';
import { ProhlidkyService } from './_services/prohlidky.service';

@Component({
    selector: 'pers-prohlidky-nastaveni',
    templateUrl: './_view/prohlidka.nastaveni.html',
    viewProviders: [],
    providers : [ ]
  })

  
export class PersProhlidkaNastaveni implements OnInit { 

    SETTING_PARAM : string = 'PERS_GEN_ZDRAV_PROHL';
    id:string = "";
    response:Response = new Response();

    cboOpt : any[] = [ {value: 0, label: 'VĚK'}, {value: 1, label: 'RIZIKOVOST KATEGORIE'} ];
    cboOptVal: number = 0;

    cboPodm : any[] = [ {value: 0, label: '>'}, {value: 1, label: '>='}, {value: 2, label: '<'} , {value: 3, label: '<='}, {value: 4, label: '='} ];
    cboPodmVal : number = 0;

    cboTakVal : number = 0;
    txtVal : string = '0';
    txtRoky : string = '0';

    podminky: any[] = [];
    cinnost: PersPracCinnost[] = [];


    getComponentName(): string {
        return "PersProhlidkaNastaveni";
    } 



    constructor(protected router:Router, protected srv : ProhlidkyService, protected settsrv: CommonService) {         

        this.settsrv.getSettingParamByCode(this.SETTING_PARAM).then(ret =>  {
            
            try{
                this.podminky = JSON.parse(ret);
            }catch(e){
                this.podminky = [];
            }
            
        });

    }

    ngOnInit(): void {      
        this.id = this.router.url + ':' + this.getComponentName();                
        this.srv.getPracCinnostList().then(lst => {

            var l;
            for(var i=0; i < lst.length; ++i){
                l = lst[i];
                if(l.lhuta > 0){
                    this.cinnost.push(l);
                }                
            }
        });

    }

    onOptChange() : void {
        this.txtVal= this.txtRoky = '0';
    }

    addPodminku() : void {        
        
        var lbl = "";
        
        if(this.cboOptVal == 1){
            lbl = this.getCboVal(this.cboOpt, this.cboOptVal) + " = " + this.txtVal + ' pak ';

            if(this.cboTakVal == 1) {
                lbl += ' VĚK ZAMĚSTNANCE ';
                this.txtRoky = '0';
            }
        }
        else{
            lbl = this.getCboVal(this.cboOpt, this.cboOptVal) + " " + this.getCboVal(this.cboPodm, this.cboPodmVal) + " " + this.txtVal + ' pak ';
        }
        
        this.podminky.push({opt: this.cboOptVal, oper: this.cboPodmVal, tak: this.cboTakVal, val: parseInt(this.txtVal), roky: parseInt(this.txtRoky), lbl: lbl });        
        this.saveMe();
    }


   getCboVal(cbo, val) : string {

        var r = "";
        for(var i=0; i < cbo.length; ++i){
            if(cbo[i].value == val){
                return cbo[i].label;
            }

        }

        return r;
   }

   dropPodminka(i:number) : void {
        this.podminky.splice(i, 1);
        this.saveMe();
   }


   saveMe() : void {

        this.settsrv.setSettingParamByCode(this.SETTING_PARAM, JSON.stringify(this.podminky)).then(resp => {
            this.response = resp;
        });

   }

   onEdit(el:any, iswnd:boolean) {        

   } 


}