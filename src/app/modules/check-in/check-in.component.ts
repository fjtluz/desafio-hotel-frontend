import {Component} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HospedeModel} from "../../services/hospede/model/hospede.model";
import {HospedeService} from "../../services/hospede/hospede.service";
import {CheckInService} from "../../services/check-in/check-in.service";
import {CheckInModel} from "../../services/check-in/check-in.model";
import {ConfirmationService} from "primeng/api";

@Component({
  selector: 'app-check-in',
  templateUrl: './check-in.component.html',
  styleUrls: ['./check-in.component.scss'],
  providers: [ConfirmationService]
})
export class CheckInComponent {

  displayModalPessoas = false;
  displayPessoasConfirmacao = false;

  formGroup: FormGroup;

  hospedes: Array<HospedeModel> = [];
  todosHospedes: Array<HospedeModel> = [];
  checkInsHoje: Array<CheckInModel> = [];

  displayErrorDialog = false;
  messageErrorDialog = '';

  // Inicialização

  constructor(
    private formBuilder: FormBuilder,
    private hospedeService: HospedeService,
    private checkInService: CheckInService,
    private confirmationService: ConfirmationService
  ) {
    this.formGroup = this.montaFormGroup()
    this.filtroPessoas('T');

    this.formGroup.get('consultas')?.get('filtro')?.valueChanges.subscribe(this.filtroPessoas.bind(this));
  }

  montaFormGroup(): FormGroup {
    return this.formBuilder.group({
      novaPessoa: this.formBuilder.group({
        documento: [{ value: null, disabled: false }],
        nome: [{ value: null, disabled: false }],
        telefone: [{ value: null, disabled: false }],
      }),
      checkIn: this.formBuilder.group({
        dataEntrada: [{ value: null, disabled: false }, [this.saidaAntesDeEntrada]],
        dataSaida: [{ value: null, disabled: false }],
        hospede: [{ value: null, disabled: false }],
        possuiVeiculo: [{ value: false, disabled: false }]
      }),
      consultas: this.formBuilder.group({
        filtro: [{ value: 'T', disabled: false }]
      })
    });
  }

  // Funcionais

  mostrarModalPessoa(): void {
    this.displayModalPessoas = true;
  }

  fecharModalPessoa(): void {
    const novaPessoaFG = this.formGroup.get('novaPessoa') as FormGroup;

    const documento = novaPessoaFG.get('documento')?.value;

    if (documento) {
      this.displayModalPessoas = true;
      this.confirmationService.confirm({
        acceptLabel: 'Salvar',
        accept: () => this.salvarModalConfirm(),
        rejectLabel: 'Cancelar',
        reject: () => this.fecharModalConfirm(),
      })
    } else {
      const novaPessoaFG = this.formGroup.get('novaPessoa') as FormGroup;

      novaPessoaFG.controls['nome'].reset();
      novaPessoaFG.controls['nome'].clearValidators();

      novaPessoaFG.controls['telefone'].reset();
    }
  }

  salvarModalConfirm(): void {
    this.salvaNovaPessoa();
  }

  fecharModalConfirm(): void {

    const novaPessoaFG = this.formGroup.get('novaPessoa') as FormGroup;

    novaPessoaFG.controls['documento'].reset();
    novaPessoaFG.controls['documento'].clearValidators();

    this.fecharModalPessoa();
    this.displayModalPessoas = false;
  }

  salvaNovaPessoa(): void {
    const novaPessoaFG = this.formGroup.get('novaPessoa') as FormGroup;

    for (const i of Object.keys(novaPessoaFG.controls)) {
      if (i !== 'telefone') {
        const control = novaPessoaFG.get(i);

        control?.setValidators([Validators.required]);
        control?.markAsDirty();
        control?.updateValueAndValidity();
      }
    }

    if (novaPessoaFG.invalid) {
      this.messageErrorDialog = 'Campos preenchidos incorretamente';
      this.displayErrorDialog = true;
      throw Error();
    }

    const documento = novaPessoaFG.get('documento')?.value;
    const nome = novaPessoaFG.get('nome')?.value;
    const telefone = novaPessoaFG.get('telefone')?.value;

    const inserir = this.hospedeService.adicionaNovoHospede(new HospedeModel(documento, nome, telefone));
    inserir.subscribe(() => {
      this.displayModalPessoas = false;
      this.filtroPessoas(this.formGroup.get('consultas')?.get('filtro')?.value)

      novaPessoaFG.get('documento')?.reset();
      novaPessoaFG.get('nome')?.reset();
      novaPessoaFG.get('telefone')?.reset();
    });
  }

  deletaPessoa(documento: string): void {
    this.hospedeService.deletaHospede(documento).subscribe(() => {
      this.filtroPessoas(this.formGroup.get('consultas')?.get('filtro')?.value)
    });
  }

  filtroPessoas(selecionado: string) {
    switch (selecionado) {
      case 'P':
        this.hospedeService.presentes().subscribe((ret) => {
          this.hospedes = ret.retorno;
        })
        break;
      case 'A':
        this.hospedeService.ausentes().subscribe((ret) => {
          this.hospedes = ret.retorno;
        })
        break;
      case 'T':
        this.hospedeService.buscaTodosHospede().subscribe((r) => {
          this.todosHospedes = r.retorno;
          this.hospedes = r.retorno;
        })
        break;
    }
  }


  salvaCheckIn(): void {
    const checkIn = this.formGroup.get('checkIn') as FormGroup;

    for (const i of Object.keys(checkIn.controls)) {
      const control = checkIn.get(i);
      let validators = [Validators.required];

      if (['dataEntrada', 'dataSaida'].includes(i)) {
        validators.push(this.saidaAntesDeEntrada)
      }

      control?.setValidators(validators);

      control?.markAsDirty();
      control?.updateValueAndValidity();
    }

    if (checkIn.invalid) {
      this.messageErrorDialog = 'Campos preenchidos incorretamente';
      this.displayErrorDialog = true;
      throw Error();
    }

    const hospede = checkIn?.get('hospede')?.value as HospedeModel;
    const dataEntrada = checkIn?.get('dataEntrada')?.value as Date;
    const dataSaida = checkIn?.get('dataSaida')?.value as Date;
    const possuiVeiculo = checkIn?.get('possuiVeiculo')?.value as boolean;

    this.checkInService
      .adicionaCheckIn(new CheckInModel(hospede, dataEntrada, dataSaida, possuiVeiculo))
      .subscribe((ret) => {
        if (ret.mensagem !== 'OK') {
          this.messageErrorDialog = ret.mensagem;
          this.displayErrorDialog = true;
        } else {
          this.filtroPessoas(this.formGroup.get('consultas')?.get('filtro')?.value)

          for (const i of Object.keys(checkIn.controls)) {
            checkIn.controls[i].reset();
            checkIn.controls[i].clearValidators();
          }
        }
      });
  }

  // Validadores customizados

  saidaAntesDeEntrada(control: AbstractControl): { anterior: boolean } | null {

    if (!control.parent) {
      return null;
    }

    const parent = control.parent as FormGroup;

    const dataEntrada = parent.get('dataEntrada')?.value as Date;
    const dataSaida = parent.get('dataSaida')?.value as Date;

    return dataSaida && dataEntrada && dataSaida < dataEntrada ? {anterior: true} : null;
  }

  // Utilitários

  invalid(formGroup: string, nome: string): boolean {
    if (!this || !this.formGroup) {
      return false;
    }

    const control = this.formGroup.get(formGroup)?.get(nome);

    control?.markAsDirty()
    control?.updateValueAndValidity();

    return control?.invalid || false;
  }
}
