import { Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'mw-processing',
  styleUrls: [ './style.css' ],
  templateUrl: './view.html'
})


export class ProcessingComponent implements OnInit { 
      
    @Input() inProgress: boolean = false;
    @Input() label: string;
    
    
    constructor() { 
        this.label = "Aktualizuji data...";
    }
     
    ngOnInit(): void {
               
    }    
    
        
}