import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ListComponent } from './list/list.component';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { AddbdComponent } from './addbd/addbd.component';
import { AddanvComponent } from './addanv/addanv.component';
import { AddxmasComponent } from './addxmas/addxmas.component';
import { ContactsComponent } from './contacts/contacts.component';

const routes: Routes = [
  {path: 'home', component: HomeComponent, children: [
    {path: 'welcome', component: WelcomeComponent},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'dashboard', component: DashboardComponent},
    {path: 'list', component: ListComponent, children: [
      {path: 'contacts', component: ContactsComponent},
      {path: 'add', component: AddComponent},
      {path: 'edit', component: EditComponent},
      {path: 'addbd', component: AddbdComponent},
      {path: 'addanv', component: AddanvComponent},
      {path: 'addxmas', component: AddxmasComponent}
    ]}
  ]},
  {path: '', component: HomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
