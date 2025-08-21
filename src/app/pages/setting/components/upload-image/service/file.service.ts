import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment';

const baseUrl = environment.baseUrl + 'FileUpload';
@Injectable({
  providedIn: 'root',
})
export class FileService {
  constructor(private http: HttpClient) {}
  public downloadFile(docFile: string): Observable<Blob> {
    return this.http.get(baseUrl + '/GetFile?docFile=' + docFile, {
      responseType: 'blob',
    });
  }
  public downloadImage(image: string): Observable<Blob> {
    return this.http.get(baseUrl + '/GetImage?image=' + image, {
      responseType: 'blob',
    });
  }
  public getFileDetails(portal: string): Observable<any> {
    return this.http.get<any>(
      baseUrl + '/GetUserDisplaySettings?portal=' + portal
    );
  }

  AddFileDetails(data: FormData): Observable<string> {
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    const httpOptions = {
      headers: headers,
    };
    return this.http.post<string>(
      baseUrl + '/AddFileDetails/',
      data,
      httpOptions
    );
  }
}
