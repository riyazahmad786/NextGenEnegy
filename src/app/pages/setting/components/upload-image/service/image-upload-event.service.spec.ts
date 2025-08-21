import { TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ImageUploadEventService } from './image-upload-event.service';

describe('ImageUploadEventService', () => {
  let service: ImageUploadEventService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ImageUploadEventService,
        provideHttpClient(), // ✅ HttpClient setup
        provideHttpClientTesting(), // ✅ Testing backend
      ],
    });
    service = TestBed.inject(ImageUploadEventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
