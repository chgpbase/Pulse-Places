import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular/index';

import { PlatformData } from '../../providers/platform-data';
import { PlatformApi } from '../../providers/platform-api';
import { PlatformScenario } from '../../providers/platform-scenario';

@Component({
  selector: 'page-places',
  templateUrl: 'places.html'
})
export class PlacesPage {

  selectedItem: any;
  items: Array<{id: number, title: string, url: string, icon: string}>;

  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public alertController: AlertController,
    public navParams: NavParams,
    public PlatformData: PlatformData,
    public platformApi: PlatformApi,
    public platformScenario: PlatformScenario
  )
  {
    this.navCtrl = navCtrl;
    this.platformApi = platformApi;
    this.platformScenario = platformScenario;
    this.PlatformData = PlatformData;

    this.loadPlaces();
  }

  loadPlaces() {
    this.items = [];

    this.PlatformData.getPlaces()
    .then((places) => {
      if(Object.keys(places).length) {
        for(let i = 0; i < Object.keys(places).length; i++) {
          this.items.push({
            id: places[i].id,
            title: places[i].name,
            url: places[i].url,
            icon: places[i].icon
          });
        }
      }
    });
  }

  openPlace(event, item) {
    console.log('openPlace');
    console.log(item.url);

    let loading = this.loadingCtrl.create({
      content: 'Opening...'
    });

    loading.present();

    console.log('We\'re going to do a handshake for ' + item.url + '!');

    this.platformApi.postHandshake(item.url)
    .then((response: any) => {
      loading.dismiss();
      console.log(response);
      // Check if web content was found
      if (response !== false) {
        console.log('url found: ' + response.web_url);
        this.platformScenario.openWebView(response.web_url);
      } else {
        console.log('Place not found, maybe it\'s deleted by the creator.');
        this.alertController.create({
          title: "Place not found",
          subTitle: "Place not found, maybe it has been deleted.",
          buttons: ['Close']
        })
        .present();
      }
    }, (err) => {
      loading.dismiss();

      this.alertController.create({
        title: "Enter Code",
        subTitle: err,
        buttons: ['Dismiss']
      }).present();

      console.log('Something went wrong: ' + err);
    });
  }

  deletePlace(event, item) {
    console.log('deletePlace');
    console.log(item.id);

    let alert = this.alertController.create({
      title: 'Confirm delete',
      message: 'Do you want to delete this place?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Delete',
          handler: () => {
            this.PlatformData.deletePlace(item.id)
            .then(() => {
              this.loadPlaces();
            });
          }
        }
      ]
    });
    alert.present();
  }

  ionViewDidLoad() {
    console.log('Hello Hotspots Page');
  }
}
