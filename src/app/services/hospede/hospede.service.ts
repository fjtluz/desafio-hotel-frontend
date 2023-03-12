import { Injectable } from '@angular/core';
import {HospedeModel} from "./model/hospede.model";
import {CheckInService} from "../check-in/check-in.service";
import {CheckInModel} from "../check-in/check-in.model";

@Injectable({
  providedIn: 'root'
})
export class HospedeService {
  private VALOR_DIARIA_UTIL = 120.00;
  private VALOR_DIARA_NAO_UTIL = 150.00;
  private ACRESCIMO_UTIL = 15.00;
  private ACRESCIMO_NAO_UTIL = 20.00;

  private todosHospedes = [...HospedeModel.todos()];

  constructor(private checkInService: CheckInService) { }

  buscaTodosHospede(): Array<HospedeModel> {
    this.todosHospedes.forEach((hospede) => this.calculaValores(hospede));
    return this.todosHospedes;
  }

  adicionaNovoHospede(hospede: HospedeModel): void {
    const hospedeExistente = this.todosHospedes.find((h) => h.documento === hospede.documento)
    if (hospedeExistente) {
      const indexOf = this.todosHospedes.indexOf(hospedeExistente);
      this.todosHospedes[indexOf] = hospede;
    } else {
      this.todosHospedes.push(hospede);
    }
  }

  deletaHospede(documento: string) {
    this.checkInService.deletaCheckInPorDocumento(documento);
    this.todosHospedes = this.todosHospedes.filter((h) => h.documento !== documento);
  }

  private calculaValores(hospede: HospedeModel): void {
    const checkInList: Array<CheckInModel> = this.checkInService.checkInPorDocumento(hospede.documento);

    if (checkInList.length) {
      let valorTotal = 0.0;

      let dataUltimaHospedagem = new Date(0)
      let valorUltimaHospedagem = 0.0;

      for (const checkIn of checkInList) {

        let valorHospedagem = 0.0;

        const dataEntrada = new Date(checkIn.dataEntrada);
        const dataSaida = new Date(checkIn.dataSaida);

        dataEntrada.setHours(0, 0, 0, 0);
        dataSaida.setHours(0, 0, 0, 0);

        while (dataEntrada < dataSaida) {

          const isUtil = dataEntrada.getDay() < 5;

          valorHospedagem += isUtil ? this.VALOR_DIARIA_UTIL : this.VALOR_DIARA_NAO_UTIL;

          if (checkIn.possuiVeiculo) {
            valorHospedagem += isUtil ? this.ACRESCIMO_UTIL : this.ACRESCIMO_NAO_UTIL;
          }

          dataEntrada.setDate(dataEntrada.getDate() + 1);
        }

        const diariaExtra = new Date(checkIn.dataSaida);
        diariaExtra.setHours(16, 30, 0, 0);
        if (dataSaida > diariaExtra) {
          const isUtil = dataSaida.getDay() < 5;

          valorHospedagem += isUtil ? this.VALOR_DIARIA_UTIL : this.VALOR_DIARA_NAO_UTIL;
        }

        if (dataSaida > dataUltimaHospedagem) {
          dataUltimaHospedagem = dataSaida;
          valorUltimaHospedagem = valorHospedagem;
        }

        valorTotal += valorHospedagem;
      }
      hospede.valorUltima = valorUltimaHospedagem;
      hospede.valorTotal = valorTotal;
    }
  }

}
