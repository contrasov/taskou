import { fetchGraphQL, getToken } from './graphqlClient';

export interface RegisterInput {
    username: string;
    email: string;
    password: string;
}

export interface LoginInput {
    email: string;
    password: string;
}

export interface User {
    id: string;
    username: string;
    email: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export class AuthService {
    static async login(login: LoginInput): Promise<AuthResponse> {
        const mutation = `
            mutation Login($loginInput: LoginDto!) {
                login(loginInput: $loginInput) {
                    token
                    user {
                        id
                        username
                        email
                    }
                }
            }
        `;

        const data = await fetchGraphQL<{ login: AuthResponse }>(mutation, { loginInput: login });

        if (!data.login) {
            throw new Error('Erro ao fazer login');
        }

        const auth = data.login;
        localStorage.setItem('auth_token', auth.token);
        localStorage.setItem('user', auth.user.username);

        return auth;
    }

    static async register(register: RegisterInput): Promise<AuthResponse> {
        const mutation = `
            mutation Register($registerInput: RegisterDto!) {
                register(registerInput: $registerInput) {
                    token
                    user {
                        id
                        username
                        email
                    }
                }
            }
        `;

        const data = await fetchGraphQL<{ register: AuthResponse }>(mutation, { registerInput: register });

        if (!data.register) {
            throw new Error('Erro ao fazer registro');
        }

        const auth = data.register;
        localStorage.setItem('auth_token', auth.token);

        return auth;
    }

    static async logout(): Promise<void> {
        localStorage.removeItem('auth_token');
    }

    static getToken(): string | null {
        return getToken();
    }

    static isAuthenticated(): boolean {
        return !!this.getToken();
    }

}