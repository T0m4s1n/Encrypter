<script>
import {
  MessageCircle as MessageCircleIcon,
  MapPin as MapPinIcon,
  Phone as PhoneIcon,
  Mail as MailIcon,
  Twitter as TwitterIcon,
  Linkedin as LinkedinIcon,
  Github as GithubIcon,
  Instagram as InstagramIcon,
  User as UserIcon,
  AtSign as AtSignIcon,
  Tag as TagIcon,
  MessageSquare as MessageSquareIcon,
  Send as SendIcon,
  Loader as LoaderIcon,
  CheckCircle as CheckCircleIcon
} from 'lucide-vue-next'

export default {
  name: 'ContactSection',
  components: {
    MessageCircleIcon,
    MapPinIcon,
    PhoneIcon,
    MailIcon,
    TwitterIcon,
    LinkedinIcon,
    GithubIcon,
    InstagramIcon,
    UserIcon,
    AtSignIcon,
    TagIcon,
    MessageSquareIcon,
    SendIcon,
    LoaderIcon,
    CheckCircleIcon
  },
  data() {
    return {
      formData: {
        name: '',
        email: '',
        subject: '',
        message: ''
      },
      errors: {},
      isSubmitting: false,
      showSuccessModal: false
    }
  },
  methods: {
    validateForm() {
      const errors = {}
      
      if (!this.formData.name.trim()) {
        errors.name = 'Name is required'
      }
      
      if (!this.formData.email.trim()) {
        errors.email = 'Email is required'
      } else if (!this.isValidEmail(this.formData.email)) {
        errors.email = 'Please enter a valid email'
      }
      
      if (!this.formData.subject.trim()) {
        errors.subject = 'Subject is required'
      }
      
      if (!this.formData.message.trim()) {
        errors.message = 'Message is required'
      }
      
      this.errors = errors
      return Object.keys(errors).length === 0
    },
    
    isValidEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    },
    
    clearError(field) {
      this.$delete(this.errors, field)
    },
    
    async handleSubmit() {
      if (!this.validateForm()) return
      
      this.isSubmitting = true
      
      try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      window.dispatchEvent(new CustomEvent('newContactMessage', {
        detail: { ...this.formData }
      }))
      this.showSuccessModal = true
      this.resetForm()
      } catch (error) {
      console.error('Error sending message:', error)
      } finally {
      this.isSubmitting = false
      }
    },
    
    resetForm() {
      this.formData = {
        name: '',
        email: '',
        subject: '',
        message: ''
      }
      this.errors = {}
    }
  }
}
</script>
<template>
    <section class="contact-container">
      <div class="contact-content">
        <div class="contact-header">
          <h2 class="section-title">
            <MessageCircleIcon class="title-icon" />
            Get in Touch
          </h2>
          <p class="section-subtitle">
            Have a question about the tool or want to get in touch? Send us a message and we'll get back to you as soon as possible.
          </p>
        </div>
  
        <div class="contact-grid">
          <div class="contact-info">
            <div class="info-card">
              <div class="info-header">
                <MapPinIcon class="info-icon" />
                <h3>Visit Us</h3>
              </div>
              <p>Pasto, Nariño</p>
              <p>Universidad Cooperativa de Colombia</p>
            </div>
  
            <div class="info-card">
              <div class="info-header">
                <PhoneIcon class="info-icon" />
                <h3>Call Us</h3>
              </div>
              <p>+57 (310)6406198</p>
              <p>Mon - Fri, 9am - 6pm</p>
            </div>
  
            <div class="info-card">
              <div class="info-header">
                <MailIcon class="info-icon" />
                <h3>Email Us</h3>
              </div>
              <p>pandelpipas@gmail.com</p>
              <p>tomas.benavidesc@campusucc.edu.co</p>
            </div>
  
            <div class="social-links">
              <a href="#" class="social-icon" aria-label="Twitter">
                <TwitterIcon />
              </a>
              <a href="https://www.linkedin.com/in/tomas-benavides-calderon-97a196333/" class="social-icon" aria-label="LinkedIn">
                <LinkedinIcon />
              </a>
              <a href="https://github.com/T0m4s1n" class="social-icon" aria-label="GitHub">
                <GithubIcon />
              </a>
              <a href="#" class="social-icon" aria-label="Instagram">
                <InstagramIcon />
              </a>
            </div>
          </div>
          <div class="contact-form">
            <form @submit.prevent="handleSubmit" class="form">
              <div class="form-group">
                <label for="name">
                  <UserIcon class="form-icon" />
                  Name
                </label>
                <input 
                  id="name"
                  v-model="formData.name"
                  type="text"
                  :class="{ 'error': errors.name }"
                  @focus="clearError('name')"
                  placeholder="Enter your name"
                />
                <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
              </div>
  
              <div class="form-group">
                <label for="email">
                  <AtSignIcon class="form-icon" />
                  Email
                </label>
                <input 
                  id="email"
                  v-model="formData.email"
                  type="email"
                  :class="{ 'error': errors.email }"
                  @focus="clearError('email')"
                  placeholder="Enter your email"
                />
                <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
              </div>
  
              <div class="form-group">
                <label for="subject">
                  <TagIcon class="form-icon" />
                  Subject
                </label>
                <input 
                  id="subject"
                  v-model="formData.subject"
                  type="text"
                  :class="{ 'error': errors.subject }"
                  @focus="clearError('subject')"
                  placeholder="Enter subject"
                />
                <span v-if="errors.subject" class="error-message">{{ errors.subject }}</span>
              </div>
  
              <div class="form-group">
                <label for="message">
                  <MessageSquareIcon class="form-icon" />
                  Message
                </label>
                <textarea 
                  id="message"
                  v-model="formData.message"
                  :class="{ 'error': errors.message }"
                  @focus="clearError('message')"
                  placeholder="Enter your message"
                  rows="5"
                ></textarea>
                <span v-if="errors.message" class="error-message">{{ errors.message }}</span>
              </div>
  
              <button type="submit" class="submit-button" :disabled="isSubmitting">
                <SendIcon v-if="!isSubmitting" class="button-icon" />
                <LoaderIcon v-else class="button-icon spinning" />
                {{ isSubmitting ? 'Sending...' : 'Send Message' }}
              </button>
            </form>
          </div>
        </div>
      </div>
      <Transition name="fade">
        <div v-if="showSuccessModal" class="success-modal">
          <div class="modal-content">
            <CheckCircleIcon class="success-icon" />
            <h3>Message Sent!</h3>
            <p>We'll get back to you as soon as possible.</p>
            <button @click="showSuccessModal = false" class="close-button">
              Close
            </button>
          </div>
        </div>
      </Transition>
    </section>
</template>
<style scoped>
.contact-container {
  background: linear-gradient(135deg, #0a0a0a, #1a1a1a);
  min-height: 100vh;
  padding: 4rem 1rem;
  position: relative;
  margin-top: 50px;    
  
}

.contact-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.contact-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  color: #fff;
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  margin-bottom: 1rem;
  animation: fadeInDown 0.6s ease-out;
}

.title-icon {
  color: #fff;
  width: clamp(24px, 4vw, 32px);
  height: clamp(24px, 4vw, 32px);
}

.section-subtitle {
  color: #a0a0a0;
  font-size: clamp(1rem, 2vw, 1.2rem);
  animation: fadeInUp 0.6s ease-out;
}

.contact-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 768px) {
  .contact-grid {
    grid-template-columns: 1fr 1.5fr;
    gap: 3rem;
  }
}

.contact-info {
  animation: fadeInLeft 0.6s ease-out;
}

.info-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 1.25rem;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
}

.info-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.info-icon {
  color: #fff;
  width: 20px;
  height: 20px;
}

.info-card h3 {
  color: #fff;
  font-size: clamp(1rem, 2vw, 1.25rem);
  margin: 0;
}

.info-card p {
  color: #a0a0a0;
  font-size: clamp(0.875rem, 1.5vw, 1rem);
  margin: 0.25rem 0;
}

.social-links {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
  flex-wrap: wrap;
}

.social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  transition: all 0.3s ease;
}

.contact-form {
  animation: fadeInRight 0.6s ease-out;
}

.form {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: clamp(1rem, 3vw, 2rem);
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #fff;
  font-size: clamp(0.875rem, 1.5vw, 1rem);
  margin-bottom: 0.5rem;
}

input, textarea {
  width: 95%;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #fff;
  font-size: clamp(0.875rem, 1.5vw, 1rem);
}

input.error, textarea.error {
    border-color: #ff4444;
  }
  
  .error-message {
    color: #ff4444;
    font-size: 0.9rem;
    margin-top: 0.5rem;
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
  }

  .submit-button:hover:not(:disabled) {
    background: #00cc00;
    transform: translateY(-2px);
  }
  
  .submit-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
.success-modal {
  padding: 1rem;
}

@keyframes slideInRight {
  0% {
    transform: translateX(100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

.modal-content {
  color: #f2f2f2;
  padding: clamp(1.5rem, 4vw, 2rem);
  width: min(90%, 400px);
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  text-align: center;
  animation: slideInRight 0.6s ease-out;
}

.close-button {
  display: block;
  margin: 1rem auto;
  padding: 0.5rem 1rem;
  background: #ff4444;
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.3s ease;
}

.close-button:hover {
  background: #cc0000;
  transform: scale(1.05);
}

.success-icon {
  width: clamp(36px, 6vw, 48px);
  height: clamp(36px, 6vw, 48px);
}

.modal-content h3 {
  font-size: clamp(1.25rem, 3vw, 1.5rem);
}

.modal-content p {
  font-size: clamp(0.875rem, 2vw, 1rem);
}

@media (max-width: 480px) {
  .contact-container {
    padding: 2rem 0.5rem;
  }
  
  .contact-content {
    padding: 0 0.5rem;
  }
  
  .info-card {
    padding: 1rem;
  }
  
  .social-links {
    justify-content: center;
  }
  
  .form {
    padding: 1rem;
  }
}

@media (hover: hover) {
  .info-card:hover {
    transform: translateY(-3px);
    background: rgba(255, 255, 255, 0.08);
  }
  
  .social-icon:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
    color: #f2f2f2;
  }
  
  .submit-button:hover:not(:disabled) {
    background: #f2f2f2;
    transform: translateY(-2px);
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
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

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>