import { Injectable, Signal, signal } from '@angular/core';
import { catchError, map, of } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../../../../../../environments/environment-image';
import { FileService } from './file.service';

import { switchMap } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
const baseUrl = environment.baseUrl;
@Injectable({
  providedIn: 'root',
})
export class ImageUploadEventService {
  constructor(private fileService: FileService, private http: HttpClient) {}
  private iconSignal = signal<string>('');
  private bgIconSignal = signal<string>('');
  private apiBaseUrl = environment.baseUrl + 'FileUpload';
  getLogoBase64(portal: string): Observable<string> {
    return this.http
      .get<any>(this.apiBaseUrl + '/GetLogoBase64?portal=' + portal)
      .pipe(
        catchError((error) => {
          console.error('Error fetching logo:', error);
          return this.getDefaultLogoBase64();
        })
      );
  }

  private getDefaultLogoBase64(): Observable<string> {
    return this.http
      .get('assets/vendors/images/deskapp-logo.png', {
        responseType: 'blob',
      })
      .pipe(
        switchMap((blob) => {
          return new Observable<string>((observer) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              observer.next(reader.result as string);
              observer.complete();
            };
            reader.onerror = (error) => {
              observer.error(error);
            };
            reader.readAsDataURL(blob);
          });
        }),
        catchError((error) => {
          console.error('Error loading default logo:', error);
          return of(''); // Return empty string as fallback
        })
      );
  }
  // Method to update the icon
  updateIcon(role: string): void {
    this.getImageUrl(role).subscribe(
      ({ imageUrl, bgImageUrl }: { imageUrl: string; bgImageUrl: string }) => {
        if (imageUrl) {
          this.iconSignal.set(imageUrl); // Update the icon signal with the image URL
        }
        if (bgImageUrl) {
          this.bgIconSignal.set(bgImageUrl); // Update the background icon signal with the background image URL
        }
      }
    );
  }

  // Method to get the current icon as a Signal
  getIconSignal(): Signal<string> {
    return this.iconSignal.asReadonly();
  }
  getBgImageSignal(): Signal<string> {
    return this.bgIconSignal.asReadonly();
  }

  public getImageUrl(
    role: string
  ): Observable<{ imageUrl: string; bgImageUrl: string }> {
    return this.fileService.getFileDetails(role).pipe(
      map((result: any) => {
        let imageUrl = 'assets/images/logo3.png'; // Default logo image
        let bgImageUrl = 'assets/images/default-bg.png'; // Default background image

        if (result && result.Table && result.Table[0].LogoUrl) {
          // Construct the image URL
          const apiBaseUrl = baseUrl.replace('/api', '');

          // Construct the correct image path
          imageUrl = `${apiBaseUrl}/Files/${
            result.Table[0].LogoUrl
          }?${new Date().getTime()}`;
          // imageUrl =
          //   baseUrl +
          //   'Files/' +
          //   result.Table[0].LogoUrl +
          //   '?' +
          //   new Date().getTime();
        }

        if (result && result.Table && result.Table[0].LoginUrl) {
          // Construct the background image URL
          const apiBaseUrl = baseUrl.replace('/api', '');

          // Construct the correct image path
          bgImageUrl = `${apiBaseUrl}/Files/${
            result.Table[0].LoginUrl
          }?${new Date().getTime()}`;
          // bgImageUrl =
          //   baseUrl +
          //   'Files/' +
          //   result.Table[0].LoginUrl +
          //   '?' +
          //   new Date().getTime();
        }
        console.log('Generated Image URL:', imageUrl);
        console.log('Generated Background Image URL:', bgImageUrl);
        // Return both imageUrl and bgImageUrl
        return { imageUrl, bgImageUrl };
      }),
      catchError((err) => {
        console.error('Error retrieving file details:', err);
        // Return default imageUrl and bgImageUrl in case of an error
        return of({
          imageUrl: 'assets/images/logo3.png',
          bgImageUrl: 'assets/vendors/images/login-page-img4.jpg',
        });
      })
    );
  }
}
