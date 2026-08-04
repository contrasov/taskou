const API_URL = '/graphql';

export function getToken(): string | null {
    return localStorage.getItem('auth_token');
}

export async function fetchGraphQL<T>(query: string, variables: Record<string, any> = {}): Promise<T> {
    const token = getToken();

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(API_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify({ query, variables }),
    });

    const result = await response.json();

    if (!response.ok || result.errors) {
        const message = result.errors?.[0]?.message || 'Erro na requisição GraphQL';
        throw new Error(message);
    }

    return result.data;
}
