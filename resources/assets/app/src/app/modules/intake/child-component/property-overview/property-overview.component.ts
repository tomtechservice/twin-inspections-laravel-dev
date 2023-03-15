import { Component, OnInit,Input } from '@angular/core';

import { MapsAPILoader, AgmMap } from '@agm/core';
import { GoogleMapsAPIWrapper } from '@agm/core/services';
declare var google: any;
@Component({
  selector: 'app-property-overview',
  templateUrl: './property-overview.component.html',
  styleUrls: ['./property-overview.component.scss'],
  // providers: [
  //   GoogleMapsAPIWrapper // <---
  // ]
})
export class PropertyOverviewComponent implements OnInit {
  @Input() job;
  map_button_status:string = "Show Map";
  map_status:boolean = true;
  constructor(
    public mapsApiLoader: MapsAPILoader,
      // private zone: NgZone,
      private wrapper: GoogleMapsAPIWrapper) {
      this.mapsApiLoader = mapsApiLoader;
      // this.zone = zone;
      // this.wrapper = wrapper;

      
  }
  panorama: any;
  loca = {
    lat: 32.815173,
    lng: -116.83905950000002
  };
  userData;
  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem('user'));
  }
  
  ngOnChanges(){  
  }

  getStreetMap(){
    this.mapsApiLoader.load().then(() => {
      // this.loca = {
      //   lat: lat,
      //   lng: long
      // };
      if(this.map_button_status === "Show Map"){
          this.map_status = false;
          this.map_button_status = "Hide Map";
      }else{
          this.map_status = true;
          this.map_button_status = "Show Map";
      }
        this.streetMap();
        
        
      });
  }
  
  streetMap() {
    var job_propertices = this.job;
    let lat = parseFloat(job_propertices.property_lat);
      let long = parseFloat(job_propertices.property_long);
    this.panorama = new google.maps.StreetViewPanorama(
        document.getElementById('panozz'), {
            position: {
              lat: lat,
              lng: long
            },
            linksControl: false,
            panControl: false,
            enableCloseButton: false,
            fullscreenControl: false,
            zoomControl: false,
            motionTrackingControl: false,
            addressControl: false

        });
    // console.log(this.pana)
  }
  
  onShowMap(){
    this.getStreetMap();
  }


}
