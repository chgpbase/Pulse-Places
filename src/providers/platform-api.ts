import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

import * as AppConfig from '../appConfig';

// Global vars
import { GlobalVars } from '../providers/global-vars';

// Platform services
import { PlatformData } from './platform-data';
import { PlatformGeolocation } from './platform-geolocation';
import { PlatformBeacons } from './platform-beacons';

@Injectable()
export class PlatformApi {

  constructor(
    public http: Http,
    public globalVars: GlobalVars,
    public platformData: PlatformData,
    public platformGeolocation: PlatformGeolocation,
    public platformBeacons: PlatformBeacons
  ) {
    this.globalVars = globalVars;
    this.platformData = platformData;
    this.platformGeolocation = platformGeolocation;
    this.platformBeacons = platformBeacons;
  }

  /*
   * Post url/code to web API
   */
  postHandshake(url: string) {
    return new Promise((resolve, reject) => {
      // Get current location
      this.platformGeolocation.getLocation()
      .then((location: any) => {
        // Check for querystring to add additional information
        let hasQsChars = new RegExp("[?&]");
        let querystring;
        let postUrl = url;
        let isUrl = true;

        if (hasQsChars.test(url)) {
          querystring = '&src=app&lat=' + location.latitude + '&lng=' + location.longitude;
        } else {
          querystring = '?src=app&lat=' + location.latitude + '&lng=' + location.longitude;
        }

        // Parse input, starts with http ?
        if (url.slice(0, 7) != "http://" && url.slice(0, 8) != "https://") {
          // Check for dot (.) to see if it's a code or url
          var hasDot = new RegExp("[.]");
          if (hasDot.test(url)) {
            postUrl = 'http://' + url + querystring;
          } else { // It's a code, not a url
            isUrl = false;
          }
        }

        let headers = new Headers({
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        });

        let options = new RequestOptions({
          headers: headers
        });

        // Get device info from global vars
        let device = this.globalVars.getDevice();

        let params = {
          url: postUrl,
          lat: location.latitude,
          lng: location.longitude,
          uuid: device.uuid,
          model: device.model,
          platform: device.platform
        };

        let str = [];

        for (var k in params) {
          str.push(encodeURIComponent(k) + "=" + encodeURIComponent(params[k]));
        }

        let body = str.join("&");

        return this.http.post(AppConfig.data.platform_url + '/api/v1/remote/handshake', body, options)
        .map(res => res.json())
        .subscribe(
          response => {
            // Url is recognized, save app + load scenario board
            let web_url = url;

            if (response.content.found) {
              // Set icon if not found
              if (response.content.icon == null) response.content.icon = 'assets/images/place-icons/globe.png';

              web_url = response.content.url;
              web_url += querystring;

              let resolve_data = {
                web_found: response.content.found,
                web_is_url: isUrl,
                web_url: web_url,
                web_name: response.content.name,
                web_icon: response.content.icon
              };

              // Check if url exists and insert if not
              let data = {
                url: response.content.url,
                name: response.content.name,
                type: response.content.type,
                icon: response.content.icon,
                header: response.content.header,
                json: response
              };

              this.platformData.insertOrUpdateBookmark(data)
              .then((response: any) => {
                // Parse api
                return this.platformData.parseApi(response.data, response.bookmark_id);
              })
              // Subscribe to beacons and geofences
              .then((subscriptions: any) => {
                console.log('before platformBeacons.subscribeToBeacons');

                this.platformBeacons.subscribeToBeacons(subscriptions.beaconsToSubscribe)
                .then(() => {
                  console.log('platformBeacons.subscribeToBeacons');
                  return this.platformGeolocation.subscribeToGeofences(subscriptions.geofencesToSubscribe);
                })
                .then(() => {
                  // Ready
                  console.log('Ready postHandshake!');
                  resolve(resolve_data);
                });
              })
            } else {
              resolve(false);
            }
          },
          err => { reject('Could not connect to server, check your internet connection and try again.') }
        );
      });
    }) // End get current location
  }
}
