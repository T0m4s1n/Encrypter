<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { Mail, Lock, LogIn, Eye, EyeOff, UserPlus } from 'lucide-vue-next';
import router from '../router';

export default defineComponent({
    name: 'Login',
    components: {
        Mail,
        Lock,
        LogIn,
        Eye,
        EyeOff,
        UserPlus
    },
    setup() {
        const email = ref('');
        const password = ref('');
        const showPassword = ref(false);
        const isLoading = ref(false);
        const errorMessage = ref('');

        const togglePassword = () => {
            showPassword.value = !showPassword.value;
        };

        const generateSessionToken = (email: string): string => {
            const timestamp = Date.now();
            return btoa(`${email}_${timestamp}`);
        };

        const login = async () => {
            try {
                isLoading.value = true;
                errorMessage.value = '';
                const users = JSON.parse(localStorage.getItem('users') || '[]');
                const user = users.find((u: any) => u.email === email.value);

                if (user && user.password === password.value) {
                    const sessionToken = generateSessionToken(user.email);
                    localStorage.setItem('session', JSON.stringify({
                        ...user,
                        token: sessionToken
                    }));

                    router.push('/').then(() => {
                        window.location.reload();
                    });
                } else {
                    errorMessage.value = 'Invalid credentials';
                }
            } catch (error) {
                errorMessage.value = 'Error logging in';
                console.error(error);
            } finally {
                isLoading.value = false;
            }
        };

        const goToRegister = () => {
            router.push('/register');
        };

        onMounted(() => {
            const session = JSON.parse(localStorage.getItem('session') || 'null');
            if (session) {
                router.push('/');
            }
        });

        return {
            email,
            password,
            showPassword,
            isLoading,
            errorMessage,
            togglePassword,
            login,
            goToRegister
        };
    }
});
</script>
<template>
    <div class="login-container">
        <form @submit.prevent="login" class="login-form">
            <fieldset class="login-fieldset">
                <div class="form-header">
                    <h2 class="login-title">Welcome again</h2>
                    <p class="login-subtitle">Log in in your account to access to the service</p>
                </div>

                <div v-if="errorMessage" class="error-message">
                    {{ errorMessage }}
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
                            placeholder="Enter Email"
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
                            placeholder="Enter Password"
                        >
                        <button 
                            type="button"
                            class="toggle-password"
                            @click="togglePassword"
                        >
                            <Eye v-if="!showPassword" :size="18" />
                            <EyeOff v-else :size="18" />
                        </button>
                    </div>
                </div>

                <footer class="login-footer">
                    <button type="submit" class="login-button" :disabled="isLoading">
                        <span class="button-content" :class="{ 'loading': isLoading }">
                            <LogIn :size="18" />
                            <span>{{ isLoading ? 'Loggin...' : 'Log in' }}</span>
                        </span>
                    </button>
                    
                    <div class="register-link">
                        <p>Don't have a account? you can Sing Up</p>
                        <button type="button" class="register-button" @click="goToRegister">
                            <UserPlus :size="18" />
                            <span>Sign Up</span>
                        </button>
                    </div>
                </footer>
            </fieldset>
        </form>
    </div>
</template>

<style scoped>
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #0a0a0a;
    padding: 1rem;
    perspective: 1000px;
}

.login-form {
    width: 100%;
    max-width: 400px;
    transform-style: preserve-3d;
    animation: formEntry 0.6s ease-out;
}

.login-fieldset {
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

.login-title {
    color: white;
    font-size: 1.75rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    background: linear-gradient(45deg, #fff, #999);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
}

.login-subtitle {
    color: #999;
    font-size: 0.9rem;
}

.input-group {
    margin-bottom: 1.5rem;
    opacity: 0;
    transform: translateY(20px);
    animation: slideUp 0.5s ease forwards;
}

.input-group:nth-child(2) { animation-delay: 0.1s; }
.input-group:nth-child(3) { animation-delay: 0.2s; }

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

.login-footer {
    margin-top: 2rem;
}

.login-button {
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
.register-link{
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    margin-top: 1rem;
    color: #999;
    font-size: 0.9rem;
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
.login-button:not(:disabled):hover {
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

@keyframes formEntry {
    from {
        opacity: 0;
        transform: translateY(20px) rotateX(-10deg);
    }
    to {
        opacity: 1;
        transform: translateY(0) rotateX(0);
    }
}

@keyframes slideUp {
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes pulse {
    0%, 100% {
        opacity: 1;
    }
    50% {
        opacity: 0.5;
    }
}

@media (max-width: 480px) {
    .login-fieldset {
        padding: 1.5rem;
    }

    .login-title {
        font-size: 1.5rem;
    }

    .input-group input {
        padding: 0.6rem 1rem 0.6rem 2.5rem;
    }
}

.error-message{
    color: red;
    font-size: 0.9rem;
    text-align: center;
    margin-bottom: 1rem;
}
</style>
