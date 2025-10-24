export type TipoBebida = 'Con alcohol' | 'Sin alcohol' | 'Ninguna';
export type CategoriaBebida = 'Agua'| 'Agua con gas' | 'Agua saborizada' | 'Gaseosa' | 'Energizante' | 'Jugo' | 'Cerveza' | 'Vino' | 'Licor' | 'Whisky' | 'Ron' | 'Vodka' | 'Téquila' | 'Champagne' | 'Cachaca' | 'Granadina' | 'Gin' | 'Aperitivo' | 'Otro' | 'Ninguna';

export interface Bebida {

    id?: string;
    name: string;
    type: TipoBebida;
    category: CategoriaBebida;
    brand: string;
    milliliters: number;
    alcoholContent?: number; // porcentaje de alcohol
    price: number; //Precio de compra
    stock: number; // cantidad disponible
    imageUrl?: string; // URL de la imagen de la bebida
    createdAt: Date; // fecha de creación

}