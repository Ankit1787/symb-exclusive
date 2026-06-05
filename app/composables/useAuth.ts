import type { ApiResponse, AuthResponse, ForgotPasswordDto, LoginDto, registerDto, UpdateProfileDto, User } from "~/types/api";

export const useAuth = () => {
  const { $api } = useNuxtApp();

  const login = async (payload: LoginDto) => {
    const response = await $api<AuthResponse>("/auth/login", {
      method: "POST",
      body: payload,
    });
    return response;
  };
  const forgotPassword = async (payload: ForgotPasswordDto) => {
    const response = await $api<ApiResponse<null>>("/auth/forgot-password", {
      method: "POST",
      body: payload,
    });
    return response;
  };
  const getProfile = async () => {
    const res = await $api<ApiResponse<User>>("/auth/profile");
    return res.data;
  };

  const updateProfile = async (payload: UpdateProfileDto) => {
    const res = await $api<ApiResponse<User>>("/auth/update-profile", {
      method: "PUT",
      body: payload,
    });
    return res.data;
  }
  const register = async (paylaod: registerDto) => {
    const response = await $api<AuthResponse>("/auth/register", {
      method: "POST",
      body: paylaod,
    });
    return response;
  };

  return {
    login,
    forgotPassword,
    register,
    getProfile,
    updateProfile,
  };
};
