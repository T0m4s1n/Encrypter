<script lang="ts">
import { defineComponent, ref } from 'vue';
import { Mail, Lock, UserPlus, Eye, EyeOff, User, Briefcase, Shield, AlertCircle } from 'lucide-vue-next';
import router from '../router';

export default defineComponent({
    name: 'Register',
    components: {
        Mail,
        Lock,
        UserPlus,
        Eye,
        EyeOff,
        User,
        Briefcase,
        Shield,
        AlertCircle
    },
    setup() {
        const name = ref('');
        const profession = ref('');
        const email = ref('');
        const password = ref('');
        const confirmPassword = ref('');
        const showPassword = ref(false);
        const showConfirmPassword = ref(false);
        const twoFactorEnabled = ref(false);
        const isLoading = ref(false);
        const errorMessage = ref('');

        const togglePassword = () => {
            showPassword.value = !showPassword.value;
        };

        const toggleConfirmPassword = () => {
            showConfirmPassword.value = !showConfirmPassword.value;
        };

        const validatePasswords = () => {
            if (password.value !== confirmPassword.value) {
                errorMessage.value = 'The passwords don\'t match';
                return false;
            }
            return true;
        };

        const validateEmail = (email: string) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        };

        const saveToLocalStorage = (data: object) => {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            users.push(data);
            localStorage.setItem('users', JSON.stringify(users));
        };

        const register = async () => {
            try {
                if (!validatePasswords()) return;
                
                if (!validateEmail(email.value)) {
                    errorMessage.value = 'Please enter a valid email';
                    return;
                }

                isLoading.value = true;
                errorMessage.value = '';

                const users = JSON.parse(localStorage.getItem('users') || '[]');
                if (users.some((user: any) => user.email === email.value)) {
                    errorMessage.value = 'The email is already registered';
                    return;
                }
                
                const newUser = {
                    name: name.value,
                    profession: profession.value,
                    email: email.value,
                    password: password.value,
                    twoFactorEnabled: twoFactorEnabled.value,
                    createdAt: new Date().toISOString()
                };
                saveToLocalStorage(newUser);

                router.push('/login');
            } catch (error) {
                errorMessage.value = 'Error registering the user';
                console.error(error);
            } finally {
                isLoading.value = false;
            }
        };

        const goToLogin = () => {
            router.push('/login');
        };

        return {
            name,
            profession,
            email,
            password,
            confirmPassword,
            showPassword,
            showConfirmPassword,
            twoFactorEnabled,
            isLoading,
            errorMessage,
            togglePassword,
            toggleConfirmPassword,
            register,
            goToLogin
        };
    }
});
</script>
<template>
    <div class="placeholder">
        <div class="placeholder__content">
            <div class="benefits">
                <h3>Beneficts for the users</h3>
                <ul>
                    <div class="benefit">
                        <User :size="24" />
                        <span>Custom Profile</span>
                    </div>
                    <div class="benefit">
                        <Briefcase :size="24" />
                        <span>Access to the vault encrypter Tool</span>
                    </div>
                    <div class="benefit">
                        <Shield :size="24" />
                        <span>Security in the data</span>
                    </div>
                    <div class="benefit">
                        <AlertCircle :size="24" />
                        <span>Tecnical Support 24/7</span>
                    </div>
                </ul>
            </div>
        </div>
    </div>
    <div class="register-container">
        <form @submit.prevent="register" class="register-form">
            <fieldset class="register-fieldset">
                <div class="form-header">
                    <h2 class="register-title">Create Account</h2>
                    <p class="register-subtitle">Enter your data</p>
                </div>

                <div v-if="errorMessage" class="error-message">
                    <AlertCircle :size="18" />
                    <span>{{ errorMessage }}</span>
                </div>

                <div class="input-group">
                    <label for="input__name">Name</label>
                    <div class="input-wrapper">
                        <User class="input-icon" :size="18" />
                        <input 
                            id="input__name"
                            v-model="name"
                            type="text"
                            required
                            placeholder="Enter your name"
                            minlength="3"
                            maxlength="50"
                        >
                    </div>
                </div>

                <div class="input-group">
                    <label for="input__profession">Profession</label>
                    <div class="input-wrapper">
                        <Briefcase class="input-icon" :size="18" />
                        <input 
                            id="input__profession"
                            v-model="profession"
                            type="text"
                            required
                            placeholder="Enter your profession"
                            minlength="3"
                            maxlength="50"
                        >
                    </div>
                </div>

                <div class="input-group">
                    <label for="input__email">Email</label>
                    <div class="input-wrapper">
                        <Mail class="input-icon" :size="18" />
                        <input 
                            id="input__email"
                            v-model="email"
                            type="email"
                            required
                            placeholder="Enter your email"
                            autocomplete="email"
                        >
                    </div>
                </div>

                <div class="input-group">
                    <label for="input__password">Password</label>
                    <div class="input-wrapper">
                        <Lock class="input-icon" :size="18" />
                        <input 
                            id="input__password"
                            v-model="password"
                            :type="showPassword ? 'text' : 'password'"
                            required
                            placeholder="Enter your password"
                            pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*$"
                            title="The password must contain at least one number, one uppercase and lowercase letter, and at least 8 characters"
                            minlength="8"
                        >
                        <button 
                            type="button"
                            class="toggle-password"
                            @click="togglePassword"
                            :aria-label="showPassword ? 'Hide password' : 'Show password'"
                        >
                            <Eye v-if="!showPassword" :size="18" />
                            <EyeOff v-else :size="18" />
                        </button>
                    </div>
                </div>

                <div class="input-group">
                    <label for="input__confirm_password">Confirm Password</label>
                    <div class="input-wrapper">
                        <Lock class="input-icon" :size="18" />
                        <input 
                            id="input__confirm_password"
                            v-model="confirmPassword"
                            :type="showConfirmPassword ? 'text' : 'password'"
                            required
                            placeholder="Confirm your password"
                            minlength="8"
                        >
                        <button 
                            type="button"
                            class="toggle-password"
                            @click="toggleConfirmPassword"
                            :aria-label="showConfirmPassword ? 'Hide password' : 'Show password'"
                        >
                            <Eye v-if="!showConfirmPassword" :size="18" />
                            <EyeOff v-else :size="18" />
                        </button>
                    </div>
                </div>

                <div class="input-group checkbox">
                    <label class="checkbox-label">
                        <input 
                            type="checkbox"
                            v-model="twoFactorEnabled"
                        >
                        <Shield :size="18" />
                        <span>Enable the Two Factor Code</span>
                    </label>
                </div>

                <footer class="register-footer">
                    <button type="submit" class="register-button" :disabled="isLoading">
                        <span class="button-content" :class="{ 'loading': isLoading }">
                            <UserPlus :size="18" />
                            <span>{{ isLoading ? 'Singing Up...' : 'Sing Up' }}</span>
                        </span>
                    </button>

                    <div class="login-link">
                        <p>Already have an account?</p>
                        <button type="button" class="login-link-button" @click="goToLogin">
                            <LogIn size="18" />
                            <span>Log In</span>
                        </button>
                    </div>
                </footer>
            </fieldset>
        </form>
    </div>
</template>

<style scoped>
.placeholder {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 6rem;
    background-color: #0a0a0a;
    padding: 1rem;
    perspective: 1000px;
}

.placeholder__content {
    width: 100%;
    max-width: 450px;
    transform-style: preserve-3d;
    animation: fadeIn 0.6s ease-out;
}

.benefits {
    background: #1a1a1a;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 1rem;
    padding: 2rem;
    box-shadow: 0 15px 25px rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(10px);
    text-align: center;
}

.benefits h3 {
    color: white;
    font-size: 1.75rem;
    font-weight: 600;
    background: linear-gradient(45deg, #fff, #999);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
}

.benefit {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
    font-size: 1rem;
    color: #ccc;
    transition: color 0.3s ease;
}

.benefit:hover {
    color: #2563eb;
}

.benefit svg {
    color: #666;
    transition: color 0.3s ease;
}

.benefit:hover svg {
    color: #2563eb;
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
.register-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #0a0a0a;
    padding: 1rem;
    perspective: 1000px;
}

.register-form {
    width: 100%;
    max-width: 400px;
    transform-style: preserve-3d;
    animation: formEntry 0.6s ease-out;
}

.register-fieldset {
    background: #1a1a1a;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 1rem;
    padding: 2rem;
    box-shadow: 0 15px 25px rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(10px);
}

.form-header {
    text-align: center;
    margin-bottom: 2rem;
}

.register-title {
    color: white;
    font-size: 1.75rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    background: linear-gradient(45deg, #fff, #999);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
}

.register-subtitle {
    color: #999;
    font-size: 0.9rem;
}

.error-message {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem;
    border-radius: 0.5rem;
    background-color: rgba(220, 38, 38, 0.1);
    color: #ef4444;
    margin-bottom: 1rem;
    font-size: 0.9rem;
}

.input-group {
    margin-bottom: 1.5rem;
    opacity: 1;
    transform: translateY(20px);
    animation: slideUp 0.5s ease forwards;
}

.input-group:nth-child(2) { animation-delay: 0.1s; }
.input-group:nth-child(3) { animation-delay: 0.2s; }
.input-group:nth-child(4) { animation-delay: 0.3s; }
.input-group:nth-child(5) { animation-delay: 0.4s; }
.input-group:nth-child(6) { animation-delay: 0.5s; }

.input-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #ccc;
    font-size: 0.9rem;
}

.input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
}

.input-icon {
    position: absolute;
    left: 1rem;
    color: #666;
    transition: color 0.3s ease;
}

.input-group input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 2.75rem;
    background: #2a2a2a;
    border: 2px solid #333;
    border-radius: 0.5rem;
    color: white;
    font-size: 1rem;
    transition: all 0.3s ease;
}

.input-group input:focus {
    outline: none;
    border-color: #2563eb;
    background: #2d2d2d;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
}

.input-group input:focus + .input-icon {
    color: #2563eb;
}

.toggle-password {
    position: absolute;
    right: 1rem;
    background: transparent;
    border: none;
    color: #666;
    cursor: pointer;
    padding: 0.25rem;
    transition: color 0.3s ease;
}

.toggle-password:hover {
    color: #999;
}

.checkbox {
    margin-top: 1rem;
}

.checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #ccc;
    cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
    width: 1rem;
    height: 1rem;
    border-radius: 0.25rem;
    border: 2px solid #333;
    background: #2a2a2a;
    cursor: pointer;
}

.register-footer {
    margin-top: 2rem;
}

.register-button {
    width: 100%;
    padding: 0.75rem;
    background: linear-gradient(45deg, #1a1a1a, #2a2a2a);
    color: white;
    border: 2px solid #333;
    border-radius: 0.5rem;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}

.register-button:not(:disabled):hover {
    transform: translateY(-2px);
    border-color: #2563eb;
    background: linear-gradient(45deg, #2563eb, #1a1a1a);
}

.button-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
}

.button-content.loading {
    animation: pulse 1.5s ease-in-out infinite;
}

.login-link {
    margin-top: 1rem;
    text-align: center;
}

.login-link p {
    color: #999;
    margin-bottom: 0.5rem;
}

.login-link-button {
    background: transparent;
    border: none;
    color: #2563eb;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0 auto;
    padding: 0.5rem;
    cursor: pointer;
    transition: color 0.3s ease;
}
</style>