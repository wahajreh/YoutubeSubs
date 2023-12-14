import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from './components/user-list/user-list.component';
import { RegisterComponent } from './components/register/register.component';

const routes: Routes = [
  { path: 'channels', component: UserListComponent },
  { path: 'register', component: RegisterComponent },
  // Add more routes if needed
  { path: '', redirectTo: '/register', pathMatch: 'full' }, // Default route
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
