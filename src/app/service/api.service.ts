import {Injectable} from "@angular/core";
import {HttpClient, HttpEvent, HttpHeaders, HttpRequest} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiURL;
  constructor(private http: HttpClient) { }

  private request(options: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    if (localStorage.getItem('accessToken')) {
      headers.append('Authorization', 'Bearer ' + localStorage.getItem('accessToken'));
    }

    const defaults = { headers: headers };
    options = Object.assign({}, defaults, options);

    return this.http.request(options.method, options.url, options)
      .pipe(
        catchError(error => {
          return throwError(() => error);
        })
      );
  }

  get(path: string): Observable<any> {
    return this.request({
      url: this.apiUrl + path,
      method: 'GET'
    });
  }

  delete(path: string): Observable<any> {
    return this.request({
      url: this.apiUrl + path,
      method: 'DELETE'
    });
  }

  post(path: string, param: any): Observable<any> {
    return this.request({
      url: this.apiUrl + path,
      body: param,
      method: 'POST'
    });
  }

  importFile(path: string, file: File) : Observable<HttpEvent<Blob>> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    const request = new HttpRequest('POST', this.apiUrl + this.formatPath(path), formData);
    return this.http.request(request);
  }

  formatPath(path: string) {
    return path.endsWith("/") ? path.substring(0, path.length-1) : path;
  }

}
