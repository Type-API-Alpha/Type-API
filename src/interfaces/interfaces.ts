
// Resposta padrão para todas as requisições válidas e inválidas.
export interface IAPIResponse<T> {
    success: boolean;
    data: T | null;
    error: null | string;
    messages?: Array<string> | string
}