<script>
import { 
  Shield as ShieldIcon, 
  Key as KeyIcon, 
  Lock as LockIcon,
  FileKey as FileKeyIcon
} from 'lucide-vue-next'

export default {
  name: 'EncryptedTitle',
  components: {
    ShieldIcon,
    KeyIcon,
    LockIcon,
    FileKeyIcon
  },
  data() {
    return {
      originalText: 'Vault Encrypter',
      displayText: 'Vault Encrypter',
      isEncrypting: false,
      features: [
        {
          icon: 'ShieldIcon',
          title: 'Security',
          description: 'Complete encryption for your sensitive data'
        },
        {
          icon: 'KeyIcon',
          title: 'Key Management',
          description: 'Secure key distribution and management system'
        },
        {
          icon: 'LockIcon',
          title: 'Zero Knowledge',
          description: 'End-to-end encryption with zero knowledge architecture'
        },
        {
          icon: 'FileKeyIcon',
          title: 'File Protection',
          description: 'Secure file encryption and sharing capabilities'
        }
      ]
    }
  },
  mounted() {
    this.startAnimation()
  },
  methods: {
    startAnimation() {
      setInterval(() => {
        this.isEncrypting = true
        setTimeout(() => {
          this.scrambleText()
        }, 500)
        
        setTimeout(() => {
          this.displayText = this.originalText
          this.isEncrypting = false
        }, 2000)
      }, 5000)
    },
    scrambleText() {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+'
      this.displayText = this.originalText
        .split('')
        .map(char => char === ' ' ? ' ' : chars[Math.floor(Math.random() * chars.length)])
        .join('')
    }
  }
}
</script>
<template>
    <div class="encrypted-container">
      <h1 class="encrypted-title">
        <span 
          v-for="(char, index) in displayText" 
          :key="index"
          :style="{ '--delay': `${index * 0.1}s` }"
          class="char"
          :class="{ 'encrypted': isEncrypting }"
        >
          {{ char }}
        </span>
      </h1>
      <div class="info-content">
        <div class="features">
          <div v-for="(feature, index) in features" 
               :key="index" 
               class="feature-card"
               :style="{ '--delay': `${index * 0.2}s` }">
            <component :is="feature.icon" class="feature-icon" />
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </div>
</template>
  
  <style scoped>
  .encrypted-container {
    background: linear-gradient(135deg, #0a0a0a, #1a1a1a);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem 2rem;
  }
  
  .encrypted-title {
    font-size: 4rem;
    color: #fff;
    margin-bottom: 4rem;
    text-align: center;
  }
  
  .char {
    display: inline-block;
    transition: all 0.3s ease;
    animation: fadeIn 0.5s ease-out forwards;
    animation-delay: var(--delay);
    position: relative;
  }
  
  .char.encrypted {
    color: #fff;
    text-shadow: 0 0 10px #fff;     
  }
  
  .info-content {
    max-width: 1200px;
    width: 100%;
  }
  
  .features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
  }
  
  .feature-card {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 15px;
    padding: 2rem;
    text-align: center;
    transition: all 0.3s ease;
    opacity: 0;
    animation: fadeInUp 0.6s ease-out forwards;
    animation-delay: var(--delay);
  }
  
  .feature-card:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.08);
  }
  
  .feature-icon {
    width: 48px;
    height: 48px;
    color: #fff;
    margin-bottom: 1rem;
  }
  
  .feature-card h3 {
    color: #fff;
    margin-bottom: 1rem;
    font-size: 1.5rem;
  }
  
  .feature-card p {
    color: #a0a0a0;
    line-height: 1.6;
  }
  
  @keyframes scramble {
    0% { transform: translateY(-1px); }
    50% { transform: translateY(1px); }
    100% { transform: translateY(-1px); }
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
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
  
  @media (max-width: 768px) {
    .encrypted-title {
      font-size: 3rem;
    }
    
    .features {
      gap: 1.5rem;
    }
  }
  
  @media (max-width: 480px) {
    .encrypted-title {
      font-size: 2rem;
    }
    
    .encrypted-container {
      padding: 2rem 1rem;
    }
  }
</style>