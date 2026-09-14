import { jwtDecode } from "jwt-decode";
import { BASE_URL } from "../config";

interface JwtPayload {
    exp: number;
}

function isTokenExpired(token: string): boolean {
    try {
         const payload = jwtDecode<JwtPayload>(token);

        if (!payload.exp) {
            return true;
        }

        const currentTime = Math.floor(Date.now() / 1000);

        return payload.exp < currentTime + 10;
    } catch (error) {
        console.error("Error parsing token:", error);
        return true;
    }
}

async function refreshAccessToken(): Promise<string | null> {
    try {
        const response = await fetch(
            `${BASE_URL}/auth/refresh`,
            {
                method: "POST",
                credentials: "include",
            }
        );

        if (!response.ok) {
            return null;
        }

        const data: { token: string } = await response.json();

        localStorage.setItem("token", data.token);

        return data.token;
    } catch (error) {
        console.error("Failed to refresh access token:", error);
        return null;
    }
}

export async function fetchWithAuth(
    url: string,
    options: RequestInit = {}
): Promise<Response> {

    let token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "/";
        throw new Error("No authentication token found");
    }

    // --------------------------------------------------
    // 1. Check whether access token is expired
    // --------------------------------------------------

    if (isTokenExpired(token)) {
        const newToken = await refreshAccessToken();

        if (!newToken) {
            localStorage.removeItem("token");
            window.location.href = "/";
            throw new Error("Authentication session expired");
        }

        token = newToken;
    }

    // --------------------------------------------------
    // 2. Make original request
    // --------------------------------------------------

    const headers = new Headers(options.headers);
    headers.set("Authorization", `Bearer ${token}`);

    let response = await fetch(url, {
        ...options,
        headers,
    });

    // --------------------------------------------------
    // 3. If backend returns 401, try refreshing once
    // --------------------------------------------------

    if (response.status === 401) {
        const newToken = await refreshAccessToken();

        if (!newToken) {
            localStorage.removeItem("token");
            window.location.href = "/";
            throw new Error("Authentication failed");
        }

        token = newToken;

        const retryHeaders = new Headers(options.headers);
        retryHeaders.set("Authorization", `Bearer ${token}`);

        response = await fetch(url, {
            ...options,
            headers: retryHeaders,
        });
    }

    // --------------------------------------------------
    // 4. If retry also failed
    // --------------------------------------------------

    if (response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/";
        throw new Error("Authentication failed");
    }

    return response;
}