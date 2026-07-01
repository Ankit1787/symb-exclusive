<script setup lang="ts">
import { toast } from 'vue-sonner';
import  useAuthStore from '~/stores/auth.store';
import type { ForgotPasswordDto, LoginDto } from '~/types/api';
const { login, forgotPassword } = useAuthStore();
const user  = reactive<LoginDto>({
  identifier:'',
  password:''

})
const forgotForm = reactive<ForgotPasswordDto>({
  identifier: ''
});
const isSubmitting = ref(false);
const isForgotPassword = ref(false);
const isSendingReset = ref(false);

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

const openForgotPassword = () => {
  forgotForm.identifier = user.identifier;
  isForgotPassword.value = true;
};

const handleForgotPassword = async () => {
  if (!forgotForm.identifier.trim()) {
    return toast.error("enter email or phoneNumber");
  }
  if (isSendingReset.value) return;

  isSendingReset.value = true;
  const response = await forgotPassword({
    identifier: forgotForm.identifier.trim(),
  });
  isSendingReset.value = false;

  if (response) {
    isForgotPassword.value = false;
  }
};

</script>

<template>
  <NuxtLayout>
    <section class="container auth-layout">
      <div class="auth-art">🛒</div>
      <div class="auth-card">
        <template v-if="!isForgotPassword">
          <h1>Log in to Exclusive</h1>
          <p>Enter your details below</p>
          <form @submit.prevent="handleLogin">
            <input v-model="user.identifier" class="field" placeholder="Email or Phone Number" />
            <input v-model="user.password" class="field" placeholder="Password" type="password" />
            <div class="auth-row">
              <button class="btn" type="submit" :disabled="isSubmitting">
                {{ isSubmitting ? "Logging in..." : "Log In" }}
              </button>
              <button class="price forgot-link" type="button" @click="openForgotPassword">Forget Password?</button>
            </div>
          </form>
        </template>

        <template v-else>
          <h1>Forgot Password</h1>
          <p>Enter your email or phone number below</p>
          <form @submit.prevent="handleForgotPassword">
            <input
              v-model="forgotForm.identifier"
              class="field"
              placeholder="Email or Phone Number"
            />
            <div class="auth-row">
              <button class="btn" type="submit" :disabled="isSendingReset">
                {{ isSendingReset ? "Sending..." : "Send Reset Link" }}
              </button>
              <button class="price forgot-link" type="button" @click="isForgotPassword = false">
                Back to Login
              </button>
            </div>
          </form>
        </template>
      </div>
    </section>
  </NuxtLayout>
</template>

<style scoped>
.forgot-link {
  background: transparent;
  border: 0;
  cursor: pointer;
  font: inherit;
  padding: 0;
}
</style>
