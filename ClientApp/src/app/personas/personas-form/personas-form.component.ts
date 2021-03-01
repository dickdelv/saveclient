import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { IPersona } from '../persona';
import { PersonasService } from '../personas.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-personas-form',
  templateUrl: './personas-form.component.html',
  styleUrls: ['./personas-form.component.css']
})
export class PersonasFormComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private personasService: PersonasService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }


  modoEdicion: boolean = false;
  formGroup: FormGroup;
  personaId: number;
  direccionesABorrar: number[] = [];
  ignorarExistenCambiosPendientes: boolean = false;

  existenCambiosPendientes(): boolean {
    if (this.ignorarExistenCambiosPendientes) { return false; };
    return !this.formGroup.pristine;
  }

  ngOnInit() {
    this.formGroup = this.fb.group({
      Cedula: '',
      Nombre: '',
      Telefono: '',
      Correo: '',
    });

    this.activatedRoute.params.subscribe(params => {
      if (params["id"] == undefined) {
        return;
      }

      this.modoEdicion = true;

      this.personaId = params["id"];

      this.personasService.getPersona(this.personaId.toString())
        .subscribe(persona => this.cargarFormulario(persona),
          error => this.router.navigate(["/personas"]));

    });

  }

  cargarFormulario(persona: IPersona) {

    var dp = new DatePipe(navigator.language);

    this.formGroup.patchValue({
      Cedula: persona.Cedula,
      Nombre: persona.Nombre,
      Telefono: persona.Telefono,
      Correo: persona.Correo,
    });

  }

  save() {
    this.ignorarExistenCambiosPendientes = true;
    let persona: IPersona = Object.assign({}, this.formGroup.value);
    console.table(persona);

    if (this.modoEdicion) {
      // editar el registro
      persona.Id = this.personaId;
      this.personasService.updatePersona(persona)
        .subscribe(persona => this.borrarPersonas(),
          error => console.error(error));
    } else {
      // agregar el registro

      this.personasService.createPersona(persona)
        .subscribe(persona => this.onSaveSuccess(),
          error => console.error(error));
    }
  }
  borrarPersonas() {
    if (this.direccionesABorrar.length === 0) {
      this.onSaveSuccess();
      return;
    }
  }

  onSaveSuccess() {
    this.router.navigate(["/personas"]);
  }
}
