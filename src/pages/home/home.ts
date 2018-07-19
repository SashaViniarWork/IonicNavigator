import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {Geolocation} from '@ionic-native/geolocation';
import {
  NativeGeocoder,
  NativeGeocoderReverseResult,
  NativeGeocoderForwardResult,
  NativeGeocoderOptions
} from '@ionic-native/native-geocoder';
import {LocalNotifications} from "@ionic-native/local-notifications";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  lat: any;
  lon: any;

  Location: any;
  IsLocation: any = false;

  constructor(public navCtrl: NavController, private geolocation: Geolocation, private nativeGeocoder: NativeGeocoder, public local: LocalNotifications) {


    this.geolocation.getCurrentPosition().then((resp) => {
      this.lat = resp.coords.latitude;
      this.lon = resp.coords.longitude;
      console.log(this.lon, this.lat);
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  GeocoderWithCoords() {

    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };
    this.nativeGeocoder.reverseGeocode(this.lat, this.lon, options)
      .then((result: NativeGeocoderReverseResult[]) => {
        this.Location = result[0];
        console.log(this.Location);
        this.IsLocation = true;
        this.LocalNotification();
      })
      .catch((error: any) => console.log(error));
  }

  LocalNotification() {
    this.local.schedule({
      text: this.Location.countryName + ' ' + this.Location.thoroughfare + ' ' + this.Location.subThoroughfare,
      trigger: {at: new Date(new Date().getTime() + 3600)},
      led: 'FF0000',
      sound: null

    });

    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };
    this.nativeGeocoder.forwardGeocode(this.Location.countryName + ' ' + this.Location.thoroughfare + ' ' + this.Location.subThoroughfare, options)
      .then((coordinates: NativeGeocoderForwardResult[]) => {
        console.log('The coordinates are latitude=' + coordinates[0].latitude + ' and longitude=' + coordinates[0].longitude);
      })
      .catch((error: any) => console.log(error));
  }
}
