import {
  ApplicationRef,
  ComponentFactoryResolver,
  ComponentRef,
  EmbeddedViewRef,
  Injectable,
  Injector,
  inject,
} from '@angular/core';
import { PopupComponent, Severity } from './popup.component';

@Injectable()
export class PopupService {
  private componentFactoryResolver = inject(ComponentFactoryResolver);
  private appRef = inject(ApplicationRef);
  private injector = inject(Injector);

  private componentRef!: ComponentRef<unknown>;

  present(message: string, severity: Severity, duration: number) {
    // 1. Create a component reference from the component
    this.componentRef = this.componentFactoryResolver
      .resolveComponentFactory(PopupComponent)
      .create(this.injector);

    //Instancias del componente
    //(this.componentRef.instance as any).src = src;
    (this.componentRef.instance as PopupComponent).severity = severity;
    (this.componentRef.instance as PopupComponent).message = message;
    (this.componentRef.instance as PopupComponent).duration = duration;

    // 2. Attach component to the appRef so that it's inside the ng component tree
    this.appRef.attachView(this.componentRef.hostView);

    // 3. Get DOM element from component
    const domElem = (this.componentRef.hostView as EmbeddedViewRef<any>)
      .rootNodes[0] as HTMLElement;

    // 4. Append DOM element to the body
    document.body.appendChild(domElem);
  }

  dismiss() {
    this.appRef.detachView(this.componentRef.hostView);
    this.componentRef.destroy();
  }
}
