import { Injectable } from '@angular/core';
import {CheckInModel} from "./check-in.model";

@Injectable({
  providedIn: 'root'
})
export class CheckInService {

  private todosCheckIns: Array<CheckInModel> = []

  constructor() { }

  adicionaCheckIn(checkIn: CheckInModel): string {
    const validacao = this.checkInInvalido(checkIn);

    if (validacao !== 'OK') {
      return validacao;
    }
    this.todosCheckIns.push(checkIn);
    console.log(this.todosCheckIns)
    return 'OK';
  }

  checkInPorDocumento(documento: string): Array<CheckInModel> {
    return this.todosCheckIns.filter((checkIn) => checkIn.hospede.documento === documento);
  }

  checkInsHoje(): Array<CheckInModel> {
    return this.todosCheckIns.filter((ci) => ci.dataEntrada <= new Date() && ci.dataSaida >= new Date());
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
