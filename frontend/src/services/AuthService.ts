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
    private static API_URL = '/graphql';


    // isso é so para eu não ficar repetido os headers e o tipo de requisição
    private static async fetchGraphQL<T>(query: string, variables: Record<string, any> = {}): Promise<T> {
        const token = this.getToken();

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(this.API_URL, {
            method: 'POST',
            headers,
            body: JSON.stringify({ query, variables }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.errors?.[0]?.message || 'Erro de autenticação');
        }

        const result = await response.json();
        return result.data;
    }

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

        const data = await this.fetchGraphQL<{ login: AuthResponse }>(mutation, { loginInput: login });

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

        const data = await this.fetchGraphQL<{ register: AuthResponse }>(mutation, { registerInput: register });

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
        return localStorage.getItem('auth_token');
    }

    static isAuthenticated(): boolean {
        return !!this.getToken();
    }

}