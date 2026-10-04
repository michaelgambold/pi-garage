export interface HttpResponse<T = any> {
  statusCode: number;
  data: T;
  reasonPhrase?: string;
}

export class HttpService {
  async get<T = any>(
    url: string,
    headers?: Record<string, string>,
    timeoutMs: number = 5000,
  ): Promise<HttpResponse<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          ...(headers || {}),
        },
        signal: controller.signal,
      });

      const text = await response.text();
      let data: any;
      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        data = text;
      }

      return {
        statusCode: response.status,
        data,
        reasonPhrase: response.statusText,
      };
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async post<T = any>(
    url: string,
    body?: any,
    headers?: Record<string, string>,
    timeoutMs: number = 5000,
  ): Promise<HttpResponse<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          ...(headers || {}),
        },
        body: body !== undefined ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      const text = await response.text();
      let data: any;
      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        data = text;
      }

      return {
        statusCode: response.status,
        data,
        reasonPhrase: response.statusText,
      };
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async put<T = any>(
    url: string,
    body?: any,
    headers?: Record<string, string>,
    timeoutMs: number = 5000,
  ): Promise<HttpResponse<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          ...(headers || {}),
        },
        body: body !== undefined ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      const text = await response.text();
      let data: any;
      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        data = text;
      }

      return {
        statusCode: response.status,
        data,
        reasonPhrase: response.statusText,
      };
    } finally {
      clearTimeout(timeoutId);
    }
  }
}
