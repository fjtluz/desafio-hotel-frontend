import {ComponentFixture, fakeAsync, flush, TestBed, tick} from '@angular/core/testing';

import { CheckInComponent } from './check-in.component';
import {SharedModule} from "../shared/shared.module";
import {ReactiveFormsModule} from "@angular/forms";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {HospedeModel} from "../../services/hospede/model/hospede.model";

describe('CheckInComponent', () => {
  let component: CheckInComponent;
  let fixture: ComponentFixture<CheckInComponent>;
  let compiled: HTMLElement;

  const abrirModalPessoas = () => {
    const incluirPessoas = compiled.querySelector('#inclui-pessoa') as HTMLDivElement;
    const incluirButton = incluirPessoas.querySelector('p-button') as HTMLButtonElement;

    incluirButton.click();
    tick();

    fixture.detectChanges();
  }
  const adicionaNovaPessoa = (hospede: HospedeModel) => {
    const incluirPessoas = compiled.querySelector('#inclui-pessoa') as HTMLDivElement;

    const formGrid = incluirPessoas.querySelector('.formgrid') as HTMLDivElement;

    const divs = formGrid.querySelectorAll('div');

    const inputDocumento = divs.item(0).querySelector('input') as HTMLInputElement;
    const inputNome = divs.item(1).querySelector('input') as HTMLInputElement;
    const inputTelefone = divs.item(2).querySelector('input') as HTMLInputElement;

    inputDocumento.value = hospede.documento;
    inputDocumento.dispatchEvent(new Event('input'));

    inputNome.value = hospede.nome;
    inputNome.dispatchEvent(new Event('input'));

    inputTelefone.value = hospede.telefone;
    inputTelefone.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    const salvarButton = formGrid.querySelector('p-button') as HTMLButtonElement;
    salvarButton.click();
    tick();

    fixture.detectChanges();
  }

  const selecionaDataCalendario = (calendar: HTMLElement, date: Date) => {
    const calendarioInput = calendar.querySelector('input');

    calendarioInput?.click();
    tick();
    fixture.detectChanges();

    const datetimePicker = calendar.querySelector('.p-datepicker') as HTMLDivElement;

    let datepicker = datetimePicker.querySelector('.p-datepicker-group') as HTMLDivElement;

    const datepickerHeader = datepicker.querySelector('.p-datepicker-header') as HTMLDivElement;
    const datepickerYear = datepickerHeader.querySelector('.p-datepicker-year') as HTMLButtonElement;

    datepickerYear.click();
    tick();
    fixture.detectChanges();

    const decadeSpan = datepickerHeader.querySelector('.p-datepicker-decade') as HTMLSpanElement;
    let start = Number.parseInt(decadeSpan.textContent?.trim().split('-')[0] as string);
    let end = Number.parseInt(decadeSpan.textContent?.trim().split('-')[1] as string);

    if (date.getFullYear() < start || date.getFullYear() > end) {
      const direction = date.getFullYear() < start ? 'L' : 'R';

      while (date.getFullYear() < start || date.getFullYear() > end) {
        (datepickerHeader.querySelector('.p-datepicker-' + (direction === 'L' ? 'prev' : 'next')) as HTMLButtonElement).click();
        tick()
        fixture.detectChanges();

        const decadeSpan = datepickerHeader.querySelector('.p-datepicker-decade') as HTMLSpanElement;
        start = Number.parseInt(decadeSpan.textContent?.trim().split('-')[0] as string);
        end = Number.parseInt(decadeSpan.textContent?.trim().split('-')[1] as string);
      }
    }

    const yearPicker = datetimePicker.querySelector('.p-yearpicker');
    const years = yearPicker?.querySelectorAll('span');

    years?.forEach((year) => {
      if (Number.parseInt(year.textContent as string) === date.getFullYear()) {
        year.click();
        tick();
        fixture.detectChanges();
      }
    })

    const monthPicker = datetimePicker.querySelector('.p-monthpicker');
    const months = monthPicker?.querySelectorAll('span');

    months?.forEach((month, idx) => {
      if (idx === date.getMonth()) {
        month.click();
        tick();
        fixture.detectChanges();
      }
    })

    datepicker = datetimePicker.querySelector('.p-datepicker-group') as HTMLDivElement;
    const datepickerCalendar = datepicker.querySelector('table')?.querySelector('tbody')?.querySelectorAll('tr');

    datepickerCalendar?.forEach((row) => {
      const cells = row.querySelectorAll('td');
      cells.forEach((cell) => {
        const span = cell.querySelector('span');
        if (Number.parseInt(span?.textContent as string) === date.getDate()) {
          span?.click()
          tick();
          fixture.detectChanges();
        }
      })
    })

    calendar.blur();
  }
  const selecionaDropdown = (dropdown: HTMLElement, index: number) => {
    const dropDownTrigger = dropdown?.querySelector('.p-dropdown-trigger') as HTMLSpanElement;
    dropDownTrigger.click();
    tick();
    const optionsHospede = dropdown?.querySelectorAll('p-dropdownItem')
    const selectedOption = optionsHospede?.item(index).querySelector('span');
    selectedOption?.click();
    tick();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ReactiveFormsModule, SharedModule, BrowserAnimationsModule ],
      declarations: [ CheckInComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    compiled = fixture.nativeElement as HTMLElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have div #inclui-pessoa', () => {
    const divIncluiPessoas = compiled.querySelector('div');
    expect(divIncluiPessoas).toBeTruthy();
    expect(divIncluiPessoas?.id).toEqual('inclui-pessoa')
  })

  it('#incluir-pessoa content should be p-button, p-dialog and p-confirmdialog', () => {
    const incluirPessoas = compiled.querySelector('#inclui-pessoa');

    const pButton = incluirPessoas?.querySelector('p-button');
    expect(pButton).toBeTruthy();

    const pDialog = incluirPessoas?.querySelector('p-dialog')
    expect(pDialog).toBeTruthy();

    const pDialogConfirm = incluirPessoas?.querySelector('p-confirmDialog')
    expect(pDialogConfirm).toBeTruthy()
  })

  it('#incluir-pessoas > p-button should have text "Incluir/Alterar Pessoa"', () => {
    const incluirPessoas = compiled.querySelector('#inclui-pessoa');
    const pButton = incluirPessoas?.querySelector('p-button');

    expect(pButton?.textContent).toEqual('Incluir/Alterar Pessoa');
  })

  it('#incluir-pessoas > p-button should have event (click) that calls "mostrarModalPessoa()"', fakeAsync(() => {
    spyOn(component, 'mostrarModalPessoa')

    const incluirPessoas = fixture.debugElement.nativeElement.querySelector('#inclui-pessoa')
    const pButton = incluirPessoas?.querySelector('p-button') as HTMLButtonElement;
    pButton.click();

    tick();
    expect(component.mostrarModalPessoa).toHaveBeenCalled()
  }));

  it('#incluir-pessoas p-dialog should have formGroupName', () => {
    const incluirPessoas = fixture.debugElement.nativeElement.querySelector('#inclui-pessoa') as HTMLElement;
    const pDialog = incluirPessoas.querySelector('p-dialog');

    expect(pDialog?.hasAttributes).toBeTruthy();
    expect(pDialog?.hasAttribute('formGroupName')).toBeTruthy()
    expect(pDialog?.getAttribute('formGroupName')).toEqual('novaPessoa');
  });

  it('#incluir-pessoas p-dialog should have 3 inputs and a button', fakeAsync(() => {
    abrirModalPessoas();

    const incluirPessoas = fixture.debugElement.nativeElement.querySelector('#inclui-pessoa');
    const formGrid = incluirPessoas?.querySelector('.formgrid') as HTMLDivElement;

    const labels = ['Documento', 'Nome', 'Telefone'];

    formGrid?.querySelectorAll('div').forEach((div, idx) => {
      const label = div.querySelector('label');
      const input = div.querySelector('input');

      expect(label?.textContent).toEqual(labels[idx]);
      expect(input?.getAttribute('formControlName')).toEqual(labels[idx].toLowerCase());
    })

    const button = formGrid?.querySelector('p-button') as HTMLButtonElement;

    spyOn(component, 'salvaNovaPessoa')

    button.click();
    tick();

    expect(component.salvaNovaPessoa).toHaveBeenCalled();
  }))

  it('#incluir-pessoas p-dialog should have validators', fakeAsync(() => {
    abrirModalPessoas();

    const incluirPessoas = compiled.querySelector('#inclui-pessoa') as HTMLDivElement;
    const formGrid = incluirPessoas.querySelector('.formgrid') as HTMLDivElement;
    const salvaButton = formGrid.querySelector('p-button') as HTMLButtonElement;

    salvaButton.click();
    tick();

    expect(component.salvaNovaPessoa).toThrowError();
    expect(component.invalid('novaPessoa', 'documento')).toBeTrue();
    expect(component.invalid('novaPessoa', 'nome')).toBeTrue();
  }))

  it('should add another hospede', fakeAsync(() => {
    abrirModalPessoas();

    expect(component.hospedes.length).toEqual(HospedeModel.todos().length);

    const novaPessoa = new HospedeModel('333.333.333-33', 'Ana Gomes', '333333333');
    adicionaNovaPessoa(novaPessoa)

    expect(component.hospedes.length).toEqual(HospedeModel.todos().length+1);
    expect(component.hospedes.at(component.hospedes.length-1)).toEqual(novaPessoa)
    expect(component.displayModalPessoas).toBeFalse();
  }))

  it('should add a check-in', fakeAsync(() => {

    const cardCheckIn = compiled.querySelector('p-card');

    const formGrid = cardCheckIn?.querySelector('.formgrid') as HTMLDivElement;

    const divs = formGrid.querySelectorAll('.field');

    const dataEntrada = divs.item(0).querySelector('p-calendar') as HTMLElement;
    const dataSaida = divs.item(1).querySelector('p-calendar') as HTMLElement;
    const hospede = divs.item(2).querySelector('p-dropdown') as HTMLElement;
    const possuiVeiculo = divs.item(3).querySelector('p-checkbox') as HTMLElement;

    selecionaDataCalendario(dataEntrada, new Date());
    selecionaDataCalendario(dataSaida, new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 8));

    selecionaDropdown(hospede, 0);

    const checkboxInput = possuiVeiculo.querySelector('input');
    checkboxInput?.click();

    const salvarButton = formGrid.querySelector('p-button') as HTMLButtonElement;

    spyOn(component, 'salvaCheckIn');

    salvarButton.click()
    tick();
    fixture.detectChanges();

    expect(component.salvaCheckIn).toHaveBeenCalled();

    flush()
  }))
});
