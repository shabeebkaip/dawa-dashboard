/**
 * API Client with automatic authentication
 * Handles Bearer token injection and error handling
 */

interface FetchOptions extends RequestInit {
  skipAuth?: boolean;
}

/**
 * Get the session token from the session API
 */
async function getSessionToken(): Promise<string | null> {
  try {
    const response = await fetch("/api/auth/session");
    const data = await response.json();
    return data.token || null;
  } catch (error) {
    console.error("Failed to get session token:", error);
    return null;
  }
}

/**
 * Authenticated fetch wrapper
 * Automatically adds Bearer token to all requests
 */
export async function apiFetch(url: string, options: FetchOptions = {}): Promise<Response> {
  const { skipAuth = false, headers = {}, ...restOptions } = options;

  // Build headers
  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(headers as Record<string, string>),
  };

  // Add authentication if not skipped
  if (!skipAuth) {
    const token = await getSessionToken();
    if (token) {
      requestHeaders["Authorization"] = `Bearer ${token}`;
    } else {
      console.warn("No authentication token available");
    }
  }

  // Make the request
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const fullUrl = url.startsWith("http") ? url : `${baseUrl}${url}`;

  try {
    const response = await fetch(fullUrl, {
      ...restOptions,
      headers: requestHeaders,
    });

    // Handle authentication errors
    if (response.status === 401) {
      console.error("Unauthorized: Invalid or expired token");
      // Redirect to login if needed
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }

    return response;
  } catch (error) {
    console.error("API Request failed:", error);
    throw error;
  }
}

/**
 * Convenience methods for common HTTP verbs
 */
export const api = {
  get: async (url: string, options?: FetchOptions) => {
    return apiFetch(url, { ...options, method: "GET" });
  },

  post: async (url: string, data?: unknown, options?: FetchOptions) => {
    return apiFetch(url, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  put: async (url: string, data?: unknown, options?: FetchOptions) => {
    return apiFetch(url, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  delete: async (url: string, options?: FetchOptions) => {
    return apiFetch(url, { ...options, method: "DELETE" });
  },

  patch: async (url: string, data?: unknown, options?: FetchOptions) => {
    return apiFetch(url, {
      ...options,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  },
};

/**
 * Helper to parse JSON response with error handling
 */
export async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error (${response.status}): ${errorText}`);
  }

  try {
    return await response.json();
  } catch {
    throw new Error("Failed to parse JSON response");
  }
}
