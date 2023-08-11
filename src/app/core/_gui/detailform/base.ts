import { Component, Input, OnDestroy, ViewChild } from '@angular/core';
import { AttachmentForm } from '../../module';
import { ReportPrint} from '../../_obj/common';
import { BaseService } from '../../_services/base.service';
import { DetailComponent } from './detail';
import { CustomButton } from '../custombutton';


/*
 Detail formular, pouziva jako podnoz DetailComponent
*/

export class Zalozka {
    label: string = '';
    title: string = ''; //napoveda
    tocall: (idx:number) => void;


    Zalozka(label:string, title:string, tocall:()=>void){
        this.label = label;
        this.title = title;
        this.tocall = tocall;
    }
}



@Component({
    selector: 'detail-form',
    templateUrl: './view.html',
    viewProviders: [],
    providers : [ ]
})

export class DetailForm implements OnDestroy { 
    
    @ViewChild('priloha') att:AttachmentForm;
    comp! : DetailComponent;
    @Input() customButton: CustomButton[] = []; // volitelna tlacitka
    @Input() prilohy: boolean = true;      //zobrazit prilohy moznost vkladani priloh
    @Input() ButtonSave: boolean = true;   //zaznam je pouze ke cteni
    @Input() ButtonDelete: boolean = true; //zaznam je pouze ke cteni
    _printList: ReportPrint[] = [];
    _showPrintPopup: boolean = false;
    _printIDRec: number[] =  [];
    _selZalozka : number = -1;
    
    
    constructor(protected baseService : BaseService) { 

    }


    @Input() 
    set detail(val : any){
        
        if(val == null){
           return;
        }
        else{

            if(this.comp){
                this.comp.detailChanged.unsubscribe();
            }

            this.comp = val;
            this.comp.detailChanged.subscribe((ev:any)=>{
                this.att.urlrec = ev.detail.priloha_hash;
                this.att.reloadData();
            })



        }            
        
    } 

    ngOnDestroy() {
        
        if(this.comp){
            this.comp.detailChanged.unsubscribe();
        }

    }


        
    get detail(): any {
        return this.comp;
    }

    getZalozky() : any[] {
        return [];
    }


    saveme() {
        this.comp.saveme();                
    }


    newone(){
        this.comp.newone();
    }

    dropme(){
        this.comp.dropme();
    }

    
    printme(){

        var recid = this.comp.detail.id;
                
        this._printIDRec = Array();
        this._printIDRec.push(recid);
        
        this.baseService.getPrintReports(this.comp.urlrec).then((list: ReportPrint[]) => {
            this._printList = list;

            this._showPrintPopup = false;


            if(list && list.length > 1){
                this._showPrintPopup = true;
            }
            else if(list && list.length > 0){
                this.printReport(list[0].id);
            }

        });        


    }


    printReport(id:number){
        this.baseService.printReport(this._printIDRec, id);
    }
    
}