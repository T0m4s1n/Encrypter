<script lang="ts">
import { defineComponent, ref } from 'vue'
import { CheckCircleIcon, XCircleIcon } from 'lucide-vue-next'

export default defineComponent({
  name: 'MessageAlert',
  components: {
    CheckCircleIcon,
    XCircleIcon
  },
  props: {
    message: {
      type: String,
      default: 'Please accept the terms and conditions to continue'
    }
  },
  emits: ['accepted'],
  setup(props, { emit }) {
    const showModal = ref(true)
    const hasAccepted = ref(false)

    const acceptTerms = () => {
      hasAccepted.value = true
      showModal.value = false
      emit('accepted')
      localStorage.setItem('termsAccepted', 'true')
    }

    const closeModal = () => {
      showModal.value = false
      window.location.href = 'https://www.google.com'
    }

    const checkPreviousAcceptance = () => {
      const previouslyAccepted = localStorage.getItem('termsAccepted')
      if (previouslyAccepted === 'true') {
        hasAccepted.value = true
        showModal.value = false
      }
    }

    checkPreviousAcceptance()

    return {
      showModal,
      hasAccepted,
      acceptTerms,
      closeModal
    }
  }
})
</script>

<template>
  <Transition name="fade">
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-wrapper">
        <div class="modal-content">
          <XCircleIcon class="success-icon mx-auto mb-4" />
          <h3>Terms and Conditions</h3>
          <p class="section-subtitle">{{ message }}</p>
          
          <div class="form-group mt-6">
            <div class="info-card overflow-y-auto max-h-48">
              <h4 class="text-white font-medium mb-2">1. Acceptance of Terms</h4>
              <p class="text-gray-400 mb-4">By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.</p>
              
              <h4 class="text-white font-medium mb-2">2. Use License</h4>
              <p class="text-gray-400 mb-4">With the use of the application you accept that your files will be public to the rest of users, due to the experimental use of the application and the state of development that the application us currently on</p>
            </div>
          </div>

          <div class="mt-6 flex flex-col gap-4">
            <button
              @click="acceptTerms"
              class="submit-button"
            >
              <CheckCircleIcon class="w-5 h-5" />
              I Accept
            </button>
            
            <button 
              @click="closeModal"
              class="close-button"
            >
              Decline and Return
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(10, 10, 10, 0.95), rgba(26, 26, 26, 0.95));
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  padding: 1rem;
}

.modal-wrapper {
  width: 100%;
  max-width: 500px;
  margin: auto;
  animation: slideInDown 0.5s ease-out;
}

.modal-content {
  color: #f2f2f2;
  padding: clamp(1.5rem, 4vw, 2rem);
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  text-align: center;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.success-icon {
  width: clamp(36px, 6vw, 48px);
  height: clamp(36px, 6vw, 48px);
  color: #ff4444;
}

.submit-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 1rem;
  background: #fff;
  color: #000;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
}

.submit-button:hover {
  background: #00cc00;
  transform: translateY(-2px);
}

.close-button {
  margin-top: 1rem;
  display: block;
  width: 100%;
  padding: 0.5rem 1rem;
  background: #ff4444;
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.3s ease;
  font-family: "Poppins", sans-serif;
}

.close-button:hover {
  background: #cc0000;
  transform: translateY(-2px);
}

.info-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 1.25rem;
  transition: all 0.3s ease;
}

.section-subtitle {
  color: #a0a0a0;
  font-size: clamp(1rem, 2vw, 1.2rem);
  animation: fadeInUp 0.6s ease-out;
}

@keyframes slideInDown {
  0% {
    transform: translateY(-20px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

@media (max-width: 480px) {
  .modal-overlay {
    padding: 1rem;
  }
  
  .modal-content {
    padding: 1.25rem;
  }
  
  .info-card {
    padding: 1rem;
  }
}
</style>
