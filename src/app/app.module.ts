import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

//components as component
import { AppComponent } from './app.component';
//views
import { ShowcaseComponent } from './controllers/showcase.component';
import { AssistantComponent } from './controllers/assistant.component';
import { HomeComponent } from './controllers/home.component';
import { ErrorComponent } from './controllers/error.component';
import { AhpComponent } from './controllers/ahp.component';
import { DatabaseComponent } from './controllers/database.component';

//utils as pipes
import { DecimalPipe, PercentagePipe } from './utils/utils.pipe';
//nets as endpoints
import { EndpointService } from './nets/endpoint.service';

const appRoutes: Routes = [
  {
    path:'database',
    component: DatabaseComponent
  },
  {
    path:'ahp/:id',
    component: AhpComponent
  },
  {
    path: '', 
    component: HomeComponent
  },
  {
    path: '**', 
    component: ErrorComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent, ShowcaseComponent, AssistantComponent,
    AhpComponent, DatabaseComponent,
    ErrorComponent,
    DecimalPipe, PercentagePipe
  ],
  imports: [
    BrowserModule, FormsModule, HttpModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [ EndpointService ], //this thing here is injected
  bootstrap: [ AppComponent ] // this is the entry point
})
export class AppModule { }
