type TipoMovimiento = 'Ingreso' | 'Egreso';

export interface Movimiento {

  id?: string | undefined;
  idDrink: string;              
  nameDrink: string;          
  typeMotion: TipoMovimiento; 
  amount: number;              
  movementDate: Date;         
  idUser: string | undefined;             
  nameUser: string;         
}
