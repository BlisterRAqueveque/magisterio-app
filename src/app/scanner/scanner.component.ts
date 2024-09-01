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

export interface Data {
  id: number;
  nombre: string;
  casa_mutual: string;
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
  ],
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.scss'],
  providers: [DialogService, PopupService],
})
export class ScannerComponent {
  //REPOSITORY:
  //* https://github.com/capawesome-team/capacitor-mlkit/tree/main/packages/barcode-scanning

  visible = false;

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

  public ngOnInit(): void {
    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported;
    });

    BarcodeScanner.checkPermissions().then((result) => {
      this.isPermissionGranted = result.camera === 'granted';
    });
  }

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
    this.closeModal(barcodes[0]);
  }

  public async openSettings(): Promise<void> {
    await BarcodeScanner.openSettings();
  }

  public async requestPermissions(): Promise<void> {
    await BarcodeScanner.requestPermissions();
  }

  @ViewChild(IonModal) modal!: IonModal;

  onWillDismiss() {
    this.stopScan();
  }

  presentModal() {
    BarcodeScanner.isTorchAvailable().then((result) => {
      this.isTorchAvailable = result.available;

      this.modal.present();

      setTimeout(() => {
        this.startScan();
      }, 250);
    });
  }

  private readonly popup = inject(PopupService);
  //* Estado de la parcela, 0 desocupada, 1 ocupada
  status = 0;
  public async closeModal(barcode?: Barcode): Promise<void> {
    this.modal.dismiss();

    this.loader.present();
    if (barcode) {
      try {
        this.parcela = JSON.parse(barcode.rawValue);
        if (!this.parcela?.id) {
          this.parcela = null;
          this.popup.present('El QR escaneado no es válido.', 'warning', 1500);
        }
        this.status = await this.checkStatus(this.parcela!.id);

        console.log('PARCELA', this.status);
      } catch (err) {
        console.log('PARCELA', JSON.stringify(err));
        this.parcela = null;
        this.popup.present('El QR escaneado no es válido.', 'warning', 1500);
      }
    }
    this.loader.dismiss();
  }

  //* Torch ---------------------------------------------------------------->
  public isTorchAvailable = false;
  public async toggleTorch(): Promise<void> {
    await BarcodeScanner.toggleTorch();
  }
  //* Torch ---------------------------------------------------------------->

  //* Camera Zoom ---------------------------------------------------------->
  public minZoomRatio: number | undefined;
  public maxZoomRatio: number | undefined;

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

  private readonly loader = inject(LoaderService);
  async checkStatus(id: number) {
    return await firstValueFrom(this.service.checkStatus(id));
  }
}
