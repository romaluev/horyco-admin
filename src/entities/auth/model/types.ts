/**
 * Authentication request payload
 * Corresponds to AuthDto in the backend
 */
export interface AuthRequest {
  phone: string;
  password: string;
}

/**
 * Authentication response
 * The structure is inferred from the backend auth.service.ts
 */
export interface AuthResponse {
  access_token: string;
  user: {
    id: number;
    // Add other user properties as needed
  };
}

/**
 * Error response structure
 */
export interface ErrorResponse {
  statusCode: number;
  message: string | string[];
  error?: string;
}

// Define the User type
export interface IUser {
  id: number;
  fullName: string;
  password: string;
  phone: string;
  photoUrl: null | string;
}
