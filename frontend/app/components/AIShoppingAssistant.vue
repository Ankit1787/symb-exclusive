<script setup lang="ts">
import { ref, nextTick, watch } from "vue";
import type { Product } from "~/types/product";

interface Message {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: Date;
  recommendations?: Array<{
    product: Product;
    reason: string;
    uri: string;
  }>;
}

const { $api } = useNuxtApp();
const isOpen = ref(false);
const userInput = ref("");
const isLoading = ref(false);
const messageContainer = ref<HTMLElement | null>(null);

// Default welcome message
const messages = ref<Message[]>([
  {
    id: "welcome",
    sender: "assistant",
    text: "Hello! I am your Exclusive AI Shopping Assistant. Ask me anything about our products, check for categories, or describe what you need (e.g., 'wireless headphones under 5000'). How can I help you today?",
    timestamp: new Date(),
  },
]);

// Quick suggestion chips
const suggestions = [
  "Gaming laptops",
  "Headphones under $100",
  "Fitness watches",
  "Featured items",
];

const toggleChat = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    scrollToBottom();
  }
};

const selectSuggestion = (suggestion: string) => {
  userInput.value = suggestion;
  sendMessage();
};

const scrollToBottom = async () => {
  await nextTick();
  if (messageContainer.value) {
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
  }
};

// Auto-scroll when messages change
watch(() => messages.value.length, scrollToBottom);

const sendMessage = async () => {
  if (!userInput.value.trim() || isLoading.value) return;

  const text = userInput.value.trim();
  userInput.value = "";

  // Append user message
  messages.value.push({
    id: Date.now().toString(),
    sender: "user",
    text,
    timestamp: new Date(),
  });

  isLoading.value = true;
  scrollToBottom();

  try {
    let responseData: any = null;

    try {
      // 1. Attempt POST to the requested endpoint: /api/ai/chat
      const response = await $api<{ success: boolean; data: any }>("/ai/chat", {
        method: "POST",
        body: { message: text },
      });
      responseData = response.data;
    } catch (chatError) {
      // 2. Fallback to existing backend endpoint: /api/ai/shopping/recommendations
      console.warn("POST /ai/chat failed, falling back to /ai/shopping/recommendations", chatError);
      
      const response = await $api<{ success: boolean; data: any }>("/ai/shopping/recommendations", {
        method: "POST",
        body: { message: text },
      });
      responseData = response.data;
    }

    // Append Assistant response
    messages.value.push({
      id: (Date.now() + 1).toString(),
      sender: "assistant",
      text: responseData.message || "Here are some recommendations:",
      timestamp: new Date(),
      recommendations: responseData.recommendations || [],
    });
  } catch (error) {
    console.error("AI Assistant request failed:", error);
    messages.value.push({
      id: (Date.now() + 1).toString(),
      sender: "assistant",
      text: "I am having trouble connecting to the shopping recommendation engine. Please check your network and try again.",
      timestamp: new Date(),
    });
  } finally {
    isLoading.value = false;
    scrollToBottom();
  }
};

const formatTime = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};
</script>

<template>
  <div class="ai-assistant-widget">
    <!-- Floating Button Trigger -->
    <button 
      class="floating-trigger" 
      :class="{ 'trigger--active': isOpen }" 
      @click="toggleChat"
      aria-label="Open AI Shopping Assistant"
    >
      <span v-if="!isOpen" class="icon-chat">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-message-circle"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
      </span>
      <span v-else class="icon-close">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </span>
      <span class="tooltip">AI Assistant</span>
    </button>

    <!-- Chat Card Panel -->
    <transition name="chat-panel-transition">
      <div v-if="isOpen" class="chat-card">
        <!-- Header -->
        <header class="chat-header">
          <div class="bot-profile">
            <div class="avatar-glow">
              <span class="bot-avatar">🤖</span>
              <span class="status-indicator"></span>
            </div>
            <div class="header-info">
              <h3>Shopping Assistant</h3>
              <p class="subtitle">AI Recommendation Engine</p>
            </div>
          </div>
          <button class="close-btn" @click="isOpen = false" aria-label="Close Chat">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-minus"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </button>
        </header>

        <!-- Message Body -->
        <main ref="messageContainer" class="chat-messages">
          <div 
            v-for="msg in messages" 
            :key="msg.id" 
            :class="['message-row', msg.sender === 'user' ? 'row-user' : 'row-bot']"
          >
            <div class="message-bubble" :class="`bubble-${msg.sender}`">
              <p class="message-text">{{ msg.text }}</p>
              
              <!-- Recommended Products Section -->
              <div v-if="msg.recommendations && msg.recommendations.length > 0" class="recommendations-box">
                <p class="rec-title">Recommended Products:</p>
                <div class="rec-scroll-container">
                  <div 
                    v-for="rec in msg.recommendations" 
                    :key="rec.product?._id || rec.productId" 
                    class="rec-card"
                  >
                    <NuxtLink :to="`/product/${rec.product?._id}`" class="rec-card-link">
                      <img 
                        :src="rec.product?.thumbnail || '/placeholder.png'" 
                        alt="Product Image" 
                        class="rec-thumb"
                      />
                      <div class="rec-info">
                        <span class="rec-brand">{{ rec.product?.brand }}</span>
                        <h4 class="rec-name">{{ rec.product?.title }}</h4>
                        <div class="rec-price-row">
                          <span class="rec-price">${{ rec.product?.price }}</span>
                          <span v-if="rec.product?.mrp" class="rec-mrp">${{ rec.product?.mrp }}</span>
                        </div>
                        <p class="rec-reason">{{ rec.reason }}</p>
                      </div>
                    </NuxtLink>
                  </div>
                </div>
              </div>

              <span class="timestamp">{{ formatTime(msg.timestamp) }}</span>
            </div>
          </div>

          <!-- Typing Indicator -->
          <div v-if="isLoading" class="message-row row-bot">
            <div class="message-bubble bubble-assistant bubble-typing">
              <span class="dot"></span>
              <span class="dot"></span>
              <span class="dot"></span>
            </div>
          </div>
        </main>

        <!-- Suggestions / Quick Prompts -->
        <div v-if="messages.length === 1 && !isLoading" class="quick-suggestions">
          <button 
            v-for="sug in suggestions" 
            :key="sug" 
            class="suggestion-chip"
            @click="selectSuggestion(sug)"
          >
            {{ sug }}
          </button>
        </div>

        <!-- Footer / Form Input -->
        <footer class="chat-footer">
          <form @submit.prevent="sendMessage" class="input-form">
            <input 
              v-model="userInput" 
              type="text" 
              placeholder="Ask for recommendations..." 
              required
              :disabled="isLoading"
              class="chat-input"
            />
            <button type="submit" :disabled="isLoading || !userInput.trim()" class="send-btn">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-send"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </button>
          </form>
        </footer>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.ai-assistant-widget {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 9999;
  font-family: "Inter", system-ui, sans-serif;
}

/* Floating button */
.floating-trigger {
  width: 58px;
  height: 58px;
  border-radius: 50%;
  background: linear-gradient(135deg, #db4444 0%, #ff5e5e 100%);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(219, 68, 68, 0.4);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
}

.floating-trigger:hover {
  transform: scale(1.08) translateY(-3px);
  box-shadow: 0 12px 30px rgba(219, 68, 68, 0.55);
}

.floating-trigger:active {
  transform: scale(0.95);
}

.trigger--active {
  background: #252830;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.icon-chat, .icon-close {
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-chat svg, .icon-close svg {
  width: 26px;
  height: 26px;
}

.tooltip {
  position: absolute;
  right: 70px;
  background-color: #1a1a1a;
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  opacity: 0;
  transform: translateX(10px);
  transition: all 0.2s ease;
  pointer-events: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.floating-trigger:hover .tooltip {
  opacity: 1;
  transform: translateX(0);
}

/* Chat Card Container */
.chat-card {
  position: absolute;
  bottom: 80px;
  right: 0;
  width: 380px;
  height: 580px;
  border-radius: 16px;
  background-color: #ffffff;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  backdrop-filter: blur(10px);
}

/* Header */
.chat-header {
  padding: 16px;
  background: linear-gradient(135deg, #252830 0%, #1e2026 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.bot-profile {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar-glow {
  width: 40px;
  height: 40px;
  background: rgba(219, 68, 68, 0.15);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.bot-avatar {
  font-size: 20px;
}

.status-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #00ca72;
  border: 2px solid #252830;
  position: absolute;
  bottom: 0;
  right: 0;
}

.header-info h3 {
  font-size: 15px;
  margin: 0;
  font-weight: 600;
  letter-spacing: -0.2px;
}

.header-info p {
  font-size: 11px;
  margin: 2px 0 0 0;
  color: #a0aec0;
}

.close-btn {
  background: transparent;
  border: none;
  color: #a0aec0;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s;
  display: flex;
}

.close-btn:hover {
  color: white;
  background-color: rgba(255, 255, 255, 0.1);
}

.close-btn svg {
  width: 20px;
  height: 20px;
}

/* Chat Messages */
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background-color: #f8f9fa;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message-row {
  display: flex;
  width: 100%;
}

.row-user {
  justify-content: flex-end;
}

.row-bot {
  justify-content: flex-start;
}

.message-bubble {
  max-width: 85%;
  padding: 12px 16px;
  border-radius: 14px;
  font-size: 13.5px;
  line-height: 1.5;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
  position: relative;
}

.bubble-user {
  background: linear-gradient(135deg, #db4444 0%, #ff5e5e 100%);
  color: white;
  border-bottom-right-radius: 2px;
}

.bubble-assistant {
  background-color: #ffffff;
  color: #2d3748;
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-bottom-left-radius: 2px;
}

.message-text {
  margin: 0 0 4px 0;
  white-space: pre-line;
}

.timestamp {
  font-size: 9px;
  color: rgba(0, 0, 0, 0.35);
  float: right;
  margin-top: 4px;
}

.bubble-user .timestamp {
  color: rgba(255, 255, 255, 0.7);
}

/* Suggestions */
.quick-suggestions {
  padding: 10px 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  background-color: #f8f9fa;
  border-top: 1px solid rgba(0, 0, 0, 0.04);
}

.suggestion-chip {
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 6px 12px;
  font-size: 12px;
  color: #4a5568;
  cursor: pointer;
  transition: all 0.2s;
}

.suggestion-chip:hover {
  background-color: #db4444;
  color: white;
  border-color: #db4444;
  transform: translateY(-1px);
}

/* Recommendations Card Box */
.recommendations-box {
  margin-top: 12px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  padding-top: 10px;
}

.rec-title {
  font-size: 12px;
  font-weight: 700;
  color: #db4444;
  margin: 0 0 8px 0;
}

.rec-scroll-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.rec-card {
  background-color: #f8f9fa;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.2s;
}

.rec-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border-color: #db4444;
}

.rec-card-link {
  display: flex;
  text-decoration: none;
  color: inherit;
}

.rec-thumb {
  width: 80px;
  height: 80px;
  object-fit: cover;
  background-color: #ffffff;
  border-right: 1px solid rgba(0, 0, 0, 0.06);
  flex-shrink: 0;
}

.rec-info {
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
}

.rec-brand {
  font-size: 10px;
  text-transform: uppercase;
  color: #718096;
  font-weight: 600;
}

.rec-name {
  font-size: 13px;
  font-weight: 600;
  margin: 2px 0 4px 0;
  color: #1a202c;
  line-height: 1.3;
}

.rec-price-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.rec-price {
  font-size: 13px;
  font-weight: 700;
  color: #db4444;
}

.rec-mrp {
  font-size: 11px;
  text-decoration: line-through;
  color: #a0aec0;
}

.rec-reason {
  font-size: 11px;
  color: #4a5568;
  margin: 4px 0 0 0;
  font-style: italic;
  line-height: 1.3;
}

/* Footer / Input Form */
.chat-footer {
  padding: 12px 16px;
  background-color: #ffffff;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.input-form {
  display: flex;
  gap: 8px;
  align-items: center;
}

.chat-input {
  flex: 1;
  border: 1px solid #e2e8f0;
  padding: 10px 14px;
  border-radius: 24px;
  font-size: 13px;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.chat-input:focus {
  border-color: #db4444;
  box-shadow: 0 0 0 3px rgba(219, 68, 68, 0.1);
}

.send-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #db4444;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;
}

.send-btn:hover:not(:disabled) {
  background-color: #c53030;
  transform: scale(1.05);
}

.send-btn:disabled {
  background-color: #cbd5e0;
  cursor: not-allowed;
}

.send-btn svg {
  width: 16px;
  height: 16px;
  margin-left: -1px;
}

/* Bouncing dots typing indicator */
.bubble-typing {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 12px 18px;
}

.dot {
  width: 6px;
  height: 6px;
  background-color: #718096;
  border-radius: 50%;
  display: inline-block;
  animation: bounce 1.4s infinite both;
}

.dot:nth-child(2) {
  animation-delay: .2s;
}

.dot:nth-child(3) {
  animation-delay: .4s;
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0.6);
    opacity: 0.4;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Panel Transitions */
.chat-panel-transition-enter-active,
.chat-panel-transition-leave-active {
  transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);
}

.chat-panel-transition-enter-from,
.chat-panel-transition-leave-to {
  opacity: 0;
  transform: scale(0.85) translateY(30px);
}

/* Mobile Responsive */
@media (max-width: 480px) {
  .ai-assistant-widget {
    bottom: 20px;
    right: 20px;
  }

  .chat-card {
    position: fixed;
    bottom: 0;
    right: 0;
    width: 100vw;
    height: 100vh;
    border-radius: 0;
    border: none;
    z-index: 10000;
  }

  .floating-trigger {
    z-index: 10001;
  }
}
</style>
