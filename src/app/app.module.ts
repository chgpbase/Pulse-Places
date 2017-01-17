import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';

// Global vars
import { GlobalVars } from '../providers/global-vars';

// Pages
import { HomePage } from '../pages/home-page/home-page';
import { PlacesPage } from '../pages/places/places';
import { HistoryPage } from '../pages/history/history';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    PlacesPage,
    HistoryPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    PlacesPage,
    HistoryPage
  ],
  providers: [
    GlobalVars
  ]
})
export class AppModule {}
