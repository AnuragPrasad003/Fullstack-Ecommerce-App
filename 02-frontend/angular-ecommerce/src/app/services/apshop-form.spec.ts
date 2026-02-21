import { TestBed } from '@angular/core/testing';

import { APShopForm } from './apshop-form';

describe('APShopForm', () => {
  let service: APShopForm;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(APShopForm);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
