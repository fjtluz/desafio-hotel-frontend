import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-check-in',
  templateUrl: './check-in.component.html',
  styleUrls: ['./check-in.component.scss']
})
export class CheckInComponent implements OnInit{

  invalid(control: string): boolean {
    if (!this || !this.formGroup) {
      return false;
    }

    this.formGroup.get(control)?.markAsDirty()
    this.formGroup.get(control)?.updateValueAndValidity();

    return this.formGroup.get(control)?.invalid || false;
  }

  displayCalendar = false;

  formGroup!: FormGroup;

  hospedes = [
    {
      nome: 'Francisco',
      documento: '1',
      valorTotal: 1.32,
      valorUltima: 1,
    },
    {
      nome: 'Ana',
      documento: '2',
      valorTotal: 7.46,
      valorUltima: 4,
    },
    {
      nome: 'Oscar',
      documento: '10',
      valorTotal: 7.46,
      valorUltima: 4,
    },
    {
      nome: 'Thiem',
      documento: '3',
      valorTotal: 7.46,
      valorUltima: 4,
    },
    {
      nome: 'Maycon Mendes',
      documento: '4',
      valorTotal: 7.46,
      valorUltima: 4,
    },
    {
      nome: 'Wesley',
      documento: '5',
      valorTotal: 7.46,
      valorUltima: 4,
    },
    {
      nome: 'Gabriel',
      documento: '6',
      valorTotal: 7.46,
      valorUltima: 4,
    },
    {
      nome: 'Ester',
      documento: '7',
      valorTotal: 7.46,
      valorUltima: 4,
    },
    {
      nome: 'Isaac',
      documento: '8',
      valorTotal: 7.46,
      valorUltima: 4,
    },
  ]
  todosHospedes = [
    {
      nome: 'Francisco',
      documento: '1',
      valorTotal: 1.32,
      valorUltima: 1,
    },
    {
      nome: 'Ana',
      documento: '2',
      valorTotal: 7.46,
      valorUltima: 4,
    },
    {
      nome: 'Oscar',
      documento: '10',
      valorTotal: 7.46,
      valorUltima: 4,
    },
    {
      nome: 'Thiem',
      documento: '3',
      valorTotal: 7.46,
      valorUltima: 4,
    },
    {
      nome: 'Maycon Mendes',
      documento: '4',
      valorTotal: 7.46,
      valorUltima: 4,
    },
    {
      nome: 'Wesley',
      documento: '5',
      valorTotal: 7.46,
      valorUltima: 4,
    },
    {
      nome: 'Gabriel',
      documento: '6',
      valorTotal: 7.46,
      valorUltima: 4,
    },
    {
      nome: 'Ester',
      documento: '7',
      valorTotal: 7.46,
      valorUltima: 4,
    },
    {
      nome: 'Isaac',
      documento: '8',
      valorTotal: 7.46,
      valorUltima: 4,
    },
  ]

  checkIn = [
    {
      documento: '1',
      dataEntrada: new Date(2020, 3, 4),
      dataSaida: new Date(2020, 3, 5)
    }
  ]

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.montaCheckInFormGroup();
  }

  montaCheckInFormGroup(): void {
    this.formGroup = this.formBuilder.group({
      dataEntrada: [{value: null, disabled: false}, [this.saidaAntesDeEntrada]],
      dataSaida: [{value: null, disabled: false}, [this.saidaAntesDeEntrada]],
      hospede: [{value: null, disabled: false}],
      possuiVeiculo: [{value: null, disabled: false}],
      filtro: [{ value: 'T', disabled: false }]
    });
  }

  saidaAntesDeEntrada(control: AbstractControl): { anterior: boolean } | null {

    if (!control.parent) {
      return null;
    }

    const parent = control.parent as FormGroup;

    const dataEntrada = parent.get('dataEntrada')?.value as Date;
    const dataSaida = parent.get('dataSaida')?.value as Date;

    return dataSaida && dataEntrada && dataSaida < dataEntrada ? {anterior: true} : null;
  }
}
