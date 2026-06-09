<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useRoute } from "vue-router";
import { useOrderApi } from "~/composables/useOrderApi";
import type { Order } from "~/types/orders";
import { showApiErrorToast } from "~/utils/apiErrors";
import SectionHeader from "~/components/SectionHeader.vue";

definePageMeta({
  middleware: ["auth"],
});

const route = useRoute();
const orderApi = useOrderApi();

const orderId = ref(route.params.id as string);
const order = ref<Order | null>(null);
const loading = ref(false);

const fetchOrderDetails = async () => {
  if (!orderId.value) return;
  loading.value = true;
  try {
    const res = await orderApi.getOrderById(orderId.value);
    if (res) {
      order.value = mapBackendOrderToFrontend(res);
    }
  } catch (error) {
    showApiErrorToast(error, "Failed to load order details");
  } finally {
    loading.value = false;
  }
};

watch(orderId, () => {
  fetchOrderDetails();
}, { immediate: true });

const orderTotal = computed(() => {
  if (order.value) {
    return order.value?.items?.reduce((acc: any, item: any) => acc + item.price * item.quantity, 0)?.toFixed(2)
  }
  return 0;
});

function mapBackendOrderToFrontend(backendOrder: any): Order {
  let mappedStatus: "Delivered" | "Cancelled" |"Pending" | "Confirmed" | "Shipped" |"Returned" = "Pending";
  if (backendOrder.status === "delivered") {
    mappedStatus = "Delivered";
  } else if (backendOrder.status === "cancelled") {
    mappedStatus = "Cancelled";
  }else if (backendOrder.status === "pending") {
    mappedStatus = "Pending";
  }else if (backendOrder.status === "confirmed") {
    mappedStatus = "Confirmed";
  }else if (backendOrder.status === "shipped") {
    mappedStatus = "Shipped";
  }else if (backendOrder.status === "returned") {
    mappedStatus = "Returned";
  }

  return {
    _id: backendOrder._id,
    orderNumber: backendOrder.orderId || backendOrder._id,
    createdAt: backendOrder.createdAt,
    total: backendOrder.totalAmount || 0,
    status: mappedStatus,
    address: {
      fullName: backendOrder.shippingAddress?.fullName || "",
      addressLine1: backendOrder.shippingAddress?.addressLine1 || "",
      addressLine2: backendOrder.shippingAddress?.addressLine2 || "",
      city: backendOrder.shippingAddress?.city || "",
      state: backendOrder.shippingAddress?.state || "",
      postalCode: backendOrder.shippingAddress?.postalCode || "",
      country: backendOrder.shippingAddress?.country || "",
    },
    items: (backendOrder.items || []).map((item: any) => ({
      productId: item.productId,
      title: item.title,
      price: item.price,
      thumbnail: item.thumbnail || "",
      quantity: item.quantity,
      variant: item.variant || {},
    })),
    orderTimeline: backendOrder.orderTimeline || [],
  };
}
</script>

<template>
    <NuxtLayout>
        <div class="container page-gap">
            <div class="breadcrumb">
                <NuxtLink to="/myaccount">My Account</NuxtLink><span>/</span><strong>My Orders</strong>
            </div>
            <section>
                <div v-if="loading" class="container order-detail-page skeleton-order-details" aria-hidden="true">
                    <!-- Header -->
                    <div class="order-header">
                        <NuxtLink to="/myaccount/myorders" class="back-btn">←</NuxtLink>
                        <h1>Order Details</h1>
                    </div>

                    <!-- Summary Skeleton -->
                    <section class="order-summary" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 48px;">
                        <div>
                            <span class="skeleton-line" style="width: 150px; height: 24px; display: block; margin-bottom: 8px;"></span>
                            <span class="skeleton-line" style="width: 180px; height: 16px; display: block;"></span>
                        </div>
                        <span class="skeleton-line" style="width: 100px; height: 32px; border-radius: 4px; display: block;"></span>
                    </section>

                    <!-- Items Skeleton -->
                    <section style="margin-bottom: 40px;">
                        <span class="skeleton-line" style="width: 140px; height: 20px; display: block; margin-bottom: 16px;"></span>
                        <div v-for="i in 2" :key="i" class="ordered-item" style="display: flex; gap: 16px; align-items: center; border: 1px solid #eee; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
                            <span class="skeleton-box" style="width: 90px; height: 90px; border-radius: 4px; display: block; flex-shrink: 0;"></span>
                            <div style="flex: 1;">
                                <span class="skeleton-line" style="width: 60%; height: 18px; display: block; margin-bottom: 8px;"></span>
                                <span class="skeleton-line" style="width: 30%; height: 14px; display: block; margin-bottom: 8px;"></span>
                                <span class="skeleton-line" style="width: 80px; height: 18px; display: block;"></span>
                            </div>
                        </div>
                    </section>

                    <!-- Shipping Address Skeleton -->
                    <section style="margin-bottom: 40px;">
                        <span class="skeleton-line" style="width: 160px; height: 20px; display: block; margin-bottom: 16px;"></span>
                        <div class="address-card" style="border: 1px solid #eee; border-radius: 8px; padding: 24px;">
                            <span class="skeleton-line" style="width: 140px; height: 18px; display: block; margin-bottom: 12px;"></span>
                            <span class="skeleton-line" style="width: 80%; height: 16px; display: block; margin-bottom: 8px;"></span>
                            <span class="skeleton-line" style="width: 60%; height: 16px; display: block;"></span>
                        </div>
                    </section>

                    <!-- Payment Summary Skeleton -->
                    <section style="margin-bottom: 40px;">
                        <span class="skeleton-line" style="width: 160px; height: 20px; display: block; margin-bottom: 16px;"></span>
                        <div class="payment-card" style="border: 1px solid #eee; border-radius: 8px; padding: 24px;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 16px;">
                                <span class="skeleton-line" style="width: 80px; height: 16px;"></span>
                                <span class="skeleton-line" style="width: 60px; height: 16px;"></span>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 16px;">
                                <span class="skeleton-line" style="width: 80px; height: 16px;"></span>
                                <span class="skeleton-line" style="width: 40px; height: 16px;"></span>
                            </div>
                            <div style="display: flex; justify-content: space-between; border-top: 1px solid #eee; padding-top: 16px;">
                                <span class="skeleton-line" style="width: 80px; height: 18px;"></span>
                                <span class="skeleton-line" style="width: 70px; height: 18px;"></span>
                            </div>
                        </div>
                    </section>
                </div>
                <div v-else-if="!order" class="empty-state">
                    Order not found.
                </div>
                <div v-else class="container order-detail-page">

                    <!-- Header -->

                    <div class="order-header">
                        <NuxtLink to="/myaccount/myorders" class="back-btn">
                            ←
                        </NuxtLink>

                        <h1>Order Details</h1>
                    </div>

                    <!-- Order Info -->

                    <section class="order-summary">
                        <div>
                            <h2>Order #{{ order.orderNumber }}</h2>

                            <p>
                                Placed on
                                {{
                                    new Date(order?.createdAt??"").toLocaleDateString()
                                }}
                            </p>
                        </div>

                        <span class="status-badge" :class="order.status.toLowerCase()">
                            {{ order.status }}
                        </span>
                    </section>

                    <!-- Timeline -->

                    <section>
                        <SectionHeader eyebrow="Status Tracking" :title="order.status" />

                        <div class="timeline">
                            <div v-for="step in order.orderTimeline" :key="step.title" class="timeline-item">
                                <div class="timeline-icon">
                                    ✓
                                </div>

                                <div>
                                    <h3>{{ step.title }}</h3>
                                    <p>{{ step.date }}</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <!-- Products -->

                    <section>
                        <SectionHeader eyebrow="Ordered Items" title="Items" />



                        <div v-for="item in order.items" :key="item.productId" class="ordered-item">
                            <img :src="item.thumbnail" alt="" />

                            <div>
                                <h3>{{ item.title }}</h3>
                                <p>Qty: {{ item.quantity }}</p>
                                <strong>${{ item.price  }}</strong>
                            </div>
                        </div>
                    </section>

                    <!-- Address -->

                    <section>
                        <SectionHeader eyebrow="Shipping Address" title="Address" />

                        <!-- <div class="section-title">
                            Shipping Address
                        </div> -->

                        <div class="address-card">
                            <h3>
                                {{ order.address.fullName }}
                            </h3>

                            <p>
                                {{ order.address.addressLine1 }}
                            </p>

                            <p>
                                {{ order.address.city }},
                                {{ order.address.postalCode }},
                                {{ order.address.country }}
                            </p>
                        </div>
                    </section>

                    <!-- Payment -->

                    <section>
                        <SectionHeader eyebrow="Payment Summary" title="Payment" />

                        <!-- <div class="section-title">
                            Payment Summary
                        </div> -->

                        <div class="payment-card">
                            <div>
                                <span>Subtotal</span>
                                <span>${{ orderTotal }}</span>
                            </div>

                            <div>
                                <span>Shipping</span>
                                <span class="free">Free</span>
                            </div>

                            <div class="total-row">
                                <span>Total</span>
                                <strong>${{ orderTotal }}</strong>
                            </div>
                        </div>
                    </section>

                    <!-- Actions -->

                    <div class="order-actions">
                        <button class="btn outline">
                            Download Invoice
                        </button>

                        <button class="btn">
                            Buy Again
                        </button>
                    </div>
                </div>
            </section>
        </div>

    </NuxtLayout>
</template>
<style scoped>
.order-detail-page {
    max-width: 800px;
    margin: auto;
}

.order-header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 40px;
}

.back-btn {
    font-size: 28px;
    text-decoration: none;
}

.order-summary {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 48px;
}

.status-badge {
    background: #db4444;
    color: white;
    padding: 8px 18px;
    border-radius: 4px;
    font-weight: 600;
}

.section-title {
    color: #db4444;
    font-weight: 600;
    margin-bottom: 24px;
    border-left: 12px solid #db4444;
    padding-left: 12px;
}

.timeline {
    margin-bottom: 48px;
}

.timeline-item {
    display: flex;
    gap: 16px;
    position: relative;
    padding-bottom: 32px;
}

.timeline-item:not(:last-child)::before {
    content: "";
    position: absolute;
    left: 15px;
    top: 32px;
    width: 2px;
    height: calc(100% - 10px);
    background: #db4444;
}

.timeline-icon {
    width: 32px;
    height: 32px;
    background: #db4444;
    color: white;
    border-radius: 50%;
    display: grid;
    place-items: center;
    flex-shrink: 0;
}

.ordered-item {
    display: flex;
    gap: 16px;
    border: 1px solid #eee;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 16px;
}

.ordered-item img {
    width: 90px;
    height: 90px;
    object-fit: contain;
}

.address-card,
.payment-card {
    border: 1px solid #eee;
    border-radius: 8px;
    padding: 24px;
    margin-bottom: 40px;
}

.payment-card>div {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
}

.total-row {
    border-top: 1px solid #eee;
    padding-top: 16px;
}

.free {
    color: green;
}

.order-actions {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.order-actions .btn {
    width: 100%;
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 48px;
  border: 1px solid #eee;
  border-radius: 8px;
  background: #fff;
  color: #7d8184;
  margin-bottom: 40px;
}
</style>