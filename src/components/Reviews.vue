<script>
import { Star as StarIcon, Calendar as CalendarIcon } from 'lucide-vue-next'

export default {
  name: 'ReviewsSection',
  components: {
    StarIcon,
    CalendarIcon
  },
  data() {
    return {
      reviews: [
        {
          name: 'Alex Johnson',
          company: 'Tech Solutions Inc.',
          rating: 5,
          text: 'Absolutely amazing service! The attention to detail and technical expertise demonstrated were outstanding. Would highly recommend for any complex development projects.',
          date: 'Oct 15, 2024'
        },
        {
          name: 'Sarah Miller',
          company: 'Digital Innovations',
          rating: 5,
          text: 'The team went above and beyond our expectations. Their innovative approach to problem-solving and commitment to quality made our project a huge success.',
          date: 'Nov 21, 2024'
        },
        {
          name: 'David Chen',
          company: 'StartUp Labs',
          rating: 4,
          text: 'Great experience working with this team. They brought our vision to life with their technical expertise and creative solutions. Looking forward to future collaborations.',
          date: 'Nov 1, 2024'
        },
        {
          name: 'Emily Brooks',
          company: 'Creative Minds Co.',
          rating: 5,
          text: 'Exceptional service from start to finish. The teams communication was excellent, and they delivered exactly what we needed, on time and within budget.',
          date: 'Oct 25, 2024'
        }
      ]
    }
  }
}
</script>
<template>
    <section class="reviews-container">
      <div class="reviews-content">
        <h2 class="section-title">
          <StarIcon class="title-icon" />
          Client Reviews
        </h2>
        <div class="reviews-grid">
          <div v-for="(review, index) in reviews" 
               :key="index" 
               class="review-card"
               :style="{ '--delay': `${index * 0.2}s` }">
            <div class="review-header">
              <div class="avatar">
                {{ review.name.charAt(0) }}
              </div>
              <div class="review-info">
                <h3>{{ review.name }}</h3>
                <p class="company">{{ review.company }}</p>
              </div>
              <div class="rating">
                <StarIcon v-for="n in 5" 
                         :key="n" 
                         :class="['star', n <= review.rating ? 'filled' : '']" />
              </div>
            </div>
            
            <p class="review-text">{{ review.text }}</p>
            
            <div class="review-footer">
              <CalendarIcon class="date-icon" />
              <span>{{ review.date }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </template>
  <style scoped>
  .reviews-container {
    background: linear-gradient(to bottom right, #0a0a0a, #1a1a1a);
    padding: 4rem 0;
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
  
  .reviews-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }
  
  .section-title {
    display: flex;
    align-items: center;
    gap: 1rem;
    color: #fff;
    font-size: 2.5rem;
    margin-bottom: 3rem;
    opacity: 0;
    animation: fadeInUp 0.6s ease-out forwards;
  }
  
  .title-icon {
    color: #ffd700;
    width: 32px;
    height: 32px;
  }
  
  .reviews-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
  }
  
  .review-card {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 15px;
    padding: 2rem;
    transition: all 0.3s ease;
    opacity: 0;
    animation: fadeInUp 0.6s ease-out forwards;
    animation-delay: var(--delay);
    position: relative;
    overflow: hidden;
  }
  
  .review-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transform: scaleX(0);
    transition: transform 0.5s ease;
  }
  
  .review-card:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.08);
  }
  
  .review-card:hover::before {
    transform: scaleX(1);
  }
  
  .review-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
  
  .avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    color: #0a0a0a;
    font-weight: bold;
  }
  
  .review-info {
    flex-grow: 1;
  }
  
  .review-info h3 {
    color: #fff;
    margin: 0;
    font-size: 1.1rem;
  }
  
  .company {
    color: #a0a0a0;
    font-size: 0.9rem;
    margin: 0.2rem 0 0 0;
  }
  
  .rating {
    display: flex;
    gap: 0.2rem;
  }
  
  .star {
    width: 18px;
    height: 18px;
    color: #666;
  }
  
  .star.filled {
    color: #ffd700;
  }
  
  .review-text {
    color: #d0d0d0;
    line-height: 1.6;
    margin-bottom: 1.5rem;
  }
  
  .review-footer {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #888;
    font-size: 0.9rem;
  }
  
  .date-icon {
    width: 16px;
    height: 16px;
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
    .reviews-container {
      padding: 3rem 0;
    }
    
    .section-title {
      font-size: 2rem;
      margin-bottom: 2rem;
    }
    
    .reviews-grid {
      gap: 1.5rem;
    }
  }
  
  @media (max-width: 480px) {
    .reviews-content {
      padding: 0 1rem;
    }
    
    .review-card {
      padding: 1.5rem;
    }
  }
  </style>