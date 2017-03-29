import { Component } from '@angular/core';
import { Platform, NavController, AlertController, LoadingController } from 'ionic-angular/index';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

import { PlacesPage } from '../places/places';
import { HistoryPage } from '../history/history';

import { PlatformData } from '../../providers/platform-data';
import { PlatformApi } from '../../providers/platform-api';
import { PlatformScenario } from '../../providers/platform-scenario';

@Component({
  selector: 'page-home-page',
  templateUrl: 'home-page.html'
})

export class HomePage {

  headerSliderOptions = {
    pager: false,
    loop: true
  };

  slides:  Array<{title: string, clickEvent: any, slide: string}>;
  homeButtons: Array<{title: string, clickEvent: any, icon: string}>;

  constructor(
    private barcodeScanner: BarcodeScanner,
    public navCtrl: NavController,
    public platform: Platform,
    public loadingCtrl: LoadingController,
    public alertController: AlertController,
    public platformData: PlatformData,
    public platformApi: PlatformApi,
    public platformScenario: PlatformScenario
  ) {
    //this.navCtrl = navCtrl;
    //this.platformApi = platformApi;
    //this.platformScenario = platformScenario;
    //this.platformData = platformData;

    // Update slider when platform is ready
    this.platform.ready().then(() => {
      var that = this;
      setTimeout(function() {
        that.updateSlider();
      }, 1000);
    });

    // set homepage button blocks
    this.homeButtons = [
      { title: 'Scan QR', clickEvent: this.scanQr, icon: 'assets/images/icons/scan.svg' },
      { title: 'Enter Code', clickEvent: this.enterCode, icon: 'assets/images/icons/keyboard.svg' },
      { title: 'Places', clickEvent: this.openPlaces, icon: 'assets/images/icons/place.svg' },
      { title: 'History', clickEvent: this.openHistory, icon: 'assets/images/icons/history.svg' }
    ];
  }

  clickEventHandler(homeBtn: any){
    //debugger;
    if(typeof homeBtn.clickEvent == 'function') {
      homeBtn.clickEvent(this);
    }
  }

  updateSlider() {
    this.slides = [];

    this.platformData.initDb()
    .then((db) => {
      this.platformData.getSlides()
      .then((slides) => {
        if(Object.keys(slides).length) {
          for(let i = 0; i < Object.keys(slides).length; i++) {
            this.slides.push({
              title: '',
              clickEvent: HomePage,
              slide: slides[i].header
            });
          }
        }

        // Default slide
        this.slides.push({
          title: '',
          clickEvent: HomePage,
          slide: 'assets/images/home/slide.png'
        });

      });
    })
  }

  scanQr(event) {
    event.barcodeScanner.scan().then((barcodeData) => {
     // Success! Barcode data is here
     console.log(barcodeData);

     if (barcodeData.text != '') {
       let loading = event.loadingCtrl.create({
         content: 'Verifying QR'
       });

      loading.present();

      console.log('We\'re going to do a handshake for ' + barcodeData.text + '!');

       event.platformApi.postHandshake(barcodeData.text)
       .then((response: any) => {
         loading.dismiss();
         console.log(response);
         // Check if web content was found
         if (response !== false) {
           console.log('url found: ' + response.web_url);
           event.updateSlider();
           event.platformScenario.openWebView(response.web_url);
         } else {
           console.log('No content found for code!');
           event.alertController.create({
             subTitle: "Code not recognized.",
             buttons: ['Close']
           })
           .present();
         }
       }, (err) => {
         loading.dismiss();

         event.alertController.create({
           subTitle: err,
           buttons: ['Close']
         }).present();

         console.log('Something went wrong: ' + err);
       });
      }
    }, (err) => {
        // An error occurred
    });
  }

  enterCode(event) {

    let alert = event.alertController.create({
      title: "Enter Code",
      inputs: [
        {
          name: "code",
          placeholder: "Code"
        }
      ],
      buttons: [
        {
          text: "Cancel"
        },
        {
          text: "Go",
          handler: data => {
            if (data.code != '') {
              let loading = event.loadingCtrl.create({
                content: 'Verifying code'
              });

              loading.present();

              console.log('We\'re going to do a handshake for ' + data.code + '!');

              event.platformApi.postHandshake(data.code)
              .then((response: any) => {
                loading.dismiss();
                console.log(response);
                // Check if web content was found
                if (response !== false) {
                  console.log('url found: ' + response.web_url);
                  event.updateSlider();
                  event.platformScenario.openWebView(response.web_url);
                } else {
                  console.log('No content found for code!');
                  event.alertController.create({
                    subTitle: "Code not recognized.",
                    buttons: ['Close']
                  })
                  .present();
                }
              }, (err) => {
                loading.dismiss();

                event.alertController.create({
                  subTitle: err,
                  buttons: ['Close']
                }).present();

                console.log('Something went wrong: ' + err);
              });
            }
          }
        }
      ]
    });
    alert.present();
  }

  openPlaces(event) {
    event.navCtrl.push(PlacesPage);
  }

  openHistory(event) {
    event.navCtrl.push(HistoryPage);
  }

  ionViewDidLoad() {
    console.log('Hello HomePage Page');
  }
}
