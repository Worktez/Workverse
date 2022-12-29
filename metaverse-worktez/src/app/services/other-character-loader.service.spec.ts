import { TestBed } from '@angular/core/testing';

import { OtherCharacterLoaderService } from './other-character-loader.service';

describe('OtherCharacterLoaderService', () => {
  let service: OtherCharacterLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OtherCharacterLoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
