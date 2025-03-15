/**
 * Servicio HTTP para realizar peticiones a la API.
 * @module services/httpService
 */
export class HttpService {
  private baseUrl: string

  /**
   * Crea una instancia del servicio HTTP.
   */
  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL as string
  }

  /**
   * Método genérico para realizar peticiones HTTP.
   *
   * @param method GET, POST, PUT, DELETE
   * @param endpoint Ruta de la API
   * @param data Body de la petición
   * @returns Respuesta de la petición
   */
  private async request<T>(
    method: string,
    endpoint: string,
    data?: object | null,
  ): Promise<{ data?: T; error?: string; status: number }> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    /**
     * Si existe un token de autenticación en el almacenamiento local,
     * se añade al encabezado de la petición para que Sanctum lo valide o rechace.
     */
    const token = localStorage.getItem('auth_token')
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    /**
     * Opciones de la petición HTTP.
     */
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

      // 🛑 Verifica si el error es "Failed to fetch."
      return { error: errorMessage, status: 500 }
    }
  }

  /**
   * Método para realizar una petición GET a la API.
   *
   * @param endpoint Ruta de la API
   * @returns
   */
  public get<T>(endpoint: string) {
    return this.request<T>('GET', endpoint, null)
  }

  /**
   * Método para realizar una petición POST a la API.
   *
   * @param endpoint Ruta de la API
   * @param data Body de la petición
   * @returns
   */
  public post<T>(endpoint: string, data: object) {
    return this.request<T>('POST', endpoint, data)
  }

  /**
   * Método para realizar una petición PUT a la API.
   *
   * @param endpoint Ruta de la API
   * @param data Body de la petición
   * @returns
   */
  public put<T>(endpoint: string, data: object) {
    return this.request<T>('PUT', endpoint, data)
  }

  /**
   * Método para realizar una petición DELETE a la API.
   *
   * @param endpoint Ruta de la API
   * @returns
   */
  public delete<T>(endpoint: string) {
    return this.request<T>('DELETE', endpoint, null)
  }
}
