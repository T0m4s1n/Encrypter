<script>
  export default {
    name: 'AboutSection',
    data() {
      return {
        hover: null
      }
    }
  }
</script>
<template>
    <section class="about-container">
      <div class="about-grid">
        <div class="about-panel" 
             @mouseenter="hover = 1" 
             @mouseleave="hover = null">
          <h2 class="panel-title">Encrypter</h2>
          <div class="panel-content">
            <p>
              <span class="highlight">At Vault Encrypter</span>, we've developed Encrypt, a tool made for users that want to secure files important to them and for <span class="emphasis">developers</span> and
              <span class="emphasis">designers</span>.
            </p>
            <p>
              We began by creating the interface for the user, taking into account the <span class="highlight">simplicity</span> and <span class="highlight">speed</span> of the tool.
            </p>
            <p>
                Encrypter is a tool that allows you to encrypt your files with a password, so you can share them securely with your friends and family.
            </p>
          </div>
        </div>
        <div class="about-panel"
             @mouseenter="hover = 2" 
             @mouseleave="hover = null">
          <h2 class="panel-title">Vault Encrypter</h2>
          <div class="panel-content">
            <p>
              Encrypt embodies our <span class="highlight">design principles</span> of
              simplicity, minimalism, and speed to create a tool that is both
                <span class="highlight">powerful</span> and <span class="highlight">easy to use</span>.
            </p>
            <p>
              With precision, clarity, and functionality at its core, Encrypt
              <span class="emphasis">enhances</span> the user experience and the accessibility of the tool.
            </p>
          </div>
        </div>
        <div class="about-panel"
             @mouseenter="hover = 3" 
             @mouseleave="hover = null">
          <div class="panel-content large-text">
            <p>
              Encrypter is a tool that allows you to encrypt your files with a password, so you can share them securely with your friends and family.
            </p>
          </div>
        </div>
      </div>
    </section>
  </template>
  <style scoped>
  .about-container {
    min-height: 10vh;
    background-color: #000;
    color: #fff;
    padding: 2rem;
    margin-top: 100vh;
    opacity: 1;
  }
  
  .about-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
    max-width: 1400px;
    margin: 0 auto;
  }
  
  .about-panel {
    padding: 2rem;
    border-radius: 12px;
    background-color: rgba(255, 255, 255, 0.03);
    transition: all 0.3s ease-in-out;
    position: relative;
    overflow: hidden;
  }
  
  .about-panel:hover {
    background-color: rgba(255, 255, 255, 0.05);
    transform: translateY(-5px);
  }
  
  .about-panel::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transform: scaleX(0);
    transition: transform 0.5s ease-in-out;
  }
  
  .about-panel:hover::after {
    transform: scaleX(1);
  }
  
  .panel-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 2rem;
    opacity: 0.9;
  }
  
  .panel-content {
    font-size: 1.1rem;
    line-height: 1.6;
    opacity: 0.8;
  }
  
  .panel-content p {
    margin-bottom: 1.5rem;
  }
  
  .panel-content.large-text {
    font-size: 2.5rem;
    font-weight: 600;
    line-height: 1.2;
  }
  
  .highlight {
    color: #fff;
    font-weight: 600;
  }
  
  .emphasis {
    color: #fff;
    position: relative;
    display: inline-block;
  }
  
  .emphasis::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 1px;
    background-color: rgba(255, 255, 255, 0.3);
    transform: scaleX(0);
    transition: transform 0.3s ease-in-out;
    transform-origin: right;
  }
  
  .about-panel:hover .emphasis::after {
    transform: scaleX(1);
    transform-origin: left;
  }
  
  @media (max-width: 1024px) {
    .about-grid {
      grid-template-columns: 1fr;
    }
  
    .panel-content.large-text {
      font-size: 2rem;
    }
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .about-panel {
    animation: fadeIn 0.6s ease-out forwards;
    animation-delay: calc(var(--index) * 0.2s);
  }
  </style>