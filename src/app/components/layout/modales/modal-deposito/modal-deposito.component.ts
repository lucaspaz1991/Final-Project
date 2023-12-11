import { Component, Inject, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { Deposito } from 'src/app/interfaces/deposito';
import { DepositoService } from 'src/app/services/deposito.service';
import { UtilidadService } from 'src/app/reutilizable/utilidad.service';
import { Seccion } from 'src/app/interfaces/seccion';
import { SeccionService } from 'src/app/services/seccion.service';
import { Observer } from 'rxjs';

@Component({
  selector: 'app-modal-deposito',
  templateUrl: './modal-deposito.component.html',
  styleUrls: ['./modal-deposito.component.css']
})
export class ModalDepositoComponent implements OnInit{

  formularioDeposito:FormGroup;
  tituloAccion:string = "Agregar";
  botonAccion:string = "Guardar";

  arrayDepositos: Deposito[]=[];
  auxDepositoActual: any;
  aux: number = 0;

  arraySecciones: Seccion[]=[];
  auxSecciones: number = 0;
  
  constructor(
    private modalActual: MatDialogRef<ModalDepositoComponent>,
    @Inject(MAT_DIALOG_DATA) public datosDeposito: Deposito,
    private fb: FormBuilder,
    private depositoService: DepositoService,
    private utilidadService: UtilidadService,
    private seccionService: SeccionService,
  ){

    this.formularioDeposito = this.fb.group({
      codigo : ['',Validators.required],
      direccion : ['',Validators.required],
      ciudad : ['',Validators.required],
      pais : ['',Validators.required],
      capacidadMaxima : ['',Validators.required],

    });

    if(this.datosDeposito != null){

      this.tituloAccion = "Editar";
      this.botonAccion = "Actualizar";
    }

  }

  ngOnInit(): void {
    
    if(this.datosDeposito != null){

      this.formularioDeposito.patchValue({
        codigo : this.datosDeposito.codigo,
        direccion : this.datosDeposito.direccion,
        ciudad :  this.datosDeposito.ciudad,
        pais : this.datosDeposito.pais,
        capacidadMaxima : this.datosDeposito.capacidadMaxima,

      })
    }

    this.ObtenerDepositos();
    this.ObtenerSecciones(this.datosDeposito.id);
    this.ObtenerDepositoActual(this.datosDeposito.id);
  }

  // Editamos deposito actual
  Editardeposito(){

    const deposito: Deposito = {
      id : this.datosDeposito == null ? '' : this.datosDeposito.id,
      codigo : this.formularioDeposito.value.codigo,
      direccion : this.formularioDeposito.value.direccion,
      ciudad : this.formularioDeposito.value.ciudad,
      pais : this.formularioDeposito.value.pais,
      capacidadMaxima : this.formularioDeposito.value.capacidadMaxima,
      ocupacionActual : this.datosDeposito == null ? 0 : this.datosDeposito.ocupacionActual,
      capacidadActual : this.datosDeposito == null ? 0 : this.datosDeposito.capacidadActual,
      fechaCreacion : this.datosDeposito == null ? '' : this.datosDeposito.fechaCreacion
    }

    this.arrayDepositos.forEach(element => {
      console.log("Datos iterados: ", element.codigo, this.formularioDeposito.value.codigo);

      if(element.codigo === deposito.codigo)
        this.aux++;
    });

    this.arraySecciones.forEach(element => {
      console.log("Datos iterados: ", element.capacidadMaxima);

      this.auxSecciones+= element.capacidadMaxima;
    });

    if(this.aux > 0 && (this.auxDepositoActual.codigo != deposito.codigo)){
      this.utilidadService.mostrarAlerta("Codigo del depósito repetido","Error");
    }else 
        if(deposito.capacidadMaxima < 0){
          this.utilidadService.mostrarAlerta("Las dimensiones no pueden ser negativas","Error");
        }else
            if(deposito.capacidadMaxima < deposito.ocupacionActual){
              this.utilidadService.mostrarAlerta("La capacidad del depósito no puede ser menor que su ocupación actual","Error");
            }else
                if(deposito.capacidadMaxima < this.auxSecciones){
                  this.utilidadService.mostrarAlerta("La capacidad del depósito no puede ser menor que la suma de la capacidad de sus secciones: ("+this.auxSecciones+")" ,"Error");
          }else{

          this.depositoService.UpdateDeposito(deposito.id,deposito).subscribe({
            next: (data) => {          
                this.utilidadService.mostrarAlerta("El deposito fue editado","Exito");
                this.modalActual.close("true")        
            },
            error: (e) => {
              this.utilidadService.mostrarAlerta("No se pudo editar el deposito","Error")
            }
          })
        }
    
    this.aux = 0;
    this.auxSecciones = 0;
  }

  // Obtenemos todos los depositos
  ObtenerDepositos(){

    const observer: Observer<Deposito[]> = {
      next: (depositos) => {
        this.arrayDepositos = depositos;
      },
      error: (error) => {
        console.error('Error al obtener los depositos:', error);
      },
      complete: () => {
      }
    };

    this.depositoService.GetAllDepositos().subscribe(observer);
    
  }
  
  // Obtenemos deposito actual
  ObtenerDepositoActual(idDeposito: string){

    const observer: Observer<Deposito> = {
      next: (deposito) => {
        this.auxDepositoActual = deposito;
      },
      error: (error) => {
        console.error('Error al obtener el deposito:', error);
      },
      complete: () => {
      }
    };

    this.depositoService.GetDeposito(idDeposito).subscribe(observer);
    
  }

  // Obtenemos todas las secciones
  ObtenerSecciones(idDeposito: string){

    const observer: Observer<Seccion[]> = {
      next: (secciones) => {
        this.arraySecciones = secciones;
      },
      error: (error) => {
        console.error('Error al obtener los secciones:', error);
      },
      complete: () => {
      }
    };

    this.seccionService.GetAllSecciones(idDeposito).subscribe(observer);
    
  }

  // Listado de paises
  countries: string[] = [
    'Andorra',
    'United Arab Emirates',
    'Afghanistan',
    'Antigua and Barbuda',
    'Anguilla',
    'Albania',
    'Armenia',
    'Angola',
    'Antarctica',
    'Argentina',
    'American Samoa',
    'Austria',
    'Australia',
    'Aruba',
    'Åland',
    'Azerbaijan',
    'Bosnia and Herzegovina',
    'Barbados',
    'Bangladesh',
    'Belgium',
    'Burkina Faso',
    'Bulgaria',
    'Bahrain',
    'Burundi',
    'Benin',
    'Saint Barthélemy',
    'Bermuda',
    'Brunei',
    'Bolivia',
    'Bonaire, Sint Eustatius, and Saba',
    'Brazil',
    'Bahamas',
    'Bhutan',
    'Bouvet Island',
    'Botswana',
    'Belarus',
    'Belize',
    'Canada',
    'Cocos (Keeling) Islands',
    'DR Congo',
    'Central African Republic',
    'Congo Republic',
    'Switzerland',
    'Ivory Coast',
    'Cook Islands',
    'Chile',
    'Cameroon',
    'China',
    'Colombia',
    'Costa Rica',
    'Cuba',
    'Cabo Verde',
    'Curaçao',
    'Christmas Island',
    'Cyprus',
    'Czechia',
    'Germany',
    'Djibouti',
    'Denmark',
    'Dominica',
    'Dominican Republic',
    'Algeria',
    'Ecuador',
    'Estonia',
    'Egypt',
    'Western Sahara',
    'Eritrea',
    'Spain',
    'Ethiopia',
    'Finland',
    'Fiji',
    'Falkland Islands',
    'Micronesia',
    'Faroe Islands',
    'France',
    'Gabon',
    'United Kingdom',
    'Grenada',
    'Georgia',
    'French Guiana',
    'Guernsey',
    'Ghana',
    'Gibraltar',
    'Greenland',
    'The Gambia',
    'Guinea',
    'Guadeloupe',
    'Equatorial Guinea',
    'Greece',
    'South Georgia and South Sandwich Islands',
    'Guatemala',
    'Guam',
    'Guinea-Bissau',
    'Guyana',
    'Hong Kong',
    'Heard and McDonald Islands',
    'Honduras',
    'Croatia',
    'Haiti',
    'Hungary',
    'Indonesia',
    'Ireland',
    'Israel',
    'Isle of Man',
    'India',
    'British Indian Ocean Territory',
    'Iraq',
    'Iran',
    'Iceland',
    'Italy',
    'Jersey',
    'Jamaica',
    'Jordan',
    'Japan',
    'Kenya',
    'Kyrgyzstan',
    'Cambodia',
    'Kiribati',
    'Comoros',
    'St Kitts and Nevis',
    'North Korea',
    'South Korea',
    'Kuwait',
    'Cayman Islands',
    'Kazakhstan',
    'Laos',
    'Lebanon',
    'Saint Lucia',
    'Liechtenstein',
    'Sri Lanka',
    'Liberia',
    'Lesotho',
    'Lithuania',
    'Luxembourg',
    'Latvia',
    'Libya',
    'Morocco',
    'Monaco',
    'Moldova',
    'Montenegro',
    'Saint Martin',
    'Madagascar',
    'Marshall Islands',
    'North Macedonia',
    'Mali',
    'Myanmar',
    'Mongolia',
    'Macao',
    'Northern Mariana Islands',
    'Martinique',
    'Mauritania',
    'Montserrat',
    'Malta',
    'Mauritius',
    'Maldives',
    'Malawi',
    'Mexico',
    'Malaysia',
    'Mozambique',
    'Namibia',
    'New Caledonia',
    'Niger',
    'Norfolk Island',
    'Nigeria',
    'Nicaragua',
    'Netherlands',
    'Norway',
    'Nepal',
    'Nauru',
    'Niue',
    'New Zealand',
    'Oman',
    'Panama',
    'Peru',
    'French Polynesia',
    'Papua New Guinea',
    'Philippines',
    'Pakistan',
    'Poland',
    'Saint Pierre and Miquelon',
    'Pitcairn Islands',
    'Puerto Rico',
    'Palestine',
    'Portugal',
    'Palau',
    'Paraguay',
    'Qatar',
    'Réunion',
    'Romania',
    'Serbia',
    'Russia',
    'Rwanda',
    'Saudi Arabia',
    'Solomon Islands',
    'Seychelles',
    'Sudan',
    'Sweden',
    'Singapore',
    'Saint Helena',
    'Slovenia',
    'Svalbard and Jan Mayen',
    'Slovakia',
    'Sierra Leone',
    'San Marino',
    'Senegal',
    'Somalia',
    'Suriname',
    'South Sudan',
    'São Tomé and Príncipe',
    'El Salvador',
    'Sint Maarten',
    'Syria',
    'Eswatini',
    'Turks and Caicos Islands',
    'Chad',
    'French Southern Territories',
    'Togo',
    'Thailand',
    'Tajikistan',
    'Tokelau',
    'Timor-Leste',
    'Turkmenistan',
    'Tunisia',
    'Tonga',
    'Turkey',
    'Trinidad and Tobago',
    'Tuvalu',
    'Taiwan',
    'Tanzania',
    'Ukraine',
    'Uganda',
    'U.S. Outlying Islands',
    'United States',
    'Uruguay',
    'Uzbekistan',
    'Vatican City',
    'St Vincent and Grenadines',
    'Venezuela',
    'British Virgin Islands',
    'U.S. Virgin Islands',
    'Vietnam',
    'Vanuatu',
    'Wallis and Futuna',
    'Samoa',
    'Kosovo',
    'Yemen',
    'Mayotte',
    'South Africa',
    'Zambia',
    'Zimbabwe',
  ]
}
