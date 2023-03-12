import {HospedeModel} from "../hospede/model/hospede.model";

export class CheckInModel {
  hospede: HospedeModel;
  dataEntrada: Date;
  dataSaida: Date;
  possuiVeiculo: boolean;


  constructor(hospede: HospedeModel, dataEntrada: Date, dataSaida: Date, possuiVeiculo: boolean) {
    this.hospede = hospede;
    this.dataEntrada = dataEntrada;
    this.dataSaida = dataSaida;
    this.possuiVeiculo = possuiVeiculo;
  }
}
