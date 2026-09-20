export type UserRole = "learner" | "admin" | "owner";
export type AccountStatus = "active" | "unverified" | "disabled";

export interface AuthenticatedUser {
  /** Random internal identity; email is never used as the permanent database key. */
  userId: string;
  email: string;
  role: UserRole;
  status: AccountStatus;
}

export interface AuthSession {
  user: AuthenticatedUser;
  expiresAt: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

/**
 * Vendor-neutral boundary for a future server-backed account service. Implementations
 * must use secure HTTP-only sessions; the browser must never persist passwords or bearer tokens.
 */
export interface AuthenticationGateway {
  currentSession(): Promise<AuthSession | undefined>;
  signIn(request: SignInRequest): Promise<AuthSession>;
  signOutCurrentSession(): Promise<void>;
  requestEmailVerification(): Promise<void>;
  requestPasswordReset(email: string): Promise<void>;
}

export const canManageContent = (role: UserRole): boolean => role === "admin" || role === "owner";
export const canManageAdministrators = (role: UserRole): boolean => role === "owner";
