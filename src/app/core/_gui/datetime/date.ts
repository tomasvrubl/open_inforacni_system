import { Component, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import {FormControl} from '@angular/forms';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import { MatDatepicker } from '@angular/material/datepicker';
import { Moment} from 'moment';
import * as moment from 'moment';


export var MY_FORMAT  = {
  parse: {
    dateInput: 'DD.MM.YYYY',
  },
  display: {
    dateInput: 'DD.MM.YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};  

@Component({
  selector: 'mw-date',
  styleUrls: [ './style.css' ],
  templateUrl: './date.html',
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_LOCALE, useValue: 'cs-CZ'},
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { strict: true, useUtc: false } },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMAT},
  ],
})


export class MWDate { 


    _format : number = -1;
    id: string;
    _date = new FormControl(new Date());
    
    @Output() datumChange = new EventEmitter<Date>();
    @Input() readonly : boolean = false;

    
    constructor(private _eref: ElementRef) { 
        this.id = this.makeid();
        this.format = 1;
    }

    
    

    get datum(): Date {
        //console.log('vracim datum(): ');
        //console.log(this._date.value);
        return this._date.value;
    }

    @Input()
    set datum(val:Date) {

        //console.log('nastavuji datum(): ')
        //console.log(val);

        if(this._date != null && this._date.value != null && val != null){
          const c = moment(this._date.value).toDate();          
          const n = moment(val).toDate();

          if(c == null){
            this._date.setValue(n);
          }
          else{
            this._date.setValue(n);
            
          }

          //this.datumChange.emit(this._date.value);
        }
        else if (val != null) {
          this._date = new FormControl(moment(val).toDate());    
          this.datumChange.emit(this._date.value);
        }
        else {
          this._date = new FormControl();
        }
    }
    


    get den(): boolean {
        return this.format == 2;
    }
    
    @Input()
    set den(val:boolean) {

        if(val && val == true){
          this.format = 1;
        }  
    }


    get mesic(): boolean {
        return this.format == 2;
    }
    
    @Input()
    set mesic(val:boolean) {

        if(val && val == true){

          this.format = 2;
        }  
    }


    get rok(): boolean {
        return this.format == 3;
    }
    
    @Input()
    set rok(val:boolean) {

        if(val && val == true){
          this.format = 3;
        }  
    }



    get format(){        
        return this._format;
    }
    
    @Input()
    set format(val){
  
       // console.log('nastavuji format datumu: ');
        //console.log(val);

        if (val == null){
            val = 3;
        }
        else if(this._format == val){
          return;
        }
        
        
        this._format = val;

        if(val == 2){
            MY_FORMAT.display = {
              dateInput: 'MM/YYYY',
              monthYearLabel: 'MMM YYYY',
              dateA11yLabel: 'LL',
              monthYearA11yLabel: 'MMMM YYYY',
            };

            MY_FORMAT.parse =  { dateInput: 'MM/YYYY'};
           
        }
        else if(val == 3){
          MY_FORMAT.display = {
            dateInput: 'YYYY',
            monthYearLabel: 'YYYY',
            dateA11yLabel: 'LL',
            monthYearA11yLabel: 'YYYY',
          };

          MY_FORMAT.parse =  { dateInput: 'YYYY'};
        }
        else{
            MY_FORMAT.display =  {
              dateInput: 'DD.MM.YYYY',
              monthYearLabel: 'MMM YYYY',
              dateA11yLabel: 'LL',
              monthYearA11yLabel: 'MMMM YYYY',
            }

            MY_FORMAT.parse =  { dateInput: 'DD.MM.YYYY'};
        }

        this._date.setValue(this._date.value);
    }


    getStartView(){
      if(this.format == 2){
         return 'year';
      }
      else if(this.format == 3){
        return 'multi-year';
      }

      return 'month';
    }

    addEvent(event: MatDatepickerInputEvent<Date>) {

      const c = moment(this._date.value).toDate();
      const n = moment(event.value).toDate();
      
      if(c.getFullYear() != n.getFullYear() || c.getMonth() != n.getMonth() || c.getDay() != n.getDay()){

        this._date.setValue(event.value);
        this.datumChange.emit(this._date.value);

      }
      
    }

    setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
      

      const ctrlValue = moment(this._date.value).toDate();
     

      if(ctrlValue.getFullYear() != normalizedMonthAndYear.year() || ctrlValue.getMonth() != normalizedMonthAndYear.month()){

        ctrlValue.setFullYear(normalizedMonthAndYear.year(), normalizedMonthAndYear.month());
        this._date.setValue(ctrlValue);
        this.datumChange.emit(ctrlValue);

      }

      datepicker.close();
    }


    getFormat() : string {
      return  MY_FORMAT.display.dateInput;
    }


    datumZmena(ev: Moment){
      
      var n = null;

      if(ev  != null ) {
        n = ev.toDate();
      }

      //console.log('datum zmena(ev): ');
      //console.log(ev);
      
      this._date.setValue(n);  
      this.datumChange.emit(n);

    }
    
    makeid() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 5; i++)
          text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

}   