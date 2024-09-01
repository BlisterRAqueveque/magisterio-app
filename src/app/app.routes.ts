import { Routes } from '@angular/router';
import { ScannerComponent } from './scanner/scanner.component';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'scanner',
    component: ScannerComponent,
  },
];
