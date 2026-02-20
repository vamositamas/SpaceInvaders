import { Injectable, InjectionToken, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../environments/environment';

/** Injection token for the production flag — override in tests to control logging behaviour. */
export const IS_PRODUCTION = new InjectionToken<boolean>('IS_PRODUCTION', {
  factory: () => environment.production,
});

/**
 * ErrorHandlerService — centralises HTTP error handling across the application.
 *
 * Responsibilities:
 * - Map HTTP status codes to user-friendly messages
 * - Display those messages via MatSnackBar
 * - Log errors to the console in non-production environments
 */
@Injectable({ providedIn: 'root' })
export class ErrorHandlerService {
  private readonly snackBar = inject(MatSnackBar);
  private readonly isProduction = inject(IS_PRODUCTION);

  /**
   * Processes an HTTP error: shows a user-friendly message, logs the error,
   * then re-throws the original error for downstream handling.
   */
  handleError(error: HttpErrorResponse | Error): Observable<never> {
    const message = this.getUserMessage(error);
    this.showErrorMessage(message);
    this.logError(error);
    return throwError(() => error);
  }

  /**
   * Displays a message to the user via a snackbar notification.
   */
  showErrorMessage(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 5000 });
  }

  /**
   * Logs the error to the console in development/test environments.
   */
  logError(error: any): void {
    if (!this.isProduction) {
      console.error('API Error:', error);
    }
  }

  private getUserMessage(error: HttpErrorResponse | Error): string {
    if (!(error instanceof HttpErrorResponse)) {
      return error.message || 'An unexpected error occurred.';
    }

    switch (error.status) {
      case 0:
        return 'Could not connect to the server. Check your connection.';
      case 400:
        return 'Bad request. Please check your input.';
      case 401:
        return 'Unauthorized. Please log in.';
      case 403:
        return 'Access denied.';
      case 404:
        return 'Resource not found.';
      default:
        return 'A server error occurred. Please try again.';
    }
  }
}
