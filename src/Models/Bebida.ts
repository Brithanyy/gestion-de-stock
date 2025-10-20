type TipoBebida = 'alcoholica' | 'no_alcoholica' | 'ninguna';
type CategoriaBebida = 'agua'| 'agua con gas' | 'agua saborizada' | 'gaseosa' | 'energizante' | 'jugo' | 'cerveza' | 'vino' | 'licor' | 'whisky' | 'ron' | 'vodka' | 'tequila' | 'champagne' | 'cachaca' | 'granadina' | 'gin' | 'aperitivo' | 'otro' | 'ninguna';

export interface Bebida {

    id: string;
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