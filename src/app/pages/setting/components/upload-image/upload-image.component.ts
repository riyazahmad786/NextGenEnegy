import { Component } from '@angular/core';

import { ToastService } from '../../../../shared/service/toast.service';
import { FileService } from './service/file.service';
import { ImageUploadEventService } from './service/image-upload-event.service';

@Component({
  selector: 'app-upload-image',
  standalone: true,
  imports: [],
  templateUrl: './upload-image.component.html',
  styleUrl: './upload-image.component.css',
})
export class UploadImageComponent {
  private selectedIconFile: File | null = null;
  private selectedBgImageFile: File | null = null;

  constructor(
    private readonly fileService: FileService,
    private readonly imageUploadEvent: ImageUploadEventService,
    private toastService: ToastService
  ) {}

  checkImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      const image = new Image();

      // Read the file
      reader.onload = (event: any) => {
        image.src = event.target.result;
      };

      // Resolve the promise once the image is loaded
      image.onload = () => {
        const width = image.width;
        const height = image.height;
        resolve({ width, height });
      };

      // Handle errors
      image.onerror = (error) => {
        reject('Error loading image');
      };

      reader.readAsDataURL(file); // Convert the file to a Data URL
    });
  }

  onIconFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedIconFile = file; // Save the selected icon file
    }
  }

  // Method triggered when the background image is selected
  onBgImageFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedBgImageFile = file; // Save the selected background image file
      // this.checkImageDimensions(file)
      //   .then((dimensions) => {
      //     console.log(
      //       'Background Image Dimensions:',
      //       dimensions.width,
      //       'x',
      //       dimensions.height
      //     );
      //   })
      //   .catch((error) => {
      //     console.error(error);
      //   });
    }
  }
  onUpload(): void {
    if (!this.selectedIconFile && !this.selectedBgImageFile) {
      this.toastService.showToast({
        text: 'Both files (icon and background image) need to be selected',
        type: 'warning',
      });
      return;
    }

    // Create an array to hold validation promises
    const validationPromises: Promise<boolean>[] = [];

    // Validate Icon File
    if (this.selectedIconFile) {
      const iconFileType = this.selectedIconFile.type;
      if (iconFileType !== 'image/png' && iconFileType !== 'image/jpeg') {
        this.toastService.showToast({
          text: 'Icon file must be in PNG or JPEG format.',
          type: 'error',
        });
        return;
      }
      //   validationPromises.push(this.checkImageDimensions(this.selectedIconFile).then(dimensions => {
      //     if (dimensions.width > 500 || dimensions.height > 600) {
      //         this.toastService.showToast({
      //             text: 'Icon image must be at least 500x600 pixels.',
      //             type: 'error',
      //         });
      //         return false;
      //     }
      //     return true;
      // }));
    }

    // Validate Background Image File
    if (this.selectedBgImageFile) {
      const bgFileType = this.selectedBgImageFile.type;
      if (bgFileType !== 'image/png' && bgFileType !== 'image/jpeg') {
        this.toastService.showToast({
          text: 'Background image must be in PNG or JPEG format.',
          type: 'error',
        });
        return;
      }
      //     validationPromises.push(this.checkImageDimensions(this.selectedBgImageFile).then(dimensions => {
      //         if (dimensions.width < 500 || dimensions.height < 600) {
      //             this.toastService.showToast({
      //                 text: 'Background image must be at least 500x600 pixels.',
      //                 type: 'error',
      //             });
      //             return false;
      //         }
      //         return true;
      //     }));
      // }
    }
    // Wait for all validations to complete
    Promise.all(validationPromises).then((results) => {
      // Check if all validations passed
      if (results.includes(false)) {
        return;
      }

      // Proceed with the upload if all validations passed
      const formData = new FormData();
      if (this.selectedIconFile) {
        formData.append('image', this.selectedIconFile);
      }

      formData.append('Portal', 'User ');

      if (this.selectedBgImageFile) {
        formData.append('LoginUrl', this.selectedBgImageFile);
      }

      this.fileService.AddFileDetails(formData).subscribe(
        (result) => {
          const parsedResult = Number(result);
          if (parsedResult > 0) {
            this.imageUploadEvent.updateIcon('User ');
            this.toastService.showToast({
              text: 'Images uploaded successfully!',
              type: 'success',
            });
          } else {
            this.toastService.showToast({
              text: 'Failed to upload images. Please try again.',
              type: 'error',
            });
          }
        },
        (error) => {
          console.error('Upload error:', error);
          this.toastService.showToast({
            text: 'Invalid image or upload error. Please check your files.',
            type: 'error',
          });
        }
      );
    });
  }
}
