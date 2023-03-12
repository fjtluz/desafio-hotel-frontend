import { Injectable } from '@angular/core';
import {HospedeModel} from "./model/hospede.model";
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from "rxjs";
import {Retorno} from "../../models/retorno";

@Injectable({
  providedIn: 'root'
})
export class HospedeService {

  private baseURL = 'http://localhost:8080/hospede'
  private get headers(): HttpHeaders {
    return new HttpHeaders()
      .set('Access-Control-Allow-Headers', '*')
      .set('Access-Control-Allow-Origin', '*')
      .set('Content-Type', 'application/json')
      .set('Accept', '*/*')
  }

  constructor(private http: HttpClient) { }

  buscaTodosHospede(): Observable<Retorno<Array<HospedeModel>>> {
    return this.http.get<Retorno<Array<HospedeModel>>>(this.baseURL, { headers: this.headers });
  }

  presentes(): Observable<Retorno<Array<HospedeModel>>> {
    return this.http.get<Retorno<Array<HospedeModel>>>(`${this.baseURL}/presentes`, { headers: this.headers });
  }

  ausentes(): Observable<Retorno<Array<HospedeModel>>> {
    return this.http.get<Retorno<Array<HospedeModel>>>(`${this.baseURL}/ausentes`, { headers: this.headers });
  }

  adicionaNovoHospede(hospede: HospedeModel): Observable<Retorno<HospedeModel>> {
    return this.http.post<Retorno<HospedeModel>>(this.baseURL, hospede, { headers: this.headers });
  }

  deletaHospede(documento: string) {
    return this.http.delete(this.baseURL, { params: { documento }, headers: this.headers });
  }

}
