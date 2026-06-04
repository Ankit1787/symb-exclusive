<script setup lang="ts">
import { toast } from 'vue-sonner';
import  useAuthStore from '~/stores/auth.store';
import type { LoginDto } from '~/types/api';
const {login}  = useAuthStore();
const user  = reactive<LoginDto>({
  identifier:'',
  password:''

})
const isSubmitting = ref(false);
const handleLogin = async () => {
  if(!user.identifier.trim()){
    return toast.error("enter email or phoneNumber");
  }
  if(!user.password.trim()){
    return toast.error("enter password");
  }
  if (isSubmitting.value) return;
  isSubmitting.value = true;
  await login(user)
  isSubmitting.value = false;
}

</script>

<template>
  <NuxtLayout>
    <section class="container auth-layout">
      <div class="auth-art">🛒</div>
      <div class="auth-card">
        <h1>Log in to Exclusive</h1>
        <p>Enter your details below</p>
        <form>
          <input v-model="user.identifier" class="field" placeholder="Email or Phone Number" />
          <input v-model="user.password" class="field" placeholder="Password" type="password" />
          <div class="auth-row">
            <button class="btn" @click="handleLogin" type="button" :disabled="isSubmitting">
              {{ isSubmitting ? "Logging in..." : "Log In" }}
            </button>
            <NuxtLink class="price" to="/signup">Forget Password?</NuxtLink>
          </div>
        </form>
      </div>
    </section>
  </NuxtLayout>
</template>
