import { PublicacionesComponent } from './components/publicaciones/publicaciones.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegistroComponent } from './components/registro/registro.component';
import { VerPerfilComponent } from './components/ver-perfil/ver-perfil.component';
import { ChatfriendsComponent } from './components/chatfriends/chatfriends.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'registro',
    component: RegistroComponent
  },
  {
    component: PublicacionesComponent
  },
  {
    path: 'verPerfil',
    component: VerPerfilComponent
    path: 'publicaciones',
  },
  {
    path:'chatandfriends',
    component:ChatfriendsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
