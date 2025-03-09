export class HttpService {
  private baseUrl: string

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL as string
  }

  private async request<T>(
    method: string,
    endpoint: string,
    data?: object | null,
  ): Promise<{ data?: T; error?: string; status: number }> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    const token = localStorage.getItem('auth_token')
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const options: RequestInit = {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, options)
      const json = await response.json()

      if (!response.ok) {
        // 🛑 Verifica si el error es "Unauthenticated."
        if (response.status === 401 || json.message === 'Unauthenticated.') {
          console.warn('Sesión expirada. Redirigiendo al login...')
          localStorage.clear()
          window.location.href = '/login?error=401' // 🔄 Redirige al login
        }

        return {
          error: json.message || `Error ${response.status}: ${response.statusText}`,
          status: response.status,
        }
      }

      return { data: json, status: response.status }
    } catch (err: unknown) {
      console.error('HTTP Error:', err)

      let errorMessage = 'Unknown error occurred'
      if (err instanceof Error) {
        errorMessage = err.message
      }

      return { error: errorMessage, status: 500 }
    }
  }

  public get<T>(endpoint: string) {
    return this.request<T>('GET', endpoint, null)
  }

  public post<T>(endpoint: string, data: object) {
    return this.request<T>('POST', endpoint, data)
  }

  public put<T>(endpoint: string, data: object) {
    return this.request<T>('PUT', endpoint, data)
  }

  public delete<T>(endpoint: string) {
    return this.request<T>('DELETE', endpoint, null)
  }
}
