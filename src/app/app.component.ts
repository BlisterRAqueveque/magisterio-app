import { Location } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import { App } from '@capacitor/app';
import { Platform } from '@ionic/angular';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { AlertService } from './service/alert.service';

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

  ngOnInit() {
    this.configureBackButton();
  }

  //! BACK BUTTON --------------------------------------------------------------------------------------->
  private readonly location = inject(Location);
  private readonly alert = inject(AlertService);
  private readonly platform = inject(Platform);

  /**
   * @description
   * Configuramos el back button de la app.
   */
  configureBackButton() {
    this.platform.backButton.subscribeWithPriority(10, async () => {
      //* La URL donde se encuentra el usuario
      const currentUrl = window.location.pathname;
      console.log('CURRENT URL', currentUrl);
      if (currentUrl === '/home') {
        //* Si está en el dashboard, sale de la app
        await this.exitApp();
      } else {
        //* Caso contrario a los anteriores, regresa atrás en el histórico
        this.location.back();
      }
    });
  }

  async exitApp() {
    await this.alert.presentAlert(
      'Saliendo',
      '¿Desea salir de la aplicación?',
      '',
      () => {
        App.exitApp();
      }
    );
  }
  //! BACK BUTTON --------------------------------------------------------------------------------------->
}
