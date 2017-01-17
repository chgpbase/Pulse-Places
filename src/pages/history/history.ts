import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

// Platform services
import { PlatformData } from '../../providers/platform-data';
import { PlatformScenario } from '../../providers/platform-scenario';

@Component({
  selector: 'page-history',
  templateUrl: 'history.html'
})
export class HistoryPage {

  selectedItem: any;
  items: Array<{title: string, url: string, icon: string}>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public PlatformData: PlatformData,
    public platformScenario: PlatformScenario
  )
  {
    this.platformScenario = platformScenario;
    this.PlatformData = PlatformData;

    this.items = [];

    this.PlatformData.getHistory()
    .then((history) => {
      if(Object.keys(history).length) {
        for(let i = 0; i < Object.keys(history).length; i++) {

          let url = this.platformScenario.parseUrlFromScenario(history[i].scenario);

          let title = '';

          switch(history[i].scenario_if_id){
            case 1: title = 'Entered region of ' + history[i].identifier; break;
            case 2: title = 'Exited region of ' + history[i].identifier; break;
            case 3: title = 'Came in range of ' + history[i].identifier; break;
            case 4: title = 'Came near ' + history[i].identifier; break;
            case 5: title = 'Came close to ' + history[i].identifier; break;
          }

          this.items.push({
            title: title,
            url: url,
            icon: history[i].icon
          });
        }
      }
    });
  }

  openHistory(event, item) {
    console.log('openHistory');
    this.platformScenario.openWebView(item.url);
  }

  ionViewDidLoad() {
    console.log('Hello History Page');
  }

}
