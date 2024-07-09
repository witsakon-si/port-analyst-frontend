import {HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest} from "@angular/common/http";
import {inject} from "@angular/core";
import {AuthService} from "./auth.service";
import {catchError, throwError} from "rxjs";

export const authenticationInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const authService = inject(AuthService);
  const authToken = authService.getToken();
  if (authToken) {
    req = req.clone({
      setHeaders: {
        ['Authorization']: `Bearer ${authToken}`,
      },
    });
  }

  return next(req)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 403) {
          authService.logout();
        }

        const errorMessage = JSON.stringify(error.error, null, '\t');
        console.error(errorMessage);
        authService.logout();

        return throwError(() => error);
      })
    )

}
