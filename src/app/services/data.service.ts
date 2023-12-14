import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  getData(url:string) {
    return this.http.get(url);
  }

  // POST request example
  postData(url:string,data: any) {
    return this.http.post(url, data);
  }
}
