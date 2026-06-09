<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { toast } from 'vue-sonner';
import BaseTab from '~/components/BaseTab.vue';
import ProductGrid from '~/components/ProductGrid.vue';
import useAuthStore from '~/stores/auth.store';
import { useOrderApi } from '~/composables/useOrderApi';
import type { UpdateProfileDto, User } from '~/types/api';
import type { Order } from '~/types/orders';
import { showApiErrorToast } from '~/utils/apiErrors';

definePageMeta({
  middleware: ["auth"],
});
const route = useRoute();
const router = useRouter();
const orderApi = useOrderApi();

const cancelledOrders = ref<Order[]>([]);
const returnedOrders = ref<Order[]>([]);
const ordersLoading = ref(false);

const fetchOrders = async () => {
  ordersLoading.value = true;
  try {
   
      const userOrders = await orderApi.getUserOrdersByStatus ("cancelled");
      const returned = await orderApi.getUserOrdersByStatus ("returned");
      cancelledOrders.value = (userOrders || []).map(mapBackendOrderToFrontend);
      returnedOrders.value = (returned || []).map(mapBackendOrderToFrontend);
    
  } catch (error) {
    showApiErrorToast(error, "Failed to load orders");
  } finally {
    ordersLoading.value = false;
  }
};

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

const activeTab = computed({
  get: () => (route.query.tab as string) || "profile",

  set: (tab: string) => {
    router.replace({
      query: {
        ...route.query,
        tab,
      },
    });
  },
});
const authStore = useAuthStore();
const tabs = [
  {
    key: "profile",
    label: "Profile",
  },
  {
    key: "address",
    label: "Address",
  },
  {
    key: "orders",
    label: "Orders",
  },
  {
    key: "wishlist",
    label: "Wishlist",
  },
];
const form = reactive<UpdateProfileDto>({
  firstName: "",
  lastName: "",
  email: "",
  address: {
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  },
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",

})
await callOnce("profile", async () => {
  await authStore.getProfileDetails();
});


watch(
  () => authStore.profile,
  (profile) => {
    if (!profile) return;

    form.firstName = profile.firstName ?? "";
    form.lastName = profile.lastName ?? "";
    form.email = profile.email ?? "";
    form.address = profile.address ?? {
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    };
    fetchOrders();
  },
  { immediate: true }
);

const updateProfile = async () => {
  try {
    const payload = { ...form };

    if (!payload.currentPassword) delete payload.currentPassword;
    if (!payload.newPassword) delete payload.newPassword;
    if (!payload.confirmPassword) delete payload.confirmPassword;
    console.log("payload", payload);
    await authStore.updateProfileDetails(payload);
    toast.success("Profile updated successfully");
  } catch (error) {
    showApiErrorToast(error, "Error updating profile");
  }
}
const updateTab = (tab: string) => {
  activeTab.value = tab;
}
</script>
<template>
  <NuxtLayout>
    <div class="container page-gap">
      <div class="breadcrumb account-breadcrumb">
        <span>
          <NuxtLink to="/">Home</NuxtLink> / <strong>My Account</strong>
        </span>
        <span>Welcome! <span class="price">{{ authStore.user?.name }}</span></span>
      </div>
      <div class="account-grid">
        <aside class="account-menu">
          <h3>Manage My Account</h3>
          <NuxtLink to="/myaccount?tab=profile" class="price" :class="{ 'active': activeTab === 'profile' }">My Profile
          </NuxtLink>
          <NuxtLink to="/myaccount?tab=address" class="price" :class="{ 'active': activeTab === 'address' }">Address Book
          </NuxtLink>
          <!-- <NuxtLink to="/account?tab=payment-options" class="price"
            :class="{ 'active': activeTab === 'payment-options' }">My Payment
            Options</NuxtLink> -->
          <h3 class="menu-spaced">My Orders</h3>
          <NuxtLink to="/myaccount?tab=returns" class="price" :class="{ 'active': activeTab === 'returns' }">My Returns
          </NuxtLink>
          <NuxtLink to="/myaccount?tab=cancellations" class="price" :class="{ 'active': activeTab === 'cancellations' }">
            My Cancellations</NuxtLink>
          <!-- <h3 class="menu-spaced">My WishList</h3> -->
        </aside>
        <section class="profile-card">
          <BaseTab :showTabs="false" v-model="activeTab" :tabs="tabs" @update:modelValue="updateTab">
            <template #default="{ currentTab }">

              <!-- Profile -->
              <div v-if="currentTab === 'profile'">
                <h2>Edit Profile</h2>

                <form class="form-grid">
                  <label>
                    First Name
                    <input v-model="form.firstName" class="field" />
                  </label>

                  <label>
                    Last Name
                    <input v-model="form.lastName" class="field" />
                  </label>

                  <label>
                    Email
                    <input v-model="form.email" class="field" readonly />
                  </label>

                  <label class="span-2">
                    Current Password
                    <input v-model="form.currentPassword" class="field" />
                  </label>

                  <input v-model="form.newPassword" class="field span-2" placeholder="New Password" />

                  <input v-model="form.confirmPassword" class="field span-2" placeholder="Confirm Password" />

                  <div class="span-2 profile-actions">
                    <button type="button" class="btn" @click="updateProfile">
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>

              <!-- Address -->
              <div v-else-if="currentTab === 'address'">
                <h2>Address Book</h2>

                <form class="form-grid">
                  <label class="span-2">
                    Address Line 1
                    <input class="field" v-model="form.address.addressLine1" />
                  </label>

                  <label class="span-2">
                    Address Line 2
                    <input class="field" v-model="form.address.addressLine2" />
                  </label>

                  <label>
                    City
                    <input class="field" v-model="form.address.city" />
                  </label>

                  <label>
                    State
                    <input class="field" v-model="form.address.state" />
                  </label>

                  <label>
                    Postal Code
                    <input class="field" v-model="form.address.postalCode" />
                  </label>

                  <label>
                    Country
                    <input class="field" v-model="form.address.country" />
                  </label>

                  <div class="span-2 profile-actions">
                    <button type="button" class="btn" @click="updateProfile">
                      Save Address
                    </button>
                  </div>
                </form>
              </div>

              <!-- Orders / Returns -->
              <div v-else-if="currentTab === 'returns'">
                <h2>My Returns</h2>

                <div v-if="ordersLoading" class="orders-table skeleton-table" aria-hidden="true">
                    <div class="table-head">
                        <span>ORDER ID</span>
                        <span>DATE</span>
                        <span>ITEMS</span>
                        <span>TOTAL</span>
                        <span>STATUS</span>
                        <span>ACTIONS</span>
                    </div>
                    <div v-for="n in 2" :key="n" class="table-row skeleton-row">
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
                <div v-else-if="returnedOrders.length === 0" class="empty-state">
                    No returns or cancelled orders found.
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

                    <div v-for="order in returnedOrders" :key="order._id" class="table-row">
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
                            <button @click="navigateTo('/myaccount/myorders/' + order.orderNumber)" type="button" class="btn">
                                View
                            </button>
                        </div>
                    </div>
                </div>
              </div>
              <div v-else-if="currentTab === 'cancellations'">
                <h2>My Cancellations</h2>

                <div v-if="ordersLoading" class="orders-table skeleton-table" aria-hidden="true">
                    <div class="table-head">
                        <span>ORDER ID</span>
                        <span>DATE</span>
                        <span>ITEMS</span>
                        <span>TOTAL</span>
                        <span>STATUS</span>
                        <span>ACTIONS</span>
                    </div>
                    <div v-for="n in 2" :key="n" class="table-row skeleton-row">
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
                <div v-else-if="cancelledOrders.length === 0" class="empty-state">
                    No cancelled orders found.
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

                    <div v-for="order in cancelledOrders" :key="order._id" class="table-row">
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
                            <button @click="navigateTo('/myaccount/myorders/' + order.orderNumber)" type="button" class="btn">
                                View
                            </button>
                        </div>
                    </div>
                </div>
              </div>

              <!-- Wishlist -->
              <div v-else-if="currentTab === 'wishlist'">
                <h2>My Wishlist</h2>

                <!-- <ProductGrid
          title="My Wishlist"
          eyebrow="You have added these products to your wishlist"
          :products="wishlistStore.items"
          layout="grid"
        /> -->
              </div>

            </template>
          </BaseTab>
        </section>
      </div>
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
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 48px;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  background: #fff;
  color: #7d8184;
  margin-top: 16px;
}
</style>
