import { defineStore } from "pinia";
import { toast } from "vue-sonner";
import { type User, type LoginDto, type registerDto, type UpdateProfileDto, type ForgotPasswordDto } from "~/types/api";
import { showApiErrorToast } from "~/utils/apiErrors";

interface IUser {
  name: string;
  email?: string;
  phoneNumber?: string;
}

const useAuthStore = defineStore(
  "auth",
  () => {
    const user = ref<IUser | null>(null);
    const profile = ref<User | null>(null);
    const token = ref<string | null>(null);
    const isAuthenticated = computed(() => !!token.value);
    const { login: loginApi, forgotPassword: forgotPasswordApi, register, getProfile, updateProfile } = useAuth();
  

    const login = async (payload: LoginDto) => {
      try {
        const response = await loginApi(payload);
        user.value = response?.data?.user;
        token.value = response.data.token;
        navigateTo("/")
        return response;
      } catch (error) {
        showApiErrorToast(error, "Invalid email or password.");
        return null;
      }
    };

    const forgotPassword = async (payload: ForgotPasswordDto) => {
      try {
        const response = await forgotPasswordApi(payload);
        toast.success(response.message || "Password reset instructions sent.");
        return response;
      } catch (error) {
        showApiErrorToast(error, "Unable to send password reset instructions.");
        return null;
      }
    };

    const getProfileDetails =async()=>{
      try {
        const res = await getProfile();
         profile.value = res;
      } catch (error) {
        showApiErrorToast(error, "Unable to load your profile.");
      }
    }
    const updateProfileDetails =async(payload:UpdateProfileDto)=>{
      const res = await updateProfile(payload);
       profile.value = res;
    }
    

    const logout = async() => {
      user.value = null;
      token.value = null;
      navigateTo("/login");
    };

    const signUp = async (payload: registerDto) => {
      try {
        const response = await register(payload);
        user.value = response?.data?.user;
        token.value = response.data.token;
        navigateTo("/")
        return response;
      } catch (error) {
        showApiErrorToast(error, "Unable to create your account.");
        return null;
      }
    };

    return {
      user,
      token,
      profile,
      isAuthenticated,
      login,
      forgotPassword,
      logout,
      signUp,
      getProfileDetails,
      updateProfileDetails
    };
  },
  {
    persist: true,
  },
);

export default useAuthStore;
