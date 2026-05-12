export interface TokenUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

export interface PublicUser extends TokenUser {
  phone: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginResponse {
  user: TokenUser;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenResponse {
  user: TokenUser;
  accessToken: string;
  refreshToken: string;
}
