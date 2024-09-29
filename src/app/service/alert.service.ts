import { inject, Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular/standalone';

@Injectable({ providedIn: 'root' })
export class AlertService {
  private readonly alertController = inject(AlertController);

  async presentAlert(
    header: string,
    subHeader: string,
    message: string,
    fx?: Function
  ) {
    const alert = await this.alertController.create({
      header,
      subHeader,
      message,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Confirmar',
          cssClass: 'cancel-btn',
          handler: () => {
            if (fx) fx();
          },
        },
      ],
    });

    await alert.present();
  }
}
