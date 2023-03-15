import { Component, Input, ViewChild, NgZone, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from '../../services/common/common.service';
import { Property } from '../../property';
import { PropertyService } from '../../services/property/property.service';

import { MapsAPILoader, AgmMap } from '@agm/core';
import { GoogleMapsAPIWrapper } from '@agm/core/services';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import { asap } from 'rxjs/internal/scheduler/asap';

declare var google: any;

interface Location {
    lat: number;
    lng: number;
    zoom: number;
}

@Component({
    selector: 'app-property-info',
    templateUrl: './property-info.component.html',
    styleUrls: ['./property-info.component.scss']
})
export class PropertyInfoComponent implements OnInit, OnDestroy {
    map_button_status: string = "Show Map";
    map_status: boolean = true;
    regenerateMap: boolean = false;

    page_title = "Inspection: Property Edit"
    autocomplete: any;
    geocoder: any;
    panorama: any;
    public location: Location = {
        lat: 51.678418,
        lng: 7.809007,
        zoom: 5
    };
    loading = false;
    no_data = false;
    // @ViewChild(AgmMap) map: AgmMap;

    @Input() intakeTab;
    states: string[];
    branches: string[];
    full_address = null;
    branchDetails = {
        id: '',
        msg: '',
        name: '',
        zip: '',
        city: '',
        country: ''
    }
    zillData = {
        year: "",
        feet: ""
    }
    over_ride_branch = false;
    address: string[];
    loca = {
        lat: 32.815173,
        lng: -116.83905950000002
    };
    copyproperty: any;
    check_property = false;
    branch_display = false;
    property = new Property(null, null, null, '', '', '', 'CA', null, 1, 1, null, '', '', null, null, null, null, null, '', null, null, null, null, "", false);
    constructor(
        private commonService: CommonService,
        private propertyService: PropertyService,
        private _router: Router,
        private router: ActivatedRoute,

        public mapsApiLoader: MapsAPILoader,
        private zone: NgZone,
        private wrapper: GoogleMapsAPIWrapper) {
        this.mapsApiLoader = mapsApiLoader;
        this.zone = zone;
        this.wrapper = wrapper;
        this.mapsApiLoader.load().then(() => {
            this.geocoder = new google.maps.Geocoder();
            this.agmLazyMapsAPILoader()

        });

    }

    ngOnInit() {
        this.getStates();
        this.getBranch();
        this.router.params.subscribe(params => {
            if (params.jobId) {
                this.property.job_id = params.jobId;
                this.editProperty(params.jobId);
            }

        })
        this.copyproperty = Object.assign({}, this.property);


    }
    isNotSave = false;
    ngOnDestroy() {
        if (this.check_property == false) {
            // if(this.property.property_address1 != "" && this.property.property_city !="" && this.property.property_zip !=null && this.property.property_year !=null && this.property.property_square_feet !=null ){
            let copyproperty = JSON.stringify(this.copyproperty);
            let property = JSON.stringify(this.property);
            if (copyproperty === property) {

            } else {
                if (this.property.property_address1 != "" && this.property.property_city != "" && this.property.property_zip != null && this.property.property_year != null && this.property.property_square_feet != null) {
                    this.isNotSave = true;
                    this.propertySubmit();
                }
                // Swal({
                //     title: 'Warning',
                //     text: 'Content Changed, Do You Want To Save?',
                //     type: 'warning',
                //     showCancelButton: true,
                //     confirmButtonColor: '#3085d6',
                //     cancelButtonColor: '#d33',
                //     confirmButtonText: 'Yes'
                // })
                // .then((result) => {
                //     if (result.value) {
                //         this.propertySubmit();
                //     }
                // })
            }
            // }
        }


    }
    getStates() {
        this.commonService.getState().subscribe(
            data => {
                this.states = data as string[];
            }
        );
    }
    getBranch() {
        this.commonService.getBranch().subscribe(
            data => {
                this.branches = data as string[];
            }
        );
    }
    editProperty(job_id) {
        this.propertyService.getProperty(job_id).subscribe(
            data => {
                if (data.property) {
                    this.property = new Property(
                        data.property.property_id,
                        data.property.client_id,
                        data.job_id,
                        data.property.property_address1,
                        data.property.property_address2,
                        data.property.property_city,
                        data.property.property_state,
                        data.property.property_zip,
                        data.property.property_lat,
                        data.property.property_long,
                        data.property.property_use_google_maps,
                        data.property.property_type,
                        data.property.property_foundation,
                        data.property.property_year,
                        data.property.property_square_feet,
                        data.property.property_notes,
                        data.property.property_image_file,
                        data.property.multi_story,
                        data.job_sub_type,
                        data.property.property_access,
                        data.property.property_gate_code,
                        data.property.property_lock_box_code,
                        data.job_notes,
                        data.branch_id,
                        false
                    );
                    this.property.property_use_google_maps = (data.property.property_use_google_maps == 1) ? "1" : "0";
                    //   if(data.branch){
                    //     this.branchDetails.name =  data.branch.branch_name;
                    //     this.branchDetails.zip =  data.branch.branch_zip;
                    //     this.branchDetails.city =  data.branch.branch_city;
                    //     this.branchDetails.country =  data.branch.branch_state;
                    //     this.branch_display =true;
                    //   }
                    // this.map.triggerResize()
                    //   this.checkZip()
                    this.loca = {
                        lat: parseFloat(data.property.property_lat),
                        lng: parseFloat(data.property.property_long)
                    }
                    this.copyproperty = Object.assign({}, this.property);
                    // this.getStreetMap();
                    this.getZill();
                }


            }
        );
        this.over_ride_branch = true;
    }
    msgShow = true;
    changeBranch() {
        this.branch_display = false;
        this.msgShow = false;
        // this.branches.forEach((value : any, key :any) => {
        //     if(value.branch_id==this.property.branch_id){
        //         this.branchDetails.name =  value.branch_name;
        //         this.branchDetails.zip =  value.branch_zip;
        //         this.branchDetails.city =  value.branch_city;
        //         this.branchDetails.country =  value.branch_state;
        //         this.branch_display =true;
        //     }

        // })

    }

    submitted = false;
    propertySubmit() {
        this.submitted = true;
        this.propertyService.addProperty(this.property).subscribe(
            data => {
                this.check_property = true;
                this.submitted = false;
                if (this.isNotSave == false) {
                    let tabsOrder = JSON.parse(localStorage.getItem("tab_orders"));
                    let tabKeys = Object.keys(tabsOrder);
                    this._router.navigate([tabsOrder[tabKeys[tabKeys.indexOf('property') + 1]] + '/', data]);
                } else {
                    this.isNotSave = true;
                    if (this.property.job_id == null) {
                        let locationHash = this._router.url.split("/");
                        if (locationHash.length == 2) {
                            this._router.navigate([locationHash[1] + '/', data]);
                        }
                    }
                }

            },
            error => {
                console.log(error);
            }
        );
    }
    getZill() {
        let person = {
            address: this.property.property_address1,
            city: this.property.property_city,
        };

        this.propertyService.getZill(person).subscribe(
            data => {
                this.zillData.year = data.year;
                this.zillData.feet = data.feet;
                // error =>  this.error=error
            }
        );
    }
    zillFeet(data) {
        this.property.property_square_feet = data;

    }
    zillYear(data) {
        this.property.property_year = data;
    }
    checkZip() {
        var zip = this.property.property_zip;
        if (zip && zip.toString().length >= 5) {
            this.over_ride_branch = true;

            this.propertyService.checkZip(this.property.property_zip).subscribe(
                data => {
                    if (data.status == 200) {
                        this.branchDetails.id = data.id;
                        this.branchDetails.name = data.branch_name;
                        this.branchDetails.zip = data.zipcode_zip;
                        this.branchDetails.city = data.zipcode_city;
                        this.branchDetails.country = data.zipcode_county;
                        this.branch_display = true;
                        this.property.branch_id = data.id;
                    }
                    this.branchDetails.msg = data.msg;

                    // error =>  this.error=error
                }
            );

        }
    }
    getProperty(val) {
        this.loading = true;
        this.propertyService.searchProperty(this.property).subscribe(
            data => {
                if (data.property) {
                    this.address = data.property as string[];
                    this.loading = false;
                    this.no_data = false;
                } else {
                    this.loading = false;
                    this.no_data = true;
                }
                // error =>  this.error=error
            }
        );
    }
    propertyAddress(addr) {
        this.property.property_id = addr.property_id;
        this.property.property_address1 = addr.property_address1;
        this.property.property_address2 = addr.property_address2;
        this.property.property_city = addr.property_city;
        this.property.property_state = addr.property_state;
        this.property.property_zip = addr.property_zip;

        this.property.multi_story = addr.multi_story;
        this.property.property_type = addr.property_type;
        this.property.property_foundation = addr.property_foundation;
        this.property.property_year = addr.property_year;
        this.property.property_square_feet = addr.property_square_feet;
        this.property.property_notes = addr.property_notes;
        //   this.property.branch_id = addr.branch_id;

        //   this.branchDetails.name = addr.branch.name,
        //       this.branchDetails.zip = addr.branch.zip,
        //       this.branchDetails.city = addr.branch.city,
        //       this.branchDetails.country = addr.branch.country,
        this.checkZip();
        this.full_address = this.property.property_address1 + "," + this.property.property_city + "," + this.property.property_state + "," + this.property.property_zip;
        this.findLocation(this.full_address);

        this.over_ride_branch = true;
        this.getZill();
    }
    regenerateAddress() {
        this.full_address = this.property.property_address1 + "," + this.property.property_city + "," + this.property.property_state + "," + this.property.property_zip;
        this.findLocation(this.full_address);
    }
    findLocation(address) {
        if (!this.geocoder) this.geocoder = new google.maps.Geocoder()
        this.geocoder.geocode({
            'address': address
        }, (results, status) => {

            if (status == google.maps.GeocoderStatus.OK) {
                if (results[0].geometry.location) {
                    this.location.lat = results[0].geometry.location.lat();
                    this.location.lng = results[0].geometry.location.lng();
                    this.property.property_lat = this.location.lat;
                    this.property.property_long = this.location.lng;
                }
                this.loca = {
                    lat: this.property.property_lat,
                    lng: this.property.property_long
                }
                if (this.map_button_status == "Hide Map") {
                    this.regenerateMap = true;
                    this.getStreetMap();
                }
                this.regenerateMap = false;
                // this.getStrtMap();
                // this.map.triggerResize()
            } else {
                alert("Sorry, this search produced no results.");
            }
        })
    }
    streetMap() {
        this.panorama = new google.maps.StreetViewPanorama(
            document.getElementById('panozz'), {
            position: this.loca,
            linksControl: false,
            panControl: false,
            enableCloseButton: false,
            fullscreenControl: false,
            zoomControl: false,
            motionTrackingControl: false,
            addressControl: false

        });
    }

    agmLazyMapsAPILoader() {
        var input = document.getElementById('property_address1');
        var options = {
            // bounds: defaultBounds,
            //   types: ['establishment'],
            componentRestrictions: { country: "us" }
        };
        var that = this;
        var places = new google.maps.places.Autocomplete(input, options);

        google.maps.event.addListener(places, 'place_changed', function () {
            var place = places.getPlace();
            // var address = place.formatted_address;
            that.property.property_id = null;
            for (var i = 0; i < place.address_components.length; i++) {
                let addressType = place.address_components[i].types[0];
                // let addressName = place.address_components[i].long_name;
                if (addressType == 'administrative_area_level_1') {
                    that.property.property_state = place.address_components[i].short_name;
                }
                if (addressType == "locality") {
                    that.property.property_city = place.address_components[i].long_name;
                }
                if (addressType == 'postal_code') {
                    that.property.property_zip = place.address_components[i].short_name;
                }
                if (addressType == "street_number") {
                    var str1 = place.address_components[i].short_name;
                }
                if (addressType == 'route') {
                    that.property.property_address1 = str1 + " " + place.address_components[i].long_name;
                }
            }
            // that.over_ride_branch = true;
            that.getStreetMap();
            that.getZill();
            that.checkZip();
        });


    }

    getStreetMap() {
        if (!this.regenerateMap) {
            if (this.map_button_status === "Show Map") {
                this.map_status = false;
                this.map_button_status = "Hide Map";
            } else {
                this.map_status = true;
                this.map_button_status = "Show Map";
            }
        }


        this.mapsApiLoader.load().then(() => {
            this.geocoder = new google.maps.Geocoder();
            this.agmLazyMapsAPILoader();
            this.streetMap();

        });

    }

    lockBoxCodeEntered() {
        if (this.property.property_lock_box_code !== '' && this.property.property_lock_box_code !== null) {
            Swal({
                title: '',
                html: '<div class="lock-icon" style="position: relative;justify-content: center;width: 5em;height: 5em;margin: 1.25em auto 1.875em;border: .25em solid transparent;border-top-color: transparent;border-right-color: transparent;border-bottom-color: transparent;border-left-color: transparent;border-radius: 50%;line-height: 5em;cursor: default;box-sizing: content-box;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;zoom: normal;border-color: #EFC86D;color: #EFC86D;line-height: 5em;cursor: default;"><span class="lock-icon-text" style="font-size: 3.75em;"><span class="fa fa-bell"></span></span></div>Can this inspection be performed at any time of day?',
                customClass: 'lockbox_modal',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes',
                cancelButtonText: 'No'
            })
                .then((result) => {
                    if (result.value) {
                        this.property.is_anytime = true;
                    }
                    else {
                        this.property.is_anytime = false;
                    }
                })
        }
        else {
            this.property.is_anytime = false;
        }
    }

}
