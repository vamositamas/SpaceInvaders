import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { provideZonelessChangeDetection } from '@angular/core';
import { ErrorHandlerService, IS_PRODUCTION } from './error-handler.service';

describe('ErrorHandlerService', () => {
  let service: ErrorHandlerService;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;

  const configure = (isProduction = false) => {
    mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
    TestBed.configureTestingModule({
      providers: [
        ErrorHandlerService,
        provideZonelessChangeDetection(),
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: IS_PRODUCTION, useValue: isProduction },
      ],
    });
    service = TestBed.inject(ErrorHandlerService);
  };

  beforeEach(() => configure(false));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // ── handleError ─────────────────────────────────────────────────────────

  describe('handleError', () => {
    it('should return an Observable<never> that throws the original error', (done) => {
      const error = new HttpErrorResponse({ status: 500, statusText: 'Server Error' });
      service.handleError(error).subscribe({
        next: () => fail('expected an error, not a value'),
        error: (thrown) => {
          expect(thrown).toBe(error);
          done();
        },
      });
    });

    it('should show a user-friendly message for 404 errors', (done) => {
      const error = new HttpErrorResponse({ status: 404, statusText: 'Not Found' });
      service.handleError(error).subscribe({
        error: () => {
          expect(mockSnackBar.open).toHaveBeenCalledWith(
            jasmine.stringContaining('not found'),
            jasmine.any(String),
            jasmine.any(Object)
          );
          done();
        },
      });
    });

    it('should show a user-friendly message for 500 errors', (done) => {
      const error = new HttpErrorResponse({ status: 500, statusText: 'Server Error' });
      service.handleError(error).subscribe({
        error: () => {
          expect(mockSnackBar.open).toHaveBeenCalledWith(
            jasmine.stringContaining('server error'),
            jasmine.any(String),
            jasmine.any(Object)
          );
          done();
        },
      });
    });

    it('should show a connection failed message for network errors (status 0)', (done) => {
      const error = new HttpErrorResponse({ status: 0, statusText: 'Unknown Error' });
      service.handleError(error).subscribe({
        error: () => {
          expect(mockSnackBar.open).toHaveBeenCalledWith(
            jasmine.stringContaining('connect'),
            jasmine.any(String),
            jasmine.any(Object)
          );
          done();
        },
      });
    });

    it('should show an unauthorized message for 401 errors', (done) => {
      const error = new HttpErrorResponse({ status: 401, statusText: 'Unauthorized' });
      service.handleError(error).subscribe({
        error: () => {
          expect(mockSnackBar.open).toHaveBeenCalledWith(
            jasmine.stringContaining('nauthorized'),
            jasmine.any(String),
            jasmine.any(Object)
          );
          done();
        },
      });
    });

    it('should show an access denied message for 403 errors', (done) => {
      const error = new HttpErrorResponse({ status: 403, statusText: 'Forbidden' });
      service.handleError(error).subscribe({
        error: () => {
          expect(mockSnackBar.open).toHaveBeenCalledWith(
            jasmine.stringContaining('ccess denied'),
            jasmine.any(String),
            jasmine.any(Object)
          );
          done();
        },
      });
    });

    it('should show a bad request message for 400 errors', (done) => {
      const error = new HttpErrorResponse({ status: 400, statusText: 'Bad Request' });
      service.handleError(error).subscribe({
        error: () => {
          expect(mockSnackBar.open).toHaveBeenCalledWith(
            jasmine.stringContaining('Bad request'),
            jasmine.any(String),
            jasmine.any(Object)
          );
          done();
        },
      });
    });

    it('should call logError with the original error', (done) => {
      spyOn(service, 'logError').and.callThrough();
      const error = new HttpErrorResponse({ status: 500, statusText: 'Server Error' });
      service.handleError(error).subscribe({
        error: () => {
          expect(service.logError).toHaveBeenCalledWith(error);
          done();
        },
      });
    });
  });

  // ── showErrorMessage ─────────────────────────────────────────────────────

  describe('showErrorMessage', () => {
    it('should open a snack bar with the provided message', () => {
      service.showErrorMessage('Test error message');
      expect(mockSnackBar.open).toHaveBeenCalledWith(
        'Test error message',
        jasmine.any(String),
        jasmine.any(Object)
      );
    });

    it('should include a dismiss action label', () => {
      service.showErrorMessage('Some error');
      const args = mockSnackBar.open.calls.mostRecent().args;
      const action = args[1];
      expect(typeof action).toBe('string');
      expect((action as string).length).toBeGreaterThan(0);
    });

    it('should set a display duration in the config', () => {
      service.showErrorMessage('Some error');
      const [, , config] = mockSnackBar.open.calls.mostRecent().args;
      expect(config?.duration).toBeGreaterThan(0);
    });
  });

  // ── logError ────────────────────────────────────────────────────────────

  describe('logError', () => {
    it('should call console.error in development mode', () => {
      spyOn(console, 'error');
      const error = new Error('dev error');
      service.logError(error);
      expect(console.error).toHaveBeenCalled();
    });

    it('should pass the error object to console.error', () => {
      spyOn(console, 'error');
      const error = new HttpErrorResponse({ status: 404 });
      service.logError(error);
      expect(console.error).toHaveBeenCalledWith(jasmine.any(String), error);
    });
  });

  describe('logError in production mode', () => {
    let prodService: ErrorHandlerService;

    beforeEach(() => {
      TestBed.resetTestingModule();
      const snackSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
      TestBed.configureTestingModule({
        providers: [
          ErrorHandlerService,
          provideZonelessChangeDetection(),
          { provide: MatSnackBar, useValue: snackSpy },
          { provide: IS_PRODUCTION, useValue: true },
        ],
      });
      prodService = TestBed.inject(ErrorHandlerService);
    });

    it('should not call console.error in production mode', () => {
      spyOn(console, 'error');
      const error = new Error('prod error');
      prodService.logError(error);
      expect(console.error).not.toHaveBeenCalled();
    });
  });
});
