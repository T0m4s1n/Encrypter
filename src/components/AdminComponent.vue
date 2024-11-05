<script>
import { Trash2 as TrashIcon } from 'lucide-vue-next'

export default {
  name: 'AdminComponent',
  components: {
    TrashIcon
  },
  data() {
    return {
      messageStack: [],
      loading: true,
      error: null
    }
  },
  computed: {
    hasMessages() {
      return this.messageStack.length > 0;
    }
  },
  methods: {
    loadMessages() {
      try {
        const stored = localStorage.getItem('contactMessages');
        if (stored) {
          this.messageStack = JSON.parse(stored).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        }
      } catch (error) {
        this.error = 'Error loading messages';
        console.error('Error loading messages:', error);
      } finally {
        this.loading = false;
      }
    },
    saveMessages() {
      try {
        localStorage.setItem('contactMessages', JSON.stringify(this.messageStack));
      } catch (error) {
        this.error = 'Error saving messages';
        console.error('Error saving messages:', error);
      }
    },
    addMessage(message) {
      const newMessage = {
        ...message,
        id: Date.now(),
        timestamp: new Date().toISOString()
      };
      this.messageStack.unshift(newMessage); // Agregar al principio
      this.saveMessages();
    },
    removeLastMessage() {
      if (this.hasMessages) {
        this.messageStack.pop();
        this.saveMessages();
      }
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleString();
    }
  },
  mounted() {
    this.loadMessages();
    window.addEventListener('newContactMessage', (event) => {
      this.addMessage(event.detail);
    });
  },
  beforeDestroy() {
    window.removeEventListener('newContactMessage');
  }
}
</script>

<template>
  <div class="admin-container">
    <div class="admin-header">
      <h2>Contact Messages Admin</h2>
      <p class="stack-info">Messages in stack: {{ messageStack.length }}</p>
    </div>

    <div v-if="loading" class="loading">
      Loading messages...
    </div>

    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>

    <div v-else-if="messageStack.length === 0" class="empty-state">
      No messages in the stack
    </div>

    <div v-else class="messages-container">
      <div class="message-stack">
        <div 
          v-for="(message, index) in messageStack"
          :key="message.id"
          class="message-card"
          :class="{ 'last-message': index === 0 }"
        >
          <div class="message-header">
            <span class="position-indicator">
              {{ index === 0 ? 'Most Recent' : `Message ${index + 1}` }}
            </span>
            <span class="timestamp">{{ formatDate(message.timestamp) }}</span>
          </div>
          
          <div class="message-content">
            <div class="message-field">
              <strong>Name:</strong> {{ message.name }}
            </div>
            <div class="message-field">
              <strong>Email:</strong> {{ message.email }}
            </div>
            <div class="message-field">
              <strong>Subject:</strong> {{ message.subject }}
            </div>
            <div class="message-field">
              <strong>Message:</strong>
              <p class="message-text">{{ message.message }}</p>
            </div>
          </div>

          <div 
            v-if="index === 0"
            class="message-actions"
          >
            <button 
              @click="removeLastMessage"
              class="delete-button"
            >
              <TrashIcon class="trash-icon" />
              Delete Most Recent Message
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

.admin-container {
  background: #000;
  margin-top: 5rem;
  padding: 2rem;
  color: #fff;
}

.admin-header {
  text-align: center;
  margin-bottom: 2rem;
}

.admin-header h2 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.stack-info {
  color: #a0a0a0;
  font-family: "Poppins", sans-serif;
}

.controls {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  justify-content: center;
}

.control-button {
  padding: 0.75rem 1.5rem;
  background: #333;
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.control-button:hover:not(.disabled) {
  background: #444;
}

.control-button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.message-stack {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 800px;
  margin: 0 auto;
  font-family: "Poppins", sans-serif;
}

.message-card {
  background: #2a2a2a;
  border-radius: 12px;
  padding: 1.5rem;
  position: relative;
  transition: all 0.3s ease;
}

.first-message {
  border: 2px solid #4CAF50;
}

.last-message {
  border: 2px solid #fff;
}

.message-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #444;
}

.position-indicator {
  font-weight: bold;
  color: #ccc;
}

.timestamp {
  color: #888;
  font-size: 0.9rem;
}

.message-content {
  display: grid;
  gap: 0.75rem;
}

.message-field {
  line-height: 1.4;
}

.message-field strong {
  color: #ccc;
}

.message-text {
  margin-top: 0.5rem;
  white-space: pre-wrap;
}

.message-actions {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #444;
}

.delete-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #ff4444;
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: "Poppins", sans-serif;
}

.delete-button:hover {
  background: #ff6666;
}

.empty-state{
  font-family: "Poppins", sans-serif;
}

.trash-icon {
  width: 18px;
  height: 18px;
}

.loading, .error-message, .empty-state {
  text-align: center;
  padding: 2rem;
  color: #a0a0a0;
}

.error-message {
  color: #ff4444;
}

@media (max-width: 768px) {
  .admin-container {
    padding: 1rem;
  }

  .controls {
    flex-direction: column;
  }

  .message-header {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
