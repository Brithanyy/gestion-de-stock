import { Component, inject, OnInit } from '@angular/core';
import { Bebida, CategoriaBebida, TipoBebida } from '../../Models/Bebida';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Alerta } from '../../Services/alerta/alerta';
import { ActivatedRoute, Router } from '@angular/router';
import { ServicioBebidas } from '../../Services/bebidas/servicio-bebidas';
import { Alertas } from '../alertas/alertas';
import { ThisReceiver } from '@angular/compiler';
import { ServicioAutenticacion } from '../../Services/autenticacion/servicio-autenticacion';

@Component({
  selector: 'app-form-drink',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-drink.html',
  styleUrls: ['./form-drink.css']
})
export class FormDrink implements OnInit{

  readonly SERVICIO_BEBIDAS : ServicioBebidas = inject(ServicioBebidas);
  readonly ALERTA : Alerta = inject(Alerta);
  readonly SERVICIO_AUTENTICACION : ServicioAutenticacion = inject(ServicioAutenticacion);


  categorias: CategoriaBebida[] = [
  'Agua','Agua con gas','Agua saborizada','Gaseosa','Energizante','Jugo',
  'Cerveza','Vino','Licor','Whisky','Ron','Vodka','Téquila','Champagne',
  'Cachaca','Granadina','Gin','Aperitivo','Otro','Ninguna'
];

readonly formBuilder : FormBuilder = inject(FormBuilder); 
readonly alerta : Alerta = inject(Alerta);
readonly router : Router = inject(Router);
readonly route : ActivatedRoute = inject(ActivatedRoute);

readonly usuarioSignal = this.SERVICIO_AUTENTICACION.usuario
readonly usuarioActual = this.usuarioSignal();

isEdit = false;
isNew = false;
bebidaID : string | null = null;
bebidaTraida : Bebida | null = null;



editBebidaForm = this.formBuilder.group({
  name: ['', Validators.required],
  type: ['Ninguna', Validators.required],
  category: ['Ninguna', Validators.required],
  brand: ['', Validators.required],
  milliliters: [0, [Validators.required, Validators.min(0)]],
  alcoholContent: [0, [Validators.min(0), Validators.max(100)]],
  price: [0, [Validators.required, Validators.min(0)]],
  stock: [0, [Validators.required, Validators.min(0)]],
  imageUrl: ['', [Validators.required, Validators.pattern(/https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp|svg|bmp)/i)]],
});

newBebidaForm = this.formBuilder.group({
  name: ['', Validators.required],
  type: ['Ninguna', Validators.required],
  category: ['Ninguna', Validators.required],
  brand: ['',Validators.required],
  milliliters: [0, [Validators.required, Validators.min(0)]],
  alcoholContent: [0, [Validators.min(0), Validators.max(100)]],
  price: [0, [Validators.required, Validators.min(0)]],
  stock: [0, [Validators.required, Validators.min(0)]],
  imageUrl: ['', [Validators.required, Validators.pattern(/https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp|svg|bmp)/i)]],
});

// Getters para editBebidaForm
get name() { return this.editBebidaForm.get('name'); }
get type() { return this.editBebidaForm.get('type'); }
get category() { return this.editBebidaForm.get('category'); }
get brand() { return this.editBebidaForm.get('brand'); }
get milliliters() { return this.editBebidaForm.get('milliliters'); }
get alcoholContent() { return this.editBebidaForm.get('alcoholContent'); }
get price() { return this.editBebidaForm.get('price'); }
get stock() { return this.editBebidaForm.get('stock'); }
get imageUrl() { return this.editBebidaForm.get('imageUrl'); }

// Getters para newBebidaForm
get newName() { return this.newBebidaForm.get('name'); }
get newType() { return this.newBebidaForm.get('type'); }
get newCategory() { return this.newBebidaForm.get('category'); }
get newBrand() { return this.newBebidaForm.get('brand'); }
get newMilliliters() { return this.newBebidaForm.get('milliliters'); }
get newAlcoholContent() { return this.newBebidaForm.get('alcoholContent'); }
get newPrice() { return this.newBebidaForm.get('price'); }
get newStock() { return this.newBebidaForm.get('stock'); }
get newImageUrl() { return this.newBebidaForm.get('imageUrl'); }

back () {
  this.router.navigate(['/homePage', this.usuarioActual?.id]);
}

estoyEnEditar() {return this.isEdit; };

estoyEnAgregar() { return this.isNew; };

onSubmitEditar() {
  this.bebidaID = this.route.snapshot.paramMap.get('id');

  if (!this.bebidaID) {
    this.ALERTA.mostrar("ID de la bebida es invalido", "danger");
    return;
  }
  const bebidaActualizada : Bebida = {
    id: this.bebidaTraida?.id,
    name: this.bebidaTraida?.name!,
    type: this.bebidaTraida?.type!,
    category: this.bebidaTraida?.category!,
    brand: this.bebidaTraida?.brand!,
    milliliters: this.bebidaTraida?.milliliters!,
    alcoholContent: this.bebidaTraida?.alcoholContent,
    price: this.bebidaTraida?.price!,
    stock: this.bebidaTraida?.stock!,
    imageUrl: this.bebidaTraida?.imageUrl,
    createdAt: this.bebidaTraida?.createdAt!
  };
  this.SERVICIO_BEBIDAS.putDrink(bebidaActualizada).subscribe({
    next: () => {
      
      this.alerta.mostrar("Bebida actualizada con éxito.", "success");
      this.router.navigate(['/homePage', this.usuarioActual?.id]);
    },

    error: () => { this.alerta.mostrar("Error al actualizar la bebida.", "danger"); }
    });
 
}

onSubmitAgregar() {
  const nuevaBebida = {
    name: this.newBebidaForm.value.name!,
    type: this.newBebidaForm.value.type! as TipoBebida,
    category: this.newBebidaForm.value.category! as CategoriaBebida,
    brand: this.newBebidaForm.value.brand!,
    milliliters: this.newBebidaForm.value.milliliters!,
    alcoholContent: this.newBebidaForm.value.alcoholContent!,
    price: this.newBebidaForm.value.price!,
    stock: this.newBebidaForm.value.stock!,
    imageUrl: this.newBebidaForm.value.imageUrl!,
    createdAt: new Date()
  }
  this.SERVICIO_BEBIDAS.postDrink(nuevaBebida).subscribe({
     next: () => { this.router.navigate(['/homePage', this.usuarioActual?.id]) },
    error: () => { this.ALERTA.mostrar("Error al agregar la bebida", "danger"); }
  });
  }

ngOnInit(): void {
  // Si la ruta tiene un param 'id' asumimos modo edición, si no -> nuevo
  const id = this.route.snapshot.paramMap.get('id');
  this.isEdit = !!id;
  this.isNew = !id;

  this.setearFormulario();
  }

  setearFormulario() {
    this.bebidaID = this.route.snapshot.paramMap.get('id');

    if(this.bebidaID !== null ) {
      this.SERVICIO_BEBIDAS.getDrink(this.bebidaID).subscribe({
        next : (bebida) => {
          this.bebidaTraida = bebida;
          this.editBebidaForm.patchValue({
            name: this.bebidaTraida.name,
            type: this.bebidaTraida.type,
            category: this.bebidaTraida.category,
            brand: this.bebidaTraida.brand,
            milliliters: this.bebidaTraida.milliliters,
            alcoholContent: this.bebidaTraida.alcoholContent,
            price: this.bebidaTraida.price,
            stock: this.bebidaTraida.stock,
            imageUrl: this.bebidaTraida.imageUrl
          });
        },
        error: () => { this.ALERTA.mostrar("Error al cargar la bebida.", "danger"); }
      })
    }
  }

}
