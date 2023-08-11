import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[adHost]',
})
export class AdHostDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}

