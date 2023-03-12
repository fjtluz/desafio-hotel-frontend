import { Injectable } from '@angular/core';
import {CheckInModel} from "./check-in.model";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Retorno} from "../../models/retorno";

@Injectable({
  providedIn: 'root'
})
export class CheckInService {

  private baseURL = 'http://localhost:8080/check-in';

  private todosCheckIns: Array<CheckInModel> = []

  constructor(private http: HttpClient) { }

  adicionaCheckIn(checkIn: CheckInModel): Observable<Retorno<CheckInModel>> {
    return this.http.post<Retorno<CheckInModel>>(this.baseURL, checkIn);
  }

  checkInPorDocumento(documento: string): Array<CheckInModel> {
    return this.todosCheckIns.filter((checkIn) => checkIn.hospede.documento === documento);
  }

  deletaCheckInPorDocumento(documento: string): void {
    this.todosCheckIns = this.todosCheckIns.filter((ci) => ci.hospede.documento !== documento);
  }

  checkInInvalido(checkIn: CheckInModel): string {
    const mesmoCheckIn = this.todosCheckIns
      .find((ci) =>
        ci.hospede === checkIn.hospede &&
        ci.dataEntrada === checkIn.dataEntrada &&
        ci.dataSaida === checkIn.dataSaida
      );

    const checkInInvalido = this.todosCheckIns
      .find((ci) =>
        ci.hospede === checkIn.hospede &&
        (checkIn.dataEntrada > ci.dataEntrada && checkIn.dataEntrada < ci.dataSaida) ||
        (checkIn.dataSaida > ci.dataEntrada && checkIn.dataSaida < ci.dataSaida)
      );

    if (mesmoCheckIn) {
      return 'Já existe um checkIn com estas informações!';
    } else if (checkInInvalido) {
      return 'Check In inválido. Data de entrada ou data de saída ocorrem durante um check in já existente.';
    } else {
      return 'OK';
    }
  }
}
