import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";

const routes: Routes = [
  {
    path: '',
    redirectTo: '/check-in',
    pathMatch: 'full'
  },
  {
    path: 'check-in',
    loadChildren: () => import('src/app/modules/check-in/check-in.module').then((m) => m.CheckInModule),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
