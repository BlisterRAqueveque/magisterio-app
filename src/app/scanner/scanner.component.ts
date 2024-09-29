import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  inject,
  NgZone,
  ViewChild,
} from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import {
  Barcode,
  BarcodeFormat,
  BarcodeScanner,
  LensFacing,
  StartScanOptions,
} from '@capacitor-mlkit/barcode-scanning';
import { FilePicker } from '@capawesome/capacitor-file-picker';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonModal,
  IonRange,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { close, flashlight, image } from 'ionicons/icons';
import { firstValueFrom } from 'rxjs';
import { DialogService } from '../components/confirm-dialog/dialog.service';
import { ModalParcelasComponent } from '../components/modal-parcelas/modal-parcelas.component';
import { PopupService } from '../components/popup/popup.service';
import { IngresosService } from '../service/ingresos.service';
import { LoaderService } from '../components/loader/loader.service';
import { PinchZoomComponent, PinchZoomModule } from '@meddv/ngx-pinch-zoom';
import { InputComponent } from '../components/input/input.component';
import { ParcelasService } from '../service/parcelas.service';

export interface Data {
  id: number;
  nombre?: string;
  casa_mutual?: string;
}

@Component({
  standalone: true,
  imports: [
    IonRange,
    IonFabButton,
    IonIcon,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonCard,
    IonRow,
    IonItem,
    IonLabel,
    IonSelectOption,
    IonCardContent,
    IonCardHeader,
    IonSelect,
    IonCardTitle,
    IonCol,
    IonFab,
    IonButton,
    IonInput,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonModal,
    ModalParcelasComponent,
    PinchZoomModule,
    InputComponent,
  ],
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.scss'],
  providers: [DialogService, PopupService],
})
export class ScannerComponent {
  //REPOSITORY:
  //* https://github.com/capawesome-team/capacitor-mlkit/tree/main/packages/barcode-scanning

  // Muestra el dialogo
  visible = false;
  // Muestra el panel para introducir manualmente
  show = false;

  public readonly barcodeFormat = BarcodeFormat;
  public readonly lensFacing = LensFacing;

  public formGroup = new UntypedFormGroup({
    formats: new UntypedFormControl([]),
    lensFacing: new UntypedFormControl(LensFacing.Back), // FRONT CAMERA || BACK CAMERA
  });

  public barcodes: Barcode[] = [];
  public isSupported = false;
  public isPermissionGranted = false;

  private readonly ngZone = inject(NgZone);
  private readonly service = inject(IngresosService);

  constructor() {
    addIcons({ close, image, flashlight });
  }

  /**
   * Chequeamos que los permisos estén permitidos para un dispositivo móvil
   */
  public ngOnInit(): void {
    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported;
    });

    BarcodeScanner.checkPermissions().then((result) => {
      this.isPermissionGranted = result.camera === 'granted';
    });
  }

  /**
   * Leemos el barcode desde una imagen
   */
  public async readBarcodeFromImage(): Promise<void> {
    const { files } = await FilePicker.pickImages({ limit: 1 });
    const path = files[0]?.path;
    if (!path) {
      return;
    }
    const formats = this.formGroup.get('formats')?.value || [];
    const { barcodes } = await BarcodeScanner.readBarcodesFromImage({
      path,
      formats,
    });
    //* Mandamos el barcode a esta fx()
    this.closeModal(barcodes[0]);
  }

  /**
   * Abre la configuración del dispositivo
   */
  public async openSettings(): Promise<void> {
    await BarcodeScanner.openSettings();
  }
  /**
   * Solicita los permisos necesarios
   */
  public async requestPermissions(): Promise<void> {
    await BarcodeScanner.requestPermissions();
  }

  //* Instancia del modal
  @ViewChild(IonModal) modal!: IonModal;

  /**
   * Al destruirse el modal, se detiene el core del escáner
   */
  onWillDismiss() {
    this.stopScan();
  }

  /**
   * Presenta el modal del escáner
   */
  presentModal() {
    BarcodeScanner.isTorchAvailable().then((result) => {
      //* Permiso para la linterna
      this.isTorchAvailable = result.available;

      this.modal.present();

      //* Esperamos a que se presente el modal para mostrar el escáner
      setTimeout(() => {
        this.startScan();
      }, 250);
    });
  }

  //* Habilita el popup (modo servicio como inserción en el body principal)
  private readonly popup = inject(PopupService);
  //* Servicios de parcela
  private readonly parcelaService = inject(ParcelasService);

  //* Estado de la parcela, 0 desocupada, 1 ocupada
  //* Muestra los campos para marcar ingreso, salida
  status = 0;

  /**
   * @description Cierra el modal de escaneo de qr, realiza las consultas para ver la disponibilidad de la parcela
   * o, en su defecto, para obtener la parcela (introducción manual) y devolver el estado
   * @param barcode Código qr, el resultado del escaneo
   * @param id Id introducido manualmente
   */
  public async closeModal(barcode?: Barcode, id?: number): Promise<void> {
    this.modal.dismiss();

    this.loader.present();

    if (barcode) {
      try {
        //* Obtenemos los valores del barcode
        this.parcela = JSON.parse(barcode.rawValue);
        //! Si no existe
        if (!this.parcela?.id) {
          this.parcela = null;
          this.popup.present('El QR escaneado no es válido.', 'warning', 1500);
        }
        //* Chequeamos el status
        this.status = await this.checkStatus(this.parcela!.id);
      } catch (err) {
        //! Caso de errores
        this.parcela = null;
        this.popup.present('El QR escaneado no es válido.', 'warning', 1500);
      }
    } else if (id) {
      try {
        //* Consultamos por la parcela
        const parcela = await firstValueFrom(this.parcelaService.getOne(id));
        //* Armamos el objeto
        this.parcela = {
          id,
          nombre: parcela.nombre,
          casa_mutual: parcela.casa_mutual
            ? parcela.casa_mutual.nombre
            : 'Sin definir',
        };
        //* Chequeamos el status
        this.status = await this.checkStatus(id);
      } catch (err) {
        //* Caso de error o que no exista la parcela
        this.popup.present('La parcela ingresada no existe.', 'warning', 1500);
        this.parcela = null;
      }
    }
    this.loader.dismiss();
  }

  //* Torch ---------------------------------------------------------------->
  /**
   * Prende o apaga la linterna
   */
  public isTorchAvailable = false;
  public async toggleTorch(): Promise<void> {
    await BarcodeScanner.toggleTorch();
  }
  //* Torch ---------------------------------------------------------------->

  //* Camera Zoom ---------------------------------------------------------->
  public minZoomRatio: number | undefined;
  public maxZoomRatio: number | undefined;
  /**
   * Realiza zoom de la cámara
   * TODO Ver la razón por la que no se renderiza al abrir el modal
   */
  public setZoomRatio(event: any): void {
    if (!event.detail.value) {
      return;
    }
    BarcodeScanner.setZoomRatio({
      zoomRatio: parseInt(event.detail.value as any, 10),
    });
  }
  //* Camera Zoom ---------------------------------------------------------->

  @ViewChild('square')
  public squareElement: ElementRef<HTMLDivElement> | undefined;

  public lensFacing2: LensFacing = LensFacing.Back;
  public formats: BarcodeFormat[] = [BarcodeFormat.QrCode];

  /**
   * Inicializamos el servicio de escaneo, creamos el "cuadrado" central de donde se va a tomar el qr.
   * Devuelve el resultado del escaneo
   */
  private async startScan(): Promise<void> {
    // Hide everything behind the modal (see `src/theme/variables.scss`)
    document.querySelector('body')?.classList.add('barcode-scanning-active');

    const options: StartScanOptions = {
      formats: this.formats,
      lensFacing: this.lensFacing2,
    };

    const squareElementBoundingClientRect =
      this.squareElement?.nativeElement.getBoundingClientRect();
    const scaledRect = squareElementBoundingClientRect
      ? {
          left: squareElementBoundingClientRect.left * window.devicePixelRatio,
          right:
            squareElementBoundingClientRect.right * window.devicePixelRatio,
          top: squareElementBoundingClientRect.top * window.devicePixelRatio,
          bottom:
            squareElementBoundingClientRect.bottom * window.devicePixelRatio,
          width:
            squareElementBoundingClientRect.width * window.devicePixelRatio,
          height:
            squareElementBoundingClientRect.height * window.devicePixelRatio,
        }
      : undefined;
    const detectionCornerPoints = scaledRect
      ? [
          [scaledRect.left, scaledRect.top],
          [scaledRect.left + scaledRect.width, scaledRect.top],
          [
            scaledRect.left + scaledRect.width,
            scaledRect.top + scaledRect.height,
          ],
          [scaledRect.left, scaledRect.top + scaledRect.height],
        ]
      : undefined;
    const listener = await BarcodeScanner.addListener(
      'barcodeScanned',
      async (event) => {
        this.ngZone.run(() => {
          const cornerPoints = event.barcode.cornerPoints;
          if (detectionCornerPoints && cornerPoints) {
            if (
              detectionCornerPoints[0][0] > cornerPoints[0][0] ||
              detectionCornerPoints[0][1] > cornerPoints[0][1] ||
              detectionCornerPoints[1][0] < cornerPoints[1][0] ||
              detectionCornerPoints[1][1] > cornerPoints[1][1] ||
              detectionCornerPoints[2][0] < cornerPoints[2][0] ||
              detectionCornerPoints[2][1] < cornerPoints[2][1] ||
              detectionCornerPoints[3][0] > cornerPoints[3][0] ||
              detectionCornerPoints[3][1] < cornerPoints[3][1]
            ) {
              return;
            }
          }
          listener.remove();
          this.closeModal(event.barcode);
        });
      }
    );
    await BarcodeScanner.startScan(options);
    void BarcodeScanner.getMinZoomRatio().then((result) => {
      this.minZoomRatio = result.zoomRatio;
    });
    void BarcodeScanner.getMaxZoomRatio().then((result) => {
      this.maxZoomRatio = result.zoomRatio;
    });
  }
  /**
   * Detiene el escáner
   */
  private async stopScan(): Promise<void> {
    // Show everything behind the modal again
    document.querySelector('body')?.classList.remove('barcode-scanning-active');

    await BarcodeScanner.stopScan();
  }

  parcela!: Data | null;
  nombre(jsonString: string) {
    this.parcela = JSON.parse(jsonString);
    return this.parcela;
  }

  /**
   * Chequea el status de la parcela, si tiene ingreso o no
   */
  private readonly loader = inject(LoaderService);
  async checkStatus(id: number) {
    return await firstValueFrom(this.service.checkStatus(id));
  }
}
