import type { AuthResponse, LoginDto, registerDto } from "~/types/api";

export const useAuth =()=>{
   const {$api}=useNuxtApp();

    const login =async(payload:LoginDto)=>{
        try {
            const response = await $api<AuthResponse>("/auth/login",{
                method:"POST",
                body:payload
            });
             return response;
             
        } catch (error) {
            throw new Error("Something went wrong")
        }
    }
   
    const register = async (paylaod:registerDto) => {
        try {
          const response = await $api<AuthResponse>("/auth/register",{
            method:"POST",
            body:paylaod
          })
          return response
        } catch (error) {
          throw new Error("Something went wrong")
        }
      }

      return {
        login,
        register
    }

}