type TipoPerfil = 'admin' | 'usuario';

export interface Usuario {

    id: string;
    username: string;
    password: string;
    profile: TipoPerfil;
    isLoggedIn: boolean;
    avatarUrl?: string;

}
