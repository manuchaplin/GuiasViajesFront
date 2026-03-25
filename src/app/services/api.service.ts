import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  readonly BASE_URL = 'https://guiasviajes.azurewebsites.net/api/';

  constructor(private readonly http: HttpClient) {}

  // Solicitar una guia
  public requestGuide(data: any): Observable<any> {
    return this.http.post<any>(this.BASE_URL +'Guias/solicitar', data);
  }

  // Envío correo
  public sendMail(data: any): Observable<any> {
    return this.http.post<any>(this.BASE_URL +'Guias/envioCorreo', data);
  }

}
