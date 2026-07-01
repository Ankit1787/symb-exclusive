export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
export interface AuthResponse extends ApiResponse<any> {
  data: {
    token: string;
    user: {
      name: string;
      email?: string;
      phoneNumber?: string;
    };
  };
}
export interface LoginDto {
  identifier: string;
  password: string;
}
export interface ForgotPasswordDto {
  identifier: string;
}
export interface registerDto {
  firstName: string;
  lastName?: string;
  identifier: string;
  password: string;
  confirmPassword: string;
}
export interface Address {
  fullName?:string;
  email?: string;
  phoneNumber?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}
export interface User {
  id?: string;
  _id?: string;
  firstName: string;
  lastName?: string;
  address?: Address;
  email?: string;
  phoneNumber?: string;
}


export interface UpdateProfileDto {
  firstName: string;
  lastName?: string;
  email: string;
  address: Address;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}
