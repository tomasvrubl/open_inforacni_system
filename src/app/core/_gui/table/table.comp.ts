import { Component, OnInit, Input, Output, EventEmitter, ElementRef, HostListener, AfterViewChecked } from '@angular/core';
import { Table, TabColumn } from '../../_obj/common';
import * as XLSX from 'xlsx-js-style';
import * as moment from 'moment';
import { CustomButton } from '../custombutton';


declare var jQuery : any;


@Component({
  selector: 'mw-table',
  styleUrls: [ './style.css' ],
  templateUrl: './view.html',
  host: {
    '(document:click)': 'onClick($event)',
  }
})


export class TableComponent implements OnInit, AfterViewChecked { 
    
    scrHeight:any;
    scrWidth:any;

    @Input() css : string;
    _table : Table;
    @Input() id : string;
    @Input() DropButton: boolean = false;
    @Input() EditButton: boolean = false;
    @Input() SelectButton: boolean = false;
    @Input() MultiSelectButton: boolean = false;
    @Input() MultiSelect: boolean = false;
    @Input() CollapseIcon: boolean = true;
    @Input() PDFButton: boolean = false;
    @Input() FilterButton: boolean = false;
    @Input() CustomButton: CustomButton[] = [];    
    @Input() hasPaginator: boolean = true;
    @Input() hasFilter: boolean = true;
    @Input() hasSort: boolean = true;
    @Input() ShowSummary: boolean = false;

    @Output() onEditRecord = new EventEmitter();
    @Output() onEditRecordWnd = new EventEmitter();
    @Output() onDropRecord = new EventEmitter();
    @Output() onSortColumn = new EventEmitter();
    @Output() onFilterChanged = new EventEmitter();
    @Output() onSelectRecord = new EventEmitter();
    @Output() onMultiSelect = new EventEmitter();
    @Output() onPaginatorLimit = new EventEmitter();
    @Output() onPaginatorPage = new EventEmitter();
    @Output() onReloadData = new EventEmitter();
    @Output() onSaveSetting = new EventEmitter();
    @Output() onPDFButton = new EventEmitter();  
    
    _isPopIDX: number = -1;
    _editIDX: number = -1;
    _colspan: number = 0;
    _selIDX: number = -1;
    _multiSel: any[] = [false];
    fulltextValue: string ='';

    constructor(private _eref: ElementRef) {
        this.id = "mwtab-id-"+Math.floor(Math.random()*1000);    
        this.getScreenSize();  
    }

    @HostListener('window:resize', ['$event'])
    getScreenSize(event?) {
          this.scrHeight = window.innerHeight;
          this.scrWidth = window.innerWidth;
          this.ngAfterViewChecked();
    }


    ngAfterViewChecked(): void {
    
      const p = jQuery('#'+this.id+'-mw-table');      
      const tablepart = jQuery('#'+this.id+'-mw-table > .table-part');

      if(tablepart.parents('.table-part').length > 0){
         tablepart.css('height', 'auto');
         return;
      }
      else if(p.parents('.detail').length > 0){        
         tablepart.css('height', 'auto');
         return;
      }

      
      const toolpartH = jQuery('#'+this.id+'-mw-table > .bottom-tools').height();

      
      const tablepartH = tablepart.height();
      if(Number.isNaN(tablepartH) || p == undefined || p.offset() == undefined){
        tablepart.css('height', 'auto');  
        return;
      }


      var wfull = jQuery('.fulltext').is(":visible") ? jQuery('.fulltext').height() : 0;

      const vv = Math.floor(this.scrHeight - p.offset().top - toolpartH - 20 - wfull);

      if(vv  < 0){
        return;
      }
        

      tablepart.css('height', vv);

    }
    
    ngOnInit(): void { 

        this._selIDX = -1;
        var h = this._table.header;
        for(var i=0; i < h.length; ++i){
         
            if(!h[i].sort){
               h[i].sort = 0;
            }
            
            if(!h[i].filter){
                h[i].filter = [ {operator: 6, value: null }];
            }
            else if (h[i].filter.length  < 1){
                h[i].filter = [ {operator: 6, value: null }];
            }
               
        }
        jQuery("#tr-ed-"+this.id).hide();   
    }
 
    @Input() 
    set Fulltext(val : string){        
        
        this.fulltextValue = val;
        this.fulltextKeyHandler(null);

    } 

    get Fulltext(): string {
        return this.fulltextValue;
    }


    @Input() 
    set table(val : Table){        
        this._table = val;      
        this._multiSel  = Array(this.table.data.list.length);

        var lst = this.table.data.list;
        for(var i=0; i <  lst.length; ++i){
            this._multiSel[i] = false;
        }

    } 

    get table(): Table {
        return this._table;
    }

    addFilter(idx:number){
        this.table.header[idx].filter.push({operator: 6, value: null});        
    }
    
    dropFilter(idx:number, pos:number){
        
        var h = this.table.header[idx];
        h.filter.splice(pos, 1);
                
        if (h.filter.length < 1){
            h.filter = [ {operator: 6, value: null }];
        }
    }
    
    applyFilter(idx:number){
        this._isPopIDX = -1;   
        this.saveFilterSett();
        this.onFilterChanged.emit(this.table.header);    
        this.onReloadData.emit(this.table);               
    }
    
    
    showFilterPopup(event: any, idx:number){
        event.stopPropagation();
        this._isPopIDX = idx;     
    }
    
    onClick(event : any) {

        var name = event.target.getAttribute("name");        
        
        if(name){
            if(name.localeCompare("tab_pop_drop") == 0){
                return;
            }
            else if(name.localeCompare("table_popup_open") == 0){
                return;
            }
        }
        
        var popup = this._eref.nativeElement.querySelector("div[name='table_popup']");        
        if (popup && !popup.contains(event.target) && this._isPopIDX > -1){
            this._isPopIDX = -1;       
        }
    }
        
    isFilter(filter: any){        
        return filter && filter.length > 0 && filter[0].value != null;
    }
   
    
    clearFilter(idx:number){
        this.table.header[idx].sort = 0;
        this.table.header[idx].filter = [ {operator: 6, value: null }];

        this._isPopIDX = -1; 
        this.saveFilterSett();
        this.onFilterChanged.emit(this.table.header);    
        this.onReloadData.emit(this.table);               
    }
    
    editRecordView(idx:number){
        this._editIDX = idx; 
        this.onEditRecordWnd.emit(this.table.data.list[idx]);
    }
    
    @Input()
    set EditIndex(val){
        this._editIDX = val;
       
        this.editRecord(this._editIDX);
    }
    
    get EditIndex(){
        return this._editIDX;
    }

   

    editRecord(idx:number){  
   
        if(this._editIDX == idx){
            this._editIDX = -1;
            var t = this;
            jQuery("#tr-ed-"+this.id+" > td > div").slideUp(function(){
                jQuery("#tr-ed-"+t.id).hide();    
            });
            return;
        }
        
        this._colspan = this.table.header.length +2;
        
        if (this.DropButton || this.EditButton || this.PDFButton){
            this._colspan++;
        }

        if(this.MultiSelectButton || this.SelectButton || this.MultiSelect ){
            this._colspan++;
        }


        this._editIDX = idx; 
        this.onEditRecord.emit(this.table.data.list[idx]);

        jQuery('#'+this.id+' > tbody > tr[ridx="'+idx+'"]').after(jQuery("#tr-ed-"+this.id));       
        jQuery("#tr-ed-"+this.id).show();    
        jQuery("#tr-ed-"+this.id+" > td > div").slideDown();          

    }
    
    sortColumn(idx:number){
   
        if(!this.table.header[idx].sort){
            this.table.header[idx].sort = 0;
        }
        
        this.table.header[idx].sort++;
        
        if(this.table.header[idx].sort > 2){
            this.table.header[idx].sort = 0;    
        }
        
        this.onSortColumn.emit(this.table.header);
        this.onReloadData.emit(this.table);
    }
    
    dropRecord(e:any){     
        
        if(this._editIDX > -1){

            var tid = this.id;
            jQuery("#tr-ed-"+tid+" > td > div").slideUp(function(){
                jQuery("#tr-ed-"+tid).hide();    
            });
            
            this.onDropRecord.emit(this.table.data.list[this._editIDX]);    
        }

        this._editIDX = -1;
    }
   
    
    onLimitChange(limit){
        this.table.data.limit = limit;
        this.onPaginatorLimit.emit(limit);        
        this.onReloadData.emit(this.table);
    }
    
    onPageChange(page){        
        this.table.data.page = page;
        this.onPaginatorPage.emit(page);
        this.onReloadData.emit(this.table);
    }
    
    saveFilterSett(){
        this.onSaveSetting.emit(this.table);
    }
    
    cleanFilterSett(){        
        for(var i = 0; i < this.table.header.length; ++i){
            this.clearFilter(i); 
        }        
        this.onSaveSetting.emit(null);
        this.onReloadData.emit(this.table);
    }
    
    reloadData(){

        jQuery("#tr-ed-"+this.id).hide();   
        this._editIDX = -1;
        this.onReloadData.emit(this.table);
    }
    
    
    checkAll(isChecked:any){
    
        var lst = this.table.data.list;
        for(var i=0; i <  lst.length; ++i){
            this._multiSel[i] = isChecked;            
        }

    }

    onPDFButtonMulti(){

        var sel = [];
        for(var i=0; i < this._multiSel.length; ++i){
            if(this._multiSel[i] == true){
                sel.push(this.table.data.list[i]);
            }                        
        }

        if(sel.length < 1){
            alert('Nejprve vyber alespoň jeden záznam');    
        }
        else{            
            this.onPDFButton.emit(sel);
        }
    }

    useSelected(){
        
        if (this.MultiSelectButton || this.MultiSelect){                                
            var sel = [];
            for(var i=0; i < this._multiSel.length; ++i){
                if(this._multiSel[i] == true){
                    sel.push(this.table.data.list[i]);
                }                        
            }

            if(sel.length < 1){
                alert('Nejprve vyber alespoň jeden záznam');      
            }
            else{
                this.onMultiSelect.emit(sel);
            }
        }
        else{
            
            if(this._selIDX > -1){
                this.onSelectRecord.emit(this.table.data.list[this._selIDX]);    
            }
            else{
                alert('Nejprve vyber záznam');
            }
        }                
    }

    getSelected() : any{

        if (this.MultiSelectButton || this.MultiSelect){                                
            var sel = [];
            for(var i=0; i < this._multiSel.length; ++i){
                if(this._multiSel[i] == true){
                    sel.push(this.table.data.list[i]);
                }                        
            }

            if(sel.length < 1){
                return [];
            }
            else{
                return sel;
            }
        }
        else{
            
            if(this._selIDX > -1){
                return this.table.data.list[this._selIDX];    

            }
            else{
                return null;
            }
        }  
    }
   
    
    onPDFButtonClick(idx:number){
        this.onPDFButton.emit([this.table.data.list[idx]]);
    }

    exportXLS(){
        
        
        var sheet = [], row = [], val, clmntype;
        var clmns = this.table.header;
        var csize = clmns.length;

        clmns.forEach(c=>{
            row.push({t: "s", v: c.label, s: { fill: { fgColor: { rgb: "5588b3"}}, font: { color: { rgb: "FFFFFF" } }} });
        })

        sheet.push(row);

        var list = this.table.data.list;

        var t = 's';
        for(var j=0; j < list.length; ++j){

            row = [];
            for(var i=0; i < csize; ++i){
                
                val = list[j][clmns[i].clmn];
                clmntype = clmns[i].type;

                t = 's';
                if(val === null){
                    val = "";
                }
                else if(typeof val === 'object'){         
           
                    if(clmntype == 3 && val.hasOwnProperty('date')){
                        val = moment(val.date).format('DD.MM.YYYY');                 
                    }
                    else if(clmntype == 4 && val.hasOwnProperty('date')){
                         val = moment(val.date).format('DD.MM.YYYY HH:mm:ss');                 
                    }
                    else if(clmntype == 5){ //zobrazeni casu 
       
                       if(val > 0){
                           val = moment.utc(val*1000).format("mm:ss");
                       }                
                       else {
                            val = "";
                       } 
                    }
                    else if(clmntype == 1 && (val.hasOwnProperty('class') ||  val.hasOwnProperty('style'))){
                       val = val.val;
                       t = 'n';
                    }
                    else if(val.hasOwnProperty('class') || val.hasOwnProperty('style')){
                       val = val.val;
                       t = 'n';
                    }
                    else{
                        val = JSON.stringify(val);
                    }
                }
                else if(clmntype == 1){
                    t = 'n';
                }

                row.push({v: val, t: t});
            }

            sheet.push(row);
        }

    
       const ws: XLSX.WorkSheet =  XLSX.utils.aoa_to_sheet(sheet);


       const wb: XLSX.WorkBook = XLSX.utils.book_new();
       if(!wb.Props) wb.Props = {};
            wb.Props.Title = "Data GIS";

       XLSX.utils.book_append_sheet(wb, ws, 'Data');
       XLSX.writeFile(wb, "Export_table.xlsx", { compression: true });
    }
 


    cellCSS(val:any){

        if(val == null){
            return '';
        }
        else if(val.hasOwnProperty('class')){                
            return val.class;
        }

        return '';
    }


    rowCSS(val:any){
        if(val == null){
            return '';
        }
        else if(val.hasOwnProperty('trclass')){                
            return val.trclass;
        }

        return '';
    }
 
    
    cellVal(val:any, clmntype:number){
        

        if(val == null){
            return ''
        }
        else if(typeof val === 'boolean'){             
             return val == true ? 'Ano' : 'Ne';
        }
        else if(typeof val === 'object'){         
           
             if(clmntype == 3 && val.hasOwnProperty('date')){
                return moment(val.date).format('DD.MM.YYYY');                 
             }
             else if(clmntype == 4 && val.hasOwnProperty('date')){
                return moment(val.date).format('DD.MM.YYYY HH:mm:ss');
             }
             else if(clmntype == 7 && val.hasOwnProperty('date')){
                return moment(val.date).format('HH:mm');
             }
             else if(clmntype == 1 && val.hasOwnProperty('class')){                 
                return this.numberFormat(val.val, 2);
             }
             else if(clmntype == 6 && val.hasOwnProperty('class')){                 
                return this.numberFormat(val.val, 0);
             }
             else if(val.hasOwnProperty('class')){                
                return val.val;
             }
             else if(val.hasOwnProperty('style')){
                return "<span style='"+val.style+"'>"+val.val+"</span>";
             }
             else{
                 val = JSON.stringify(val);
             }
         }
         else if(clmntype == 5){  //url adresa
            return "<a href='"+val+"' target='_blank'>"+val+"</a>";
         }
         else if(clmntype == 1 ){
             val = this.numberFormat(val, 2);
         }
         else if(clmntype == 6){
            val = this.numberFormat(val, 0);
         }

         return val;
    }

    getSummary(clmn:number, cl:TabColumn){

        if(cl.type != 1 || cl.nosum){
            return '';
        }

        var s = 0;
        var v;
        for (var j = 0; j < this.table.data.list.length; ++j){

            v = this.table.data.list[j][this.table.header[clmn].clmn];
            if(v == null)
                continue;

            if(cl.type == 1 &&  (typeof v === 'object') && v.hasOwnProperty('class')){
                v = v.val;
            }

            s += Number(v);            
        }

        return this.numberFormat(s, 2);
    }


    numberFormat(num:number, prec:number) {
        
        try{
            return num.toFixed(prec).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
        }catch(ex){
            return num;
        }        
    }


    clickOnRow(i:number){
        this._selIDX = i;
        if(this.SelectButton){
            this.useSelected();
        }
    }
 

    isFultext(){
        
        for(var i=0; i < this.table.header.length; ++i){

            if(this.table.header[i].fulltext){
                return true;
            }
        }

        return false;
    }
 
    _prevSearchText : string = '';
    fulltextKeyHandler(ev:any){   
        
        if(this.fulltextValue.trim() === this._prevSearchText){
            return;
        }


        if(this.fulltextValue.length < 3){

            if(this.table.fulltext.length > 0){
            
                this.table.fulltext = [];
                this.onReloadData.emit(this.table);
            }

            this.table.fulltext = [];
            return;
        }

        this.table.fulltext = [];

        for(var i=0; i < this.table.header.length; ++i){

            if(this.table.header[i].fulltext){
                this.table.fulltext.push({clmn: this.table.header[i].clmn, val: this.fulltextValue});
            }
        }
        
        this._prevSearchText = this.fulltextValue;
        this.onReloadData.emit(this.table);
    }
}
