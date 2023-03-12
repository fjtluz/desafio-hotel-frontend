export class HospedeModel {
  documento: string;
  nome: string;
  telefone: string;
  valorTotal: number;
  valorUltima: number

  constructor(documento: string, nome: string, telefone: string) {
    this.documento = documento;
    this.nome = nome;
    this.telefone = telefone;
    this.valorTotal = 0;
    this.valorUltima = 0;
  }

  static todos(): Array<HospedeModel> {
    return [
      new HospedeModel('000.000.000-00', 'Francisco Luz', '000000000'),
      new HospedeModel('111.111.111-11', 'Maycon Mendes', '111111111'),
      new HospedeModel('222-222-222-22', 'Wesley Amaral', '222222222'),
    ]
  }
}
