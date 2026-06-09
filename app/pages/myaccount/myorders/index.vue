<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useOrderApi } from "~/composables/useOrderApi";
import useAuthStore from "~/stores/auth.store";
import type { Order } from "~/types/orders";
import { showApiErrorToast } from "~/utils/apiErrors";

definePageMeta({
  middleware: ["auth"],
});

const authStore = useAuthStore();
const orderApi = useOrderApi();

const orders = ref<Order[]>([]);
const loading = ref(false);

const fetchOrders = async () => {
  loading.value = true;
  try {
    
      const userOrders = await orderApi.getUserOrders();
      orders.value = (userOrders || []).map(mapBackendOrderToFrontend);
    
  } catch (error) {
    showApiErrorToast(error, "Failed to load orders");
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchOrders();
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
                <SectionHeader eyebrow="Featured" title="My Orders" />

                <div v-if="loading" class="orders-table skeleton-table" aria-hidden="true">
                    <div class="table-head">
                        <span>ORDER ID</span>
                        <span>DATE</span>
                        <span>ITEMS</span>
                        <span>TOTAL</span>
                        <span>STATUS</span>
                        <span>ACTIONS</span>
                    </div>
                    <div v-for="n in 3" :key="n" class="table-row skeleton-row">
                        <span class="order-id">
                            <span class="skeleton-line" style="width: 70px; height: 18px; display: block;"></span>
                        </span>
                        <span class="order-date">
                            <span class="skeleton-line" style="width: 80px; height: 18px; display: block;"></span>
                        </span>
                        <div class="items-cell">
                            <span class="skeleton-box" style="width: 40px; height: 40px; border-radius: 4px; display: block; flex-shrink: 0;"></span>
                            <span class="skeleton-line" style="width: 140px; height: 18px; display: block;"></span>
                        </div>
                        <span class="order-total">
                            <span class="skeleton-line" style="width: 60px; height: 18px; display: block;"></span>
                        </span>
                        <span class="status">
                            <span class="skeleton-line" style="width: 80px; height: 24px; border-radius: 4px; display: block;"></span>
                        </span>
                        <div class="actions">
                            <span class="skeleton-line" style="width: 100%; height: 32px; border-radius: 4px; display: block;"></span>
                        </div>
                    </div>
                </div>

                <div v-else-if="orders.length === 0" class="empty-state">
                    You have not placed any orders yet.
                </div>

                <div v-else class="orders-table">
                    <div class="table-head">
                        <span>ORDER ID</span>
                        <span>DATE</span>
                        <span>ITEMS</span>
                        <span>TOTAL</span>
                        <span>STATUS</span>
                        <span>ACTIONS</span>
                    </div>

                    <div v-for="order in orders" :key="order._id" class="table-row">
                        <span class="order-id">#{{ order.orderNumber }}</span>

                        <span class="order-date">
                            {{
                                new Date(order.createdAt ?? "")
                            .toLocaleDateString()
                            }}
                        </span>

                        <div class="items-cell">
                            <img :src="order?.items[0]?.thumbnail" class="item-image" />

                            <span>
                                {{ order?.items[0]?.title }}

                                <template v-if="order?.items?.length > 1">
                                    + {{ order.items.length - 1 }} more
                                </template>
                            </span>
                        </div>

                        <span class="order-total">
                            ${{ order.total }}
                        </span>

                        <span class="status" :class="order.status.toLowerCase().replace(/\s+/g, '-')">
                            {{ order.status }}
                        </span>

                        <div class="actions">
                            <button @click="navigateTo(`/myaccount/myorders/${order.orderNumber}`)" class="btn">
                                View
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </NuxtLayout>
</template>
<style scoped>
.orders-table {
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
}

.table-head {
  display: grid;
  grid-template-columns: 1.2fr 1fr 2fr 1fr 1.2fr 1fr;
  align-items: center;
  gap: 16px;
  background: #f8f8f8;
  font-weight: 600;
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
  font-size: 14px;
}

.table-row {
  display: grid;
  grid-template-columns: 1.2fr 1fr 2fr 1fr 1.2fr 1fr;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  border-top: 1px solid #eee;
  font-size: 14px;
  transition: background-color 0.2s ease;
}

.table-row:hover {
  background-color: #fafafa;
}

.items-cell {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.item-image {
  width: 40px;
  height: 40px;
  object-fit: contain;
  border-radius: 4px;
  background: #f5f5f5;
  padding: 4px;
  flex-shrink: 0;
}

.items-cell span {
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.order-id {
  font-weight: 600;
  color: #333;
}

.order-date {
  color: #555;
}

.order-total {
  font-weight: 600;
  color: #000;
}

.status {
  padding: 6px 12px;
  border-radius: 4px;
  width: fit-content;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
}

.delivered {
  background: #d8f5df;
  color: #15803d;
}

.cancelled {
  background: #fde2e2;
  color: #dc2626;
}

.in-transit {
  background: #fff1c2;
  color: #d97706;
}

.actions .btn {
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  width: 100%;
  text-align: center;
}

/* Responsive Table Layout for Mobile */
@media (max-width: 768px) {
  .table-head {
    display: none;
  }

  .table-row {
    grid-template-areas:
      "id status"
      "items items"
      "date total"
      "actions actions";
    grid-template-columns: 1fr auto;
    gap: 12px;
    padding: 16px;
  }

  .table-row:not(:first-child) {
    border-top: 1px solid #eee;
  }

  .order-id {
    grid-area: id;
    font-size: 14px;
  }

  .order-date {
    grid-area: date;
    font-size: 13px;
    color: #666;
    display: flex;
    align-items: center;
  }
  
  .order-date::before {
    content: "Date: ";
    font-weight: 600;
    margin-right: 4px;
    color: #333;
  }

  .items-cell {
    grid-area: items;
    padding: 8px 0;
    border-top: 1px dashed #eee;
    border-bottom: 1px dashed #eee;
  }

  .order-total {
    grid-area: total;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  
  .order-total::before {
    content: "Total: ";
    font-weight: 600;
    margin-right: 4px;
    color: #333;
  }

  .status {
    grid-area: status;
    font-size: 11px;
    padding: 4px 8px;
  }

  .actions {
    grid-area: actions;
    width: 100%;
  }

  .actions .btn {
    width: 100%;
    padding: 10px;
    font-size: 14px;
  }
}.pagination {
  margin-top: 32px;

  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.pagination button {
  width: 40px;
  height: 40px;

  border: 1px solid #ddd;
  background: white;

  cursor: pointer;
}

.pagination button.active {
  background: #db4444;
  color: white;
  border-color: #db4444;
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 48px;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  background: #fff;
  color: #7d8184;
}
</style>
