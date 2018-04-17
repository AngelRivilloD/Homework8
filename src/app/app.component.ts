import { Component, ElementRef, NgModule, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormControl, NgModel, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { AgmCoreModule, MapsAPILoader } from '@agm/core';

import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { } from 'googlemaps';
import { ServiceService } from "../app/service.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  public RadioSelected: any = 1;
  public Keyword: any;
  public KeywordValid: any;
  public OtherLocationValid: any;

  public latitude: any;
  public longitude: any;
  public searchControl: FormControl;
  public zoom: number;
  public actualLocation: any = 0;
  public Favorites: any = [];

  public JsonTest: any;
  public JsonTestPlace: any;
  public JsonData: any;
  public From: any;
  public To: any;
  public selectedReview: any = 0;

  public nextToken: any;
  public previousToken: any;
  public thereIsNext: any;
  public yelpReviews: any;

  public NoHours: any = 0;

  public Loading: any = 0;

  public OtherLocation: any;

  public streetViewMode: any = 0;

  public ShowTable: any = 0;
  public ShowDetails: any = 0;
  public DetailsTab: any = 1;
  public map2: any;

  public Category: any = "Default";
  public Radius: any = 10;

  public TravelMode: any = "DRIVING";
  public RowDetails: any;
  public Hours: any;

  public LoadedMap: any = 0;


  public place:any;
public center:any;
public autocomplete:any;
public pos:any;
public panorama:any;
public NoRecord:any;

  @ViewChild("search")
  public searchElementRef: ElementRef;

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private http: HttpClient,
    private serviceServive: ServiceService
  ) {


  }

  ngAfterViewInit() {

    this.http.get('http://ip-api.com/json').subscribe(data => {
      console.log(data);

      this.actualLocation = JSON.parse(JSON.stringify(data));

      localStorage.setItem("actualLocation", this.actualLocation);

      console.log(this.actualLocation.lat);
    });
  }


  showMap() {


    if(this.LoadedMap == 0){

    //set google maps defaults
    this.zoom = 4;
    //create search FormControl
    this.searchControl = new FormControl();
    //set current position
    this.setCurrentPosition();
    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {

      this.autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ["address"]
      });
      this.autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = this.autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          this.From = place.name;
          //set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.zoom = 10;

          this.center = new google.maps.LatLng(this.latitude, this.longitude);
          this.map2.panTo(this.center);

        });

      });

      console.log("lat y long2", this.latitude, this.longitude);
      this.pos = { lat: this.latitude, lng: this.longitude };
      this.map2 = new google.maps.Map(document.getElementById('map2'), {
        center: this.pos,
        zoom: 14
      });
      this.panorama = new google.maps.StreetViewPanorama(
        document.getElementById('pano'), {
          position: this.pos,
          pov: {
            heading: 34,
            pitch: 10
          }
        });
      this.map2.setStreetView(this.panorama);

      console.log("this.LoadedMap == 0", this.autocomplete,this.center);

    })
    }else if (this.LoadedMap == 1){

      
    }


    this.LoadedMap = 1;
  }

  selectReview(type: any) {
    console.log(type);
  }

  calculateRoute() {
    let directionsDisplay = new google.maps.DirectionsRenderer;
    let directionsService = new google.maps.DirectionsService;
    this.calculateAndDisplayRoute(directionsService, directionsDisplay);
  }

  calculateAndDisplayRoute(directionsService, directionsDisplay) {
    let start = this.From;
    let end = this.To;

    directionsDisplay.setMap(this.map2);
    directionsDisplay.setPanel(document.getElementById('right-panel'));

    if (start == undefined) {
      start = this.actualLocation.city;
    }
    console.log(start, end);

    directionsService.route({
      origin: start,
      destination: end,
      travelMode: this.TravelMode,
      provideRouteAlternatives: true
    }, function (response, status) {
      console.log("response,status", response, status);
      if (status === 'OK') {
        directionsDisplay.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }

  private setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        //   this.latitude = position.coords.latitude;
        //   this.longitude = position.coords.longitude;
        this.zoom = 12;
      });
    }
  }

  radioClicked(radioselected: any) {

    this.RadioSelected = radioselected;
  }

  callPrevious() {

    this.Loading = 1;
    this.serviceServive.getNextPage(this.Keyword, this.actualLocation.lat, this.actualLocation.lon, this.Category, this.Radius, this.previousToken).subscribe((response) => {
      console.log(response);
      this.Loading = 0;

      let data = JSON.parse(JSON.stringify(response));

      if (data.status == "OK") {
        this.JsonData = data.results;

        if (data.next_page_token) {
          this.nextToken = data.next_page_token;
          this.thereIsNext = 1;
        } else {
          this.thereIsNext = 0;
        }

      }
    })

  }


  deleteFavorite(row: any) {
    console.log(localStorage.getItem("Favorites"));
    console.log(row);
  }


  clearSearch() {
    this.Keyword = "";
    this.Radius = 10;
    this.Category = "Default";
    this.radioClicked(1);

    this.ShowTable = 0;
  }

  setFavorite(row: any) {

    if (row == 0) {

      console.log((localStorage.getItem("ActualRow")));
      this.Favorites.push(JSON.parse(JSON.stringify(localStorage.getItem("ActualRow"))));

    } else {
      this.Favorites.push(JSON.parse(JSON.stringify(row)));
    }

    console.log(this.Favorites, row);

    localStorage.setItem("Favorites", this.Favorites);
    console.log(localStorage.getItem("Favorites"));
  }

  callNext() {

    this.previousToken = this.nextToken;

    this.Loading = 1;
    this.serviceServive.getNextPage(this.Keyword, this.actualLocation.lat, this.actualLocation.lon, this.Category, this.Radius, this.nextToken).subscribe((response) => {
      console.log(response);
      this.Loading = 0;

      let data = JSON.parse(JSON.stringify(response));

      if (data.status == "OK") {
        this.JsonData = data.results;

        if (data.next_page_token) {
          this.nextToken = data.next_page_token;
          this.thereIsNext = 1;
        } else {
          this.thereIsNext = 0;
        }
      }
    })

  }

  validate() {

    if(this.Radius == ""){
      this.Radius = 10;
    }

    this.Loading = 1;

    if (this.Keyword == undefined || this.Keyword == "") {
      this.KeywordValid = false;
      this.Loading = 0;
    } else if(this.Keyword.trim() == 0){
      this.KeywordValid = false;
      this.Loading = 0;
    }else{

      this.KeywordValid = true;
     

      if (this.RadioSelected == 1) {
        this.serviceServive.getSearchCurrent(this.Keyword, this.actualLocation.lat, this.actualLocation.lon, this.Category, this.Radius).subscribe((response) => {
          console.log(response);
          this.Loading = 0;

          let data = JSON.parse(JSON.stringify(response));

          if (data.status == "OK") {
            this.JsonData = data.results;
            this.ShowTable = 1;
            this.NoRecord = 0;

            if (data.next_page_token) {
              this.nextToken = data.next_page_token;
              this.thereIsNext = 1;
            } else {
              this.thereIsNext = 0;
            }
          }else if (data.meta == 2){
            this.NoRecord = 1;
            this.ShowTable = 0;
          }
        })
      } else if (this.RadioSelected == 2) {

        if(this.OtherLocation == undefined){
          this.OtherLocationValid = false;
          this.Loading = 0;
        }else{

          this.OtherLocationValid = true;
          console.log(this.OtherLocation);
          this.serviceServive.getSearch(this.Keyword, this.OtherLocation, this.Category, this.Radius).subscribe((response) => {
            console.log(response);
            this.Loading = 0;
  
            let data = JSON.parse(JSON.stringify(response));
  
            if (data.status == "OK") {
              this.JsonData = data.results;
              this.ShowTable = 1;
              this.NoRecord = 0;
  
              if (data.next_page_token) {
                this.nextToken = data.next_page_token;
                this.thereIsNext = 1;
              } else {
                this.thereIsNext = 0;
              }
            }else if (data.meta == 2){
              this.NoRecord = 1;
              this.ShowTable = 0;
            }
          })
        }
       
      }
    }
  }

  openHours(hours: any) {
    console.log(hours);

    this.Hours = hours.weekday_text;

  }

  detailsClicked(row: any) {

    console.log(row);

    let row2 = JSON.parse(JSON.stringify(row));

    localStorage.setItem("ActualRow", row2);

    this.serviceServive.getPlace(row.place_id).subscribe((response) => {


      console.log(response);
      this.RowDetails = response;

      if (!this.RowDetails.result.opening_hours) {
        this.NoHours = 1;
        console.log("NO HAY HORAS");
      }

      this.ShowDetails = 1;

      this.latitude = this.RowDetails.result.geometry.location.lat;
      this.longitude = this.RowDetails.result.geometry.location.lng;


      this.To = this.RowDetails.result.vicinity;
      console.log("to", this.To);

    })

    this.serviceServive.getYelpReview(row.place_id).subscribe((response) => {

      let data = JSON.parse(JSON.stringify(response));


      console.log("YELP", data);
      if (data.info == "no match found") {
        this.yelpReviews = 0;
      } else {
        this.yelpReviews = data;
      }



    })




  }

}


