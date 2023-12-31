import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { environment as env } from 'src/environments/environment';
import { redirectUnauthorizedTo, redirectLoggedInTo, AuthGuard } from '@angular/fire/auth-guard';

const toLogin = () => redirectUnauthorizedTo(['/login']);
const toHome = () => redirectLoggedInTo(['/home']);

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    title: `${env.appName} - Home`,
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'contact',
    title: `${env.appName} - Faça Contato`,
    loadChildren: () => import('./pages/contact/contact.module').then(m => m.ContactPageModule)
  },
  {
    path: 'about',
    title: `${env.appName} - Sobre`,
    loadChildren: () => import('./pages/about/about.module').then(m => m.AboutPageModule)
  },
  {
    path: 'policies',
    title: `${env.appName}`,
    loadChildren: () => import('./pages/policies/policies.module').then(m => m.PoliciesPageModule)
  },
  {
    path: 'login',
    title: `${env.appName} - Entrar`,
    loadChildren: () => import('./user/login/login.module').then(m => m.LoginPageModule),
    canActivate: [AuthGuard],
    data: { authGuardPipe: toHome }
  },
  {
    path: 'profile',
    title: `${env.appName} - Perfil`,
    loadChildren: () => import('./user/profile/profile.module').then(m => m.ProfilePageModule),
    canActivate: [AuthGuard],
    data: { authGuardPipe: toLogin }
  },
  {
    path: 'view',
    title: `${env.appName} - Visualização`,
    loadChildren: () => import('./pages/view/view.module').then(m => m.ViewPageModule)
  },
  {
    path: 'gps',
    title: 'TEMP - GPS',
    loadChildren: () => import('./temp/gps/gps.module').then(m => m.GpsPageModule)
  },
  {
    path: 'listAll',
    title: 'TEMP - LIST ALL',
    loadChildren: () => import('./temp/listall/listall.module').then(m => m.ListallPageModule)
  },
  {
    path: 'camera',
    title: `${env.appName} - Tirar Foto`,
    loadChildren: () => import('./pages/camera/camera.module').then(m => m.CameraPageModule)
  },
  {
    path: 'addDoc',
    title: `${env.appName} - Novo Documento`,
    loadChildren: () => import('./pages/addDoc/addDoc.module').then(m => m.AddDocPageModule),
    canActivate: [AuthGuard],
    data: { authGuardPipe: toLogin }
  },
  {
    path: 'edit',
    title: `${env.appName} - Editar Documento`,
    loadChildren: () => import('./pages/edit/edit.module').then(m => m.EditPageModule),
    canActivate: [AuthGuard],
    data: { authGuardPipe: toLogin }
  },
  {
    path: '404',
    title: `${env.appName} - Error 404`,
    loadChildren: () => import('./pages/e404/e404.module').then(m => m.E404PageModule)
  },
  {
    path: '**',
    redirectTo: '/404',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
