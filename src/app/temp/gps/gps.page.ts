import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-gps',
  templateUrl: './gps.page.html',
  styleUrls: ['./gps.page.scss'],
})
export class GpsPage implements OnInit {
  public env = environment;

  public coords = {
    latitude: 0,
    longitude: 0,
    speed: 0,
    accuracy: 0,
    mapURL: ''
  };

  ngOnInit(): void {
    Geolocation.getCurrentPosition().then((geo) => {
      this.coords = {
        latitude: geo.coords.latitude,
        longitude: geo.coords.longitude,
        speed: (geo.coords.speed) ? geo.coords.speed : 0,
        accuracy: geo.coords.accuracy,
        mapURL: `https://www.google.com/maps/search/?api=1&query=${geo.coords.latitude},${geo.coords.longitude}`
      }
    })
  }
}