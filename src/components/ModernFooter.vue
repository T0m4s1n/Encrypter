<script>
  import {
    Option as OptionIcon,
    Twitter as TwitterIcon,
    Github as GithubIcon,
    Linkedin as LinkedinIcon,
    Instagram as InstagramIcon,
    Link as LinkIcon,
    Home as HomeIcon,
    User as UserIcon,
    Settings as ServicesIcon,
    Contact as ContactIcon,
    Layout as LayoutIcon,
    Code as CodeIcon,
    Palette as PaletteIcon,
    Smartphone as SmartphoneIcon,
    Database as DatabaseIcon,
    Mail as MailIcon,
    MapPin as MapPinIcon,
    Phone as PhoneIcon,
  } from 'lucide-vue-next'
  
  export default {
    name: 'ModernFooter',
    components: {
      OptionIcon,
      TwitterIcon,
      GithubIcon,
      LinkedinIcon,
      InstagramIcon,
      LinkIcon,
      HomeIcon,
      UserIcon,
      ServicesIcon,
      ContactIcon,
      LayoutIcon,
      CodeIcon,
      PaletteIcon,
      SmartphoneIcon,
      DatabaseIcon,
      MailIcon,
      MapPinIcon,
      PhoneIcon,
    }
  }
  </script>
<template>
    <footer class="footer-container">
      <div class="footer-content">
        <div class="footer-grid">
          <div class="footer-section">
            <h3 class="footer-title">
              <OptionIcon class="icon" />
              Vault Encrypter
            </h3>
            <p class="footer-description">
               I'm T0m4s1n, a developer making this tool for users that want to secure files important to them.
            </p>
            <div class="social-links">
              <a href="#" class="social-icon" aria-label="Twitter">
                <TwitterIcon />
              </a>
              <a href="https://github.com/T0m4s1n" class="social-icon" aria-label="GitHub">
                <GithubIcon />
              </a>
              <a href="https://www.linkedin.com/in/tomas-benavides-calderon-97a196333/" class="social-icon" aria-label="LinkedIn">
                <LinkedinIcon />
              </a>
              <a href="#" class="social-icon" aria-label="Instagram">
                <InstagramIcon />
              </a>
            </div>
          </div>
          <div class="footer-section">
            <h4 class="footer-subtitle">
              <LinkIcon class="icon" />
              Quick Links
            </h4>
            <ul class="footer-links">
              <li><a href="/"><HomeIcon class="link-icon" /> Home</a></li>
              <li><a href="/contact"><UserIcon class="link-icon" /> Contact</a></li>
              <li><a href="/dashboard"><ServicesIcon class="link-icon" /> Dashboard</a></li>
            </ul>
          </div>
          <div class="footer-section">
            <h4 class="footer-subtitle">
              <LayoutIcon class="icon" />
              Our Services
            </h4>
            <ul class="footer-links">
              <li><a href="#"><CodeIcon class="link-icon" /> Encrypt</a></li>
              <li><a href="#"><PaletteIcon class="link-icon" /> Desing of files encrypt</a></li>
              <li><a href="#"><SmartphoneIcon class="link-icon" /> Mobile</a></li>
              <li><a href="#"><DatabaseIcon class="link-icon" /> Local Storage</a></li>
            </ul>
          </div>
          <div class="footer-section">
            <h4 class="footer-subtitle">
              <MailIcon class="icon" />
              Contact Us
            </h4>
            <ul class="contact-info">
              <li>
                <MapPinIcon class="contact-icon" />
                <span>Pasto, Nariño</span>
              </li>
              <li>
                <PhoneIcon class="contact-icon" />
                <span>+57 3106406198</span>
              </li>
              <li>
                <MailIcon class="contact-icon" />
                <span>pandelpipas@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="footer-bottom">
          <p class="copyright">
            © {{ new Date().getFullYear() }} T0m4s1n. All rights reserved.
          </p>
          <div class="bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  </template> 
<style scoped>
  .footer-container {
    background: linear-gradient(to bottom, #1a1a1a, #0a0a0a);
    color: #fff;
    padding: 4rem 0 1rem 0;
    position: relative;
    overflow: hidden;
  }
  
  .footer-container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  }
  
  .footer-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }
  
  .footer-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 3rem;
    margin-bottom: 3rem;
  }
  
  .footer-section {
    animation: fadeIn 0.6s ease-out forwards;
  }
  
  .footer-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: #fff;
  }
  
  .footer-subtitle {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.2rem;
    margin-bottom: 1rem;
    color: #fff;
  }
  
  .footer-description {
    color: #a0a0a0;
    line-height: 1.6;
    margin-bottom: 1.5rem;
  }
  
  .social-links {
    display: flex;
    gap: 1rem;
  }
  
  .social-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
    transition: all 0.3s ease;
  }
  
  .social-icon:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-3px);
  }
  
  .footer-links {
    list-style: none;
    padding: 0;
  }
  
  .footer-links li {
    margin-bottom: 0.8rem;
  }
  
  .footer-links a {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #a0a0a0;
    text-decoration: none;
    transition: all 0.3s ease;
  }
  
  .footer-links a:hover {
    color: #fff;
    transform: translateX(5px);
  }
  
  .link-icon {
    width: 18px;
    height: 18px;
    opacity: 0.7;
  }
  
  .contact-info {
    list-style: none;
    padding: 0;
  }
  
  .contact-info li {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    color: #a0a0a0;
    margin-bottom: 1rem;
  }
  
  .contact-icon {
    width: 20px;
    height: 20px;
    opacity: 0.7;
  }
  
  .footer-bottom {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding-top: 1.5rem;
    margin-top: 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  .copyright {
    color: #666;
  }
  
  .bottom-links {
    display: flex;
    gap: 1.5rem;
  }
  
  .bottom-links a {
    color: #666;
    text-decoration: none;
    transition: color 0.3s ease;
  }
  
  .bottom-links a:hover {
    color: #fff;
  }
  
  .icon {
    width: 24px;
    height: 24px;
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
  
  @media (max-width: 768px) {
    .footer-grid {
      gap: 2rem;
    }
    
    .footer-bottom {
      flex-direction: column;
      text-align: center;
    }
    
    .bottom-links {
      flex-direction: column;
      gap: 0.8rem;
      align-items: center;
    }
  }
  
  @media (max-width: 480px) {
    .footer-container {
      padding: 3rem 0 1rem 0;
    }
    
    .footer-content {
      padding: 0 1rem;
    }
    
    .social-links {
      justify-content: center;
    }
  }
  </style>