import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TerminalLinkaService } from './_services/terminal.service';
import { TabColumn, Table, TableQuery } from 'src/app/core/module';
import * as moment from 'moment';

@Component({
    selector: 'historie-smena-list',
    templateUrl : './_view/historie.smena.html',
    viewProviders: [],
    providers : [  ]
  })
  


export class SmenaList  implements OnInit {
    
    zdroj_kod : string = '';
    tab: Table = new Table();
    datum : Date = new Date();

    getComponentName(): string {
        return "SmenaList";
    } 


    constructor(private srv: TerminalLinkaService,  protected router: Router, private route: ActivatedRoute) {
    


        this.tab.header = [
            { label: 'ID', clmn: 'id', hidden: true },
            { label: 'Datum', clmn: 'datum', type: TabColumn.TYPE_DATE},
            { label: 'Smena', clmn: 'smena' , right: true},
            { label: 'Odvedeno ks', clmn: 'odv_mnozstvi', type: TabColumn.TYPE_INT},
            { label: 'Utrženo ks', clmn: 'utrz_forem', type:  TabColumn.TYPE_INT},
            { label: 'Terminál osoba', clmn: 'termosoba', type:  TabColumn.TYPE_INT},
            { label: 'Změněno', clmn: 'zmeneno', type: TabColumn.TYPE_DATETIME },
            { label: 'Změnil', clmn: 'zmenil', right: true }
        ];



    }


    ngOnInit(): void {
        this.zdroj_kod =  this.route.parent.snapshot.paramMap.get('kod');    
        
        this.reloadData();
    }

    
    onEdit(el:any, ) {               


        const url = this.router.serializeUrl(
            this.router.createUrlTree(['/terminal/linka/'+this.zdroj_kod+'/smena/'+ el.id])
        );

        window.open(url, '_self');

    } 
    
    
    reloadData(){

        this.tab.clearFilter();
        var query = new TableQuery();       
        query.page = this.tab.data.page;
        query.limit = this.tab.data.limit;
        query.clmn = this.tab.header;
        
        query.clmn.push({clmn: 'datum', type: TabColumn.TYPE_DATE, filter: [{operator: 0, value: moment(this.datum).format("YYYY-MM-DD")}]});

       this.srv.getZapisSmenyTable(this.tab.getQuery()).then(response => {
            this.tab.data = response; 
       }); 
    }
    

    getAktualniDatum() : string {
        return  moment(this.datum).format("DD.MM.YYYY");
    }


    nastavDen(days:number){

        var r = new Date(this.datum);
        r.setDate(r.getDate() + days);
        this.datum = r;
        this.reloadData();
    }

    prihlasenaOsoba() {

        if(this.srv.userTerminal){
            return this.srv.userTerminal.osoba;
        }

        return '';
    }

    nastavDnes(){
        this.datum = new Date();
        this.reloadData();
    }


    formatDatum(d:any){
        
        return moment(d.date).format('DD.MM.YYYY');
    }

    
}