<script>
import {
  AlertCircle as AlertCircleIcon,
  Home as HomeIcon,
  Search as SearchIcon,
  ArrowLeft as ArrowLeftIcon
} from 'lucide-vue-next'

export default {
  name: 'NotFound',
  components: {
    AlertCircleIcon,
    HomeIcon,
    SearchIcon,
    ArrowLeftIcon
  },
  methods: {
    handleGoBack() {
      window.history.back()
    }
  }
}
</script>

<template>
  <section class="not-found-container">
    <div class="not-found-content">
      <div class="error-card">
        <div class="icon-wrapper">
          <AlertCircleIcon class="alert-icon" />
        </div>
        
        <h1 class="error-title">404</h1>
        <h2 class="error-subtitle">Oops! Page Not Found</h2>
        
        <p class="error-message">
          The page you are looking for might have been removed, 
          had its name changed, or is temporarily unavailable.
        </p>
        
        <div class="buttons-container">
          <button @click="handleGoBack" class="action-button back-button">
            <ArrowLeftIcon class="button-icon" />
            Go Back
          </button>
          
          <router-link to="/" class="action-button home-button">
            <HomeIcon class="button-icon" />
            Home Page
          </router-link>
          
          <router-link to="/search" class="action-button search-button">
            <SearchIcon class="button-icon" />
            Search Site
          </router-link>
        </div>

        <div class="support-info">
          <p>
            If you believe this is a technical error, please contact our support team.
          </p>
        </div>
      </div>
    </div>
    
    <div class="background-decoration">
      <div class="decoration-orb orb-1"></div>
      <div class="decoration-orb orb-2"></div>
    </div>
  </section>
</template>

<style scoped>
.not-found-container {
  background: linear-gradient(135deg, #0a0a0a, #1a1a1a);
  min-height: 100vh;
  padding: 4rem 1rem;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.not-found-content {
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  padding: 0 1rem;
  position: relative;
  z-index: 1;
}

.error-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: clamp(2rem, 5vw, 3rem);
  text-align: center;
  backdrop-filter: blur(10px);
  animation: fadeInUp 0.6s ease-out;
}

.icon-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.alert-icon {
  width: clamp(48px, 8vw, 64px);
  height: clamp(48px, 8vw, 64px);
  color: #ff4444;
  animation: bounce 2s infinite;
}

.error-title {
  color: #fff;
  font-size: clamp(3rem, 10vw, 5rem);
  font-weight: bold;
  margin-bottom: 1rem;
  animation: fadeInDown 0.6s ease-out;
}

.error-subtitle {
  color: #fff;
  font-size: clamp(1.5rem, 4vw, 2rem);
  margin-bottom: 1.5rem;
  animation: fadeInDown 0.6s ease-out 0.2s backwards;
}

.error-message {
  color: #a0a0a0;
  font-size: clamp(1rem, 2vw, 1.2rem);
  margin-bottom: 2rem;
  animation: fadeInDown 0.6s ease-out 0.4s backwards;
}

.buttons-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
  animation: fadeInUp 0.6s ease-out 0.6s backwards;
}

.action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
  text-decoration: none;
}

.back-button {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: none;
  cursor: pointer;
}

.home-button {
  background: #fff;
  color: #000;
}

.search-button {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.button-icon {
  width: 20px;
  height: 20px;
}

.support-info {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 1.5rem;
  margin-top: 1.5rem;
  animation: fadeInUp 0.6s ease-out 0.8s backwards;
}

.support-info p {
  color: #666;
  font-size: 0.875rem;
}

.background-decoration {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
}

.decoration-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
}

.orb-1 {
  top: 25%;
  left: 25%;
  width: 300px;
  height: 300px;
  background: rgba(255, 68, 68, 0.1);
  animation: float 10s infinite ease-in-out;
}

.orb-2 {
  bottom: 25%;
  right: 25%;
  width: 250px;
  height: 250px;
  background: rgba(68, 107, 255, 0.1);
  animation: float 15s infinite ease-in-out reverse;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(-30px, 30px);
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

@media (max-width: 640px) {
  .buttons-container {
    flex-direction: column;
  }
  
  .action-button {
    width: 100%;
  }
}

@media (hover: hover) {
  .back-button:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }
  
  .home-button:hover {
    background: #f2f2f2;
    transform: translateY(-2px);
  }
  
  .search-button:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }
}
</style>