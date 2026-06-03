export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
export interface AuthResponse extends ApiResponse<any>{
  data:{
    token:string,
    user:{
      name:string,
      email?:string,
      phoneNumber?:string

    }
  }
}
export interface LoginDto{
  identifier:string, 
  password:string,
}
export interface registerDto{
  firstName:string,
  lastName?:string,
  identifier:string,
  password:string,
  confirmPassword:string
}
