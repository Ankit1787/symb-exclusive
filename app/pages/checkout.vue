<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { toast } from "vue-sonner";
import useAuthStore from "~/stores/auth.store";
import { useOrderApi } from "~/composables/useOrderApi";
import { showApiErrorToast } from "~/utils/apiErrors";

const cartStore = useCartStore();
const { items: cartItems } = storeToRefs(cartStore);
const authStore = useAuthStore();
const orderApi = useOrderApi();

const subtotal = computed(() =>
  cartItems.value.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  )?.toFixed(2) || 0,
);

const form = reactive({
  fullName: "",
  companyName: "",
  streetAddress: "",
  apartment: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
  phone: "",
  email: "",
  paymentMethod: "Bank"
});

onMounted(async () => {
  if (authStore.isAuthenticated && !authStore.profile) {
    await authStore.getProfileDetails();
  }
  if (authStore.profile) {
    form.fullName = authStore.profile.firstName + (authStore.profile.lastName ? " " + authStore.profile.lastName : "");
    form.email = authStore.profile.email || "";
    form.phone = authStore.profile.phoneNumber || "";
    if (authStore.profile.address) {
      form.streetAddress = authStore.profile.address.addressLine1 || "";
      form.apartment = authStore.profile.address.addressLine2 || "";
      form.city = authStore.profile.address.city || "";
      form.state = authStore.profile.address.state || "";
      form.postalCode = authStore.profile.address.postalCode || "";
      form.country = authStore.profile.address.country || "India";
    }
  }
});

const placingOrder = ref(false);

const handlePlaceOrder = async (e: Event) => {
  e.preventDefault();

  if (!authStore.isAuthenticated) {
    toast.error("Please log in to place an order.");
    return;
  }

  if (cartItems.value.length === 0) {
    toast.error("Your cart is empty.");
    return;
  }

  if (
    !form.fullName ||
    !form.streetAddress ||
    !form.city ||
    !form.state ||
    !form.postalCode ||
    !form.phone ||
    !form.email
  ) {
    toast.error("Please fill in all required fields (*).");
    return;
  }

  placingOrder.value = true;
  try {
    const orderItems = cartItems.value.map(item => ({
      productId: item.product._id,
      title: item.product.title,
      price: item.product.price,
      thumbnail: item.product.thumbnail || (item.product.images?.[0] || ""),
      quantity: item.quantity,
      variant: item.selectedVariant ? {
        color: item.selectedVariant.color?.name || item.selectedVariant.color?.code,
        size: item.selectedVariant.size
      } : undefined
    }));

    const orderPayload = {
      items: orderItems,
      totalAmount: parseFloat(subtotal.value as string),
      shippingAddress: {
        fullName: form.fullName,
        addressLine1: form.streetAddress,
        addressLine2: form.apartment,
        city: form.city,
        state: form.state,
        postalCode: form.postalCode,
        country: form.country,
        phoneNumber: form.phone,
        email: form.email
      },
      paymentMethod: form.paymentMethod,
    };

    const res = await orderApi.createOrder(orderPayload);
    if (res.success) {
      toast.success("Order placed successfully!");
      cartStore.clear();
      navigateTo(`/myaccount/myorders/${res.data.orderId}`);
    } else {
      toast.error(res.message || "Failed to place order.");
    }
  } catch (error: any) {
    showApiErrorToast(error, "Failed to place order.");
  } finally {
    placingOrder.value = false;
  }
};
</script>

<template>
  <NuxtLayout>
    <div class="container page-gap">
      <div class="breadcrumb"><NuxtLink to="/">Account</NuxtLink><span>/</span><NuxtLink to="/cart">Cart</NuxtLink><span>/</span><strong>Checkout</strong></div>
      <h1 class="section-title checkout-title">Billing Details</h1>
      <div class="checkout-grid">
        <form class="checkout-form" @submit.prevent="handlePlaceOrder">
          <label>Full Name* <input v-model="form.fullName" class="field" required /></label>
          <label>Street Address* <input v-model="form.streetAddress" class="field" required /></label>
          <label>Apartment, floor, etc. (optional) <input v-model="form.apartment" class="field" /></label>
          <label>Town/City* <input v-model="form.city" class="field" required /></label>
          <label>State / Province* <input v-model="form.state" class="field" required /></label>
          <label>Postal Code / ZIP* <input v-model="form.postalCode" class="field" required /></label>
          <label>Phone Number* <input v-model="form.phone" class="field" required /></label>
          <label>Email Address* <input v-model="form.email" class="field" type="email" required /></label>
          <label class="checkbox-line"><input type="checkbox" checked /> Save this information for faster check-out next time</label>
        </form>
        <aside>
          <div v-for="item in cartItems" :key="item.product._id" class="order-line">
            <span class="line-product"><img :src="item.product.thumbnail" class="cart-image" />{{
              item.product.title
            }}</span>
            <span>${{ item.product.price * item.quantity }}</span>
          </div>
          <div class="total-line"><span>Subtotal:</span><span>${{subtotal}}</span></div>
          <div class="total-line"><span>Shipping:</span><span>Free</span></div>
          <div class="total-line"><span>Total:</span><span>${{subtotal}}</span></div>
          <div class="pay-options">
            <label><input type="radio" name="pay" value="Bank" v-model="form.paymentMethod" /> Bank</label>
            <label><input type="radio" name="pay" value="Cash on delivery" v-model="form.paymentMethod" /> Cash on delivery</label>
          </div>
          <div class="coupon checkout-coupon">
            <input placeholder="Coupon Code" />
            <button class="btn" type="button">Apply Coupon</button>
          </div>
          <button class="btn" :disabled="placingOrder" @click="handlePlaceOrder">
            {{ placingOrder ? "Placing Order..." : "Place Order" }}
          </button>
        </aside>
      </div>
    </div>
  </NuxtLayout>
</template>
