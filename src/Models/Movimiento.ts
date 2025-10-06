type TipoMovimiento = 'ingreso' | 'egreso';

export interface Movimiento {

  id: string;
  idDrink: string;              // referencia a la bebida - no se muestra
  nameDrink: string;          // para mostrar el nombre de la  bebida
  typeMotion: TipoMovimiento; // ingreso o egreso
  amount: number;              // cuántas unidades se movieron
  movementDate: Date;         // la fecha del movimiento.
  idUser: string;             // referencia al usuario - no se muestra
  nameUser: string;         // para mostrar el nombre del usuario

}
