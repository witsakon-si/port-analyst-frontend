import {HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest} from "@angular/common/http";
import {inject} from "@angular/core";
import {AuthService} from "./auth.service";
import {catchError, finalize, throwError} from "rxjs";
import {LoadingService} from "../service/loadingService";

export const authenticationInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const authService = inject(AuthService);
  const authToken = authService.getToken();
  const loadingService = inject(LoadingService);
  loadingService.setLoading(true);
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
        else if (error.status === 401) {
          alert('Invalid username or password');
          authService.logout();
        }

        const errorMessage = JSON.stringify(error.error, null, '\t');
        console.error(errorMessage);

        return throwError(() => error);
      }), finalize(() => {
        loadingService.setLoading(false);
      })
    )

}
