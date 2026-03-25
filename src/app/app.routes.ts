import { Routes } from '@angular/router';
import { IndexComponent } from './components/index/index.component';
import { PrivacyPolicyComponent } from './components/privacy-polic/privacy-policy.component';
import { GuideDownloadPageComponent } from './components/guide-download-page/guide-download-page.component';

export const routes: Routes = [
  {
    path: '',
    component: IndexComponent
  },
  {
    path: 'politica-privacidad',
    component: PrivacyPolicyComponent
  },
  {
    path: 'guia/:id',
    component: GuideDownloadPageComponent
  }
];