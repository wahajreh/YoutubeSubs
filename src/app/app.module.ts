import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import { UserListComponent } from './components/user-list/user-list.component';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { UserDetailComponent } from './components/user-detail/user-detail.component';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './components/login/login.component'; // Import HttpClientModule


const routes: Routes = [
  { path: 'channels', component: UserListComponent },
  { path: 'channelsDetail', component: UserDetailComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component:LoginComponent },
  // Add more routes if needed
  { path: '', redirectTo: '/register', pathMatch: 'full' }, // Default route
];

@NgModule({
  declarations: [
    AppComponent,
    UserListComponent,
    RegisterComponent,
    UserDetailComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),FormsModule,ReactiveFormsModule,HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
