import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule }    from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';
import { AngularFireModule } from 'angularfire2'
import { AngularFireDatabaseModule} from 'angularfire2/database'
import {environment} from "../environments/environment";

import { AppComponent } from './app.component';
import {ModuleOne} from './modules/module.one';
import {ModuleTwo} from './modules/module.two';
import {ModuleD3} from './modules/d3/module.d3';
import {EntityComponent} from './components/entity.component';


const routes: Routes = [
  {path: 'Module1', component: ModuleOne },
  {path: 'Module2', component: ModuleTwo },
  {path: 'ModuleD3', component: ModuleD3}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

@NgModule({
  declarations: [
    AppComponent,
    EntityComponent,
    ModuleOne,
    ModuleTwo,
    ModuleD3
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase, "cama"),
    AngularFireDatabaseModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule {
}