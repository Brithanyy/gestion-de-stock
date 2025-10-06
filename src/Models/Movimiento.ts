type TipoMovimiento = 'ingreso' | 'egreso';

export interface Movimiento {

  id: string;
  idBebida: string;              // referencia a la bebida - no se muestra
  nombreBebida: string;          // para mostrar el nombre de la  bebida
  tipoMovimiento: TipoMovimiento; // ingreso o egreso
  cantidad: number;              // cuántas unidades se movieron
  fechaMovimiento: Date;         // la fecha del movimiento.
  idUsuario: string;             // referencia al usuario - no se muestra
  nombreUsuario: string;         // para mostrar el nombre del usuario

}
///PONER ATRIBUTOS EN INGLES