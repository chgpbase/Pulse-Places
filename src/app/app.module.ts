import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

// Ionic Native
import { StatusBar } from '@ionic-native/status-bar';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { SafariViewController } from '@ionic-native/safari-view-controller';
import { Geofence } from '@ionic-native/geofence';
import { IBeacon } from '@ionic-native/ibeacon';
import { Device } from '@ionic-native/device';
import { Geolocation } from '@ionic-native/geolocation';

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
    GlobalVars,
    StatusBar,
    BarcodeScanner,
    LocalNotifications,
    SafariViewController,
    Geofence,
    IBeacon,
    Device,
    Geolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
