import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { Geofence } from '@ionic-native/geofence';

// Pages
import { HomePage } from '../pages/home-page/home-page';
import { PlacesPage } from '../pages/places/places';
import { HistoryPage } from '../pages/history/history';

// Platform services
import { PlatformService } from '../providers/platform-service';
import { PlatformData } from '../providers/platform-data';
import { PlatformGeolocation } from '../providers/platform-geolocation';
import { PlatformBeacons } from '../providers/platform-beacons';
import { PlatformApi } from '../providers/platform-api';
import { PlatformDevice } from '../providers/platform-device';
import { PlatformScenario } from '../providers/platform-scenario';

@Component({
  templateUrl: 'app.html',
  providers: [
    PlatformService,
    PlatformData,
    PlatformGeolocation,
    PlatformBeacons,
    PlatformApi,
    PlatformDevice,
    PlatformScenario
  ]
})

export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // make HomePage the root (or first) page
  rootPage: any = HomePage;
  pages: Array<{title: string, component: any}>;

  constructor(
    public platform: Platform,
    public menu: MenuController,
    public platformService: PlatformService, // Proximity Platform
    public platformScenario: PlatformScenario,
    public platformGeolocation: PlatformGeolocation,
    private geofence: Geofence,
    private statusBar: StatusBar
  ) {
    // Proximity Platform
    this.platformService = platformService;
    this.platformScenario = platformScenario;
    this.platformGeolocation = platformGeolocation;

    this.initializeApp();

    // set our app's pages
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'Places', component: PlacesPage },
      { title: 'History', component: HistoryPage }
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();

      // Listen for background geofence notifications
      // Android only
    	if (this.platform.is('android')) {
        this.geofence.onNotificationClicked()
        .subscribe(notificationData => {
          console.log('App opened from Geo Notification!', notificationData);

          // Get location and execute scenario
          this.platformGeolocation.getLocation()
          .then((location: any) => {
            this.platformScenario.executeScenario(notificationData.scenario);
          });
        });
      }

      // Proximity Platform
      this.platformService.init();
    });
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    // this.nav.setRoot(page.component);
    this.nav.push(page.component);
  }
}
