export interface login {
  Username: string;
  password: string;
  // rememberMe: boolean;
}

export interface UserResponse {
  UserID: number;
  UserName: string;
  Password: string;
  EmailId: string;
  UserRole: string;
  FacilityID: number | null;
}
