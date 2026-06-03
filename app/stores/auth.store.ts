import { defineStore } from "pinia";
import type { LoginDto, registerDto } from "~/types/api";

interface User {
  name: string;
  email?: string;
  phoneNumber?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
}
const useAuthStore = defineStore(
  "auth",
  () => {
    const user = ref<User | null>(null);
    const token = ref<string | null>(null);
    const isAuthenticated = computed(() => !!token.value);
    const { login: loginApi,register } = useAuth();


    const login = async (payload: LoginDto) => {
      const response = await loginApi(payload);
      user.value = response?.data?.user;
      token.value = response.data.token;
      navigateTo("/")
      return response;
    };

    const logout = async() => {
      user.value = null;
      token.value = null;
      navigateTo("/login");
    };

    const signUp = async (payload: registerDto) => {
      const response = await register(payload);
      user.value = response?.data?.user;
      token.value = response.data.token;
      navigateTo("/")
      return response;
    };

    return {
      user,
      token,
      isAuthenticated,
      login,
      logout,
      signUp
    };
  },
  {
    persist: true,
  },
);

export default useAuthStore;
