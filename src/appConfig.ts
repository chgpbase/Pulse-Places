export let data = {
  /*
   * ---------------------------------------------------
   * The Proximity Platform API endpoint
   * ---------------------------------------------------
   */

  "platform_url" : "https://pulse.nowsquare.com",

  /*
   * ---------------------------------------------------
   * Places which are bookmarked by default, no need to
   * scan a QR or enter a code. This array of urls (and
   * associated scenarios) is loaded after opening the
   * app and can be used for custom apps.
   *
   * E.g.: ['https://pulse.nowsquare.com/mobile/tour360']
   * ---------------------------------------------------
   */

  "default_bookmarks": [],

  /*
   * ---------------------------------------------------
   * Notification settings for geofences, Android only.
   * smallIcon supports only resources URI like
   * res://ic_menu_mylocation, res://icon,
   * res://ic_menu_call
   * ---------------------------------------------------
   */

  "notification": {
      smallIcon: "res://ic_menu_mylocation",
      icon: "file://assets/images/icons/notification-icon.png"
  },

  /*
   * ---------------------------------------------------
   * Coordinates in case location can't be resolved
   * ---------------------------------------------------
   */

  "default_location": [{
      latitude: 0,
      longitude: 0
  }]
}
