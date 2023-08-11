import { Injectable }    from '@angular/core';
import { Subject }    from 'rxjs';

@Injectable()
export class AppService {
  
  private confirmedChild = new Subject<any>();
  confirmedChild$ = this.confirmedChild.asObservable();
  
  
  //doslo ke zmene potomka
  confirmChildChanged(child: any) {
    this.confirmedChild.next(child);    
  }
  
  
}
