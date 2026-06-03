
<script setup lang="ts">
import { toast } from 'vue-sonner';
import  useAuthStore from '~/stores/auth.store';
import type { LoginDto, registerDto } from '~/types/api';
const {signUp}  = useAuthStore();
const user  = reactive<registerDto>({
  firstName:"",
  lastName:"",
  identifier:'',
  password:'',
  confirmPassword:'',

})
const handleSignUp = async () => {
  if(!user.firstName.trim()){
    toast.error("Enter First Name")
    return;
  }
 
  if(!user.identifier.trim()){
    toast.error("Enter email or phone Number")
    return;
  }
  if(user.password.trim()!==user.confirmPassword.trim()){
    toast.error("Passwords do not match")
    return;
  }
  await signUp(user)
}

</script>
<template>
  <NuxtLayout>
    <section class="container auth-layout">
      <div class="auth-art">🛍</div>
      <div class="auth-card">
        <h1>Create an account</h1>
        <p>Enter your details below</p>
        <form>
          <input  class="field" v-model="user.firstName" placeholder="First Name" />
          <input  class="field" v-model="user.lastName" placeholder="Last Name" />
          <input class="field" v-model="user.identifier" placeholder="Email or Phone Number" />
          <input class="field" v-model="user.password" placeholder="Password" type="password" />
          <input class="field" v-model="user.confirmPassword" placeholder="Confirm Password" type="password" />
          <button class="btn" @click="handleSignUp" type="button">Create Account</button>
          <button class="btn outline" type="button">G Sign up with Google</button>
        </form>
        <p class="auth-footnote">Already have account? <NuxtLink to="/login">Log in</NuxtLink></p>
      </div>
    </section>
  </NuxtLayout>
</template>
