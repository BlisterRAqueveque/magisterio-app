import { Component, HostListener } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    //? Get the clicked element
    const clickedElement = event.target as HTMLElement;
    //? If it's a button, then:
    if (clickedElement.classList.contains('ripple-effect')) {
      //? Creates a span element inside
      let ripple = document.createElement('span');
      ripple.classList.add('ripple');
      //* ---------->
      clickedElement.appendChild(ripple);
      //? Get the element position & the pointer as well
      let rect = clickedElement.getBoundingClientRect();
      let x = event.clientX - rect.left;
      let y = event.clientY - rect.top;
      //? Position the span element
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;

      //? At least, remove span after 0.3s
      setTimeout(() => {
        ripple.remove();
      }, 300);
    }
  }

  @HostListener('scroll', ['$event'])
  onScroll(event: Event) {
    const element = event.target as HTMLElement;
    const scrollTop = element.scrollTop;
    console.log('Posición de desplazamiento:', scrollTop);
  }
}
