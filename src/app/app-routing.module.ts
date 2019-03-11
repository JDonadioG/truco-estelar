import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'add', loadChildren: './add/add.module#AddPageModule' },
  { path: 'user', loadChildren: './user/user.module#UserPageModule' },
  { path: 'game', loadChildren: './game/game.module#GamePageModule' },
  { path: 'points', loadChildren: './points/points.module#PointsPageModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
