import { Injectable } from '@angular/core';
import { Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { InterceptorService } from 'ng2-interceptors';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable()
export class ServiceService {

  constructor(public http: HttpClient) { }

  getSearchCurrent(keyword:any,lat:any,lon:any,category:any,radius:any) {
    return this.http.get('http://hw8project-php.us-east-2.elasticbeanstalk.com/v1/rest_api/getmaps?keyword='+keyword+'&category='+category+'&radius='+radius+'&place=1&coordinates='+lat+','+lon);
  }

  getSearch(keyword:any,place:any,category:any,radius:any) {
    return this.http.get('http://hw8project-php.us-east-2.elasticbeanstalk.com/v1/rest_api/getmaps?keyword='+keyword+'&category='+category+'&radius='+radius+'&place='+place);
  }

  getNextPage(keyword:any,lat:any,lon:any,category:any,radius:any,token:any){
    return this.http.get('http://hw8project-php.us-east-2.elasticbeanstalk.com/v1/rest_api/getmaps?keyword='+keyword+'&category='+category+'&radius='+radius+'&place='+lat+','+lon+'&pagination='+token);
  } 
  
  getPlace(placeid:any){
    return this.http.get('http://hw8project-php.us-east-2.elasticbeanstalk.com/v1/rest_api/getplace?placeid='+placeid);
  }

  getYelpReview(placeid:any){
    return this.http.get('http://hw8project-php.us-east-2.elasticbeanstalk.com/v1/rest_api/yelpreview?placeid='+placeid);
  }



}


