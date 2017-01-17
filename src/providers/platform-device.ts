import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { Device } from 'ionic-native';

// Global vars
import { GlobalVars } from '../providers/global-vars';

@Injectable()
export class PlatformDevice {

  constructor(
    public http: Http,
    public globalVars: GlobalVars
  ) {
  }

  /*
   * Get device info and save to global settings
   */
  getDevice() {
    return new Promise((resolve, reject) => {
      let device = Device;
      this.globalVars.setDevice(device);
      resolve(device);
    });
  }
}
