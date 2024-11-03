<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue';

declare global {
    interface HTMLElement {
        _clickOutside?: (event: Event) => void;
    }
}
import { Option, House, UserRound, Menu, X, ChevronDown, LayoutDashboard, LogOut } from 'lucide-vue-next';
import { useRouter } from 'vue-router';

export default defineComponent({
    name: 'Header',
    components: {
        Option,
        House,
        UserRound,
        Menu,
        X,
        ChevronDown,
        LayoutDashboard,
        LogOut
    },
    setup() {
        const router = useRouter();
        const isMenuOpen = ref(false);
        const isProfileMenuOpen = ref(false);
        const userName = ref<string | null>(null);
        const isMobile = ref(false);

        const checkMobile = () => {
            isMobile.value = window.innerWidth <= 768;
        };

        const toggleMenu = () => {
            isMenuOpen.value = !isMenuOpen.value;
        };

        const toggleProfileMenu = () => {
            isProfileMenuOpen.value = !isProfileMenuOpen.value;
        };

        const closeProfileMenu = () => {
            isProfileMenuOpen.value = false;
        };

        const redirectToLogin = () => {
            router.push('/login');
        };

        const handleLogout = () => {
            localStorage.removeItem('session');
            userName.value = null;
            isProfileMenuOpen.value = false;
            isMenuOpen.value = false;
            router.push('/login');
        };
        const clickOutside = {
            mounted(el: HTMLElement, binding: any) {
                el._clickOutside = (event: Event) => {
                    if (!(el === event.target || el.contains(event.target as Node))) {
                        binding.value();
                    }
                };
                document.addEventListener('click', el._clickOutside);
            },
            unmounted(el: HTMLElement) {
                if (el._clickOutside) {
                    if (el._clickOutside) {
                        document.removeEventListener('click', el._clickOutside);
                    }
                }
            }
        };

        onMounted(() => {
            const session = JSON.parse(localStorage.getItem('session') || 'null');
            if (session && session.name) {
                userName.value = session.name;
            }
            checkMobile();
            window.addEventListener('resize', checkMobile);
        });

        onBeforeUnmount(() => {
            window.removeEventListener('resize', checkMobile);
        });

        return {
            isMenuOpen,
            isProfileMenuOpen,
            userName,
            isMobile,
            toggleMenu,
            toggleProfileMenu,
            closeProfileMenu,
            redirectToLogin,
            handleLogout
        };
    },
    directives: {
        clickOutside: {
            mounted(el: HTMLElement, binding: any) {
                el._clickOutside = (event: Event) => {
                    if (!(el === event.target || el.contains(event.target as Node))) {
                        binding.value();
                    }
                };
                document.addEventListener('click', el._clickOutside);
            },
            unmounted(el: HTMLElement) {
                document.removeEventListener('click', el._clickOutside);
            }
        }
    }
});
</script>
<template>
    <header class="header">
        <div class="logo">
            <Option size="64" color="white" />
        </div>
        <button class="menu-btn" @click="toggleMenu">
            <div class="icon-wrapper">
                <Menu 
                    class="menu-icon" 
                    :class="{ 'icon-hidden': isMenuOpen }" 
                    size="24" 
                    color="white" 
                />
                <X 
                    class="close-icon" 
                    :class="{ 'icon-visible': isMenuOpen }" 
                    size="24" 
                    color="white" 
                />
            </div>
        </button>
        <nav class="nav" :class="{ 'nav-open': isMenuOpen }">
            <router-link to="/" @click="isMenuOpen = false">
                <House size="24" color="white" />
                <span>Home</span>
            </router-link>
            <router-link to="/contact" @click="isMenuOpen = false">
                <UserRound size="24" color="white" />
                <span>Contact</span>
            </router-link>
            
            <button v-if="!userName" class="login-btn" data-effect="shine" @click="redirectToLogin">
                <span class="textButton">Log In</span>
            </button>
            <div v-else class="profile-menu-container" v-click-outside="closeProfileMenu">
                <button class="profile-btn" @click="toggleProfileMenu">
                    <span class="textButton">{{ userName }}</span>
                    <ChevronDown :class="{ 'rotate-180': isProfileMenuOpen }" size="20" color="white" />
                </button>

                <div v-if="!isMobile" class="submenu" :class="{ 'submenu-open': isProfileMenuOpen }">
                    <router-link to="/dashboard" class="submenu-item" @click="closeProfileMenu">
                        <LayoutDashboard size="20" />
                        <span>Dashboard</span>
                    </router-link>
                    <button class="submenu-item logout" @click="handleLogout">
                        <LogOut size="20" />
                        <span>Log Out</span>
                    </button>
                </div>
            </div>

            <div v-if="!isMobile" class="submenu" :class="{ 'submenu-open': isProfileMenuOpen }">
                <router-link to="/dashboard" class="submenu-item login-btn" data-effect="shine" @click="closeProfileMenu">
                    <LayoutDashboard size="20" color="white" />
                    <span class="textButton">Dashboard</span>
                </router-link>
                <button class="submenu-item login-btn logout" data-effect="shine" @click="handleLogout">
                    <LogOut size="20" color="white" />
                    <span class="textButton">Log Out</span>
                </button>
            </div>

            <template v-if="isMobile && userName">
                <router-link to="/dashboard" class="mobile-menu-item login-btn" data-effect="shine" @click="isMenuOpen = false">
                    <LayoutDashboard size="24" color="white" />
                    <span class="textButton">Dashboard</span>
                </router-link>
                <button class="mobile-menu-item login-btn logout" data-effect="shine" @click="handleLogout">
                    <LogOut size="24" color="white" />
                    <span class="textButton">Log Out</span>
                </button>
            </template>
        </nav>
    </header>
</template>
<style scoped>
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background-color: #0a0a0a;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.logo {
    display: flex;
    align-items: center;
    color: #ffffff;
    transition: transform 0.3s ease;
    z-index: 1001;
}

.logo:hover {
    transform: scale(1.05);
}

.nav {
    display: flex;
    gap: 2rem;
    align-items: center;
}

.nav a {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
    color: #ffffff;
    font-weight: 500;
    transition: all 0.3s ease;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
}

.nav a:hover {
    background: rgba(255, 255, 255, 0.1);
    opacity: 0.9;
}

.menu-btn {
    display: none;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    z-index: 1001;
    position: relative;
}

.icon-wrapper {
    position: relative;
    width: 24px;
    height: 24px;
}

.menu-icon,
.close-icon {
    position: absolute;
    top: 0;
    left: 0;
    transition: all 0.3s ease;
}

.menu-icon {
    opacity: 1;
    transform: rotate(0deg);
}

.close-icon {
    opacity: 0;
    transform: rotate(-180deg);
}

.icon-hidden {
    opacity: 0;
    transform: rotate(180deg);
}

.icon-visible {
    opacity: 1;
    transform: rotate(0deg);
}

.login-btn {
    padding: 0.75rem 1.75rem;
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: 0.5rem;
    background: linear-gradient(45deg, #1a1a1a, #2a2a2a, #1a1a1a);
    background-size: 200% 100%;
    color: white;
    font-weight: 500;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
    min-width: 120px;
}

.login-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    border-color: rgba(255, 255, 255, 0.2);
}

.login-btn[data-effect="shine"]::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: rgba(255, 255, 255, 0.1);
    transform: rotate(45deg);
    animation: shine 3s infinite;
}

.profile-btn {
    padding: 0.75rem 1.75rem;
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: 0.5rem;
    background: linear-gradient(45deg, #1a1a1a, #2a2a2a, #1a1a1a);
    background-size: 200% 100%;
    color: white;
    font-weight: 500;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
    min-width: 120px;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.profile-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    border-color: rgba(255, 255, 255, 0.2);
}

.submenu {
    position: absolute;
    top: calc(100% + 0.5rem);
    right: 0;
    background: #0a0a0a;
    border-radius: 0.5rem;
    overflow: hidden;
    width: 200px;
    opacity: 0;
    visibility: hidden;
    transform: translateY(-10px);
    transition: all 0.3s ease;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    margin-right: 2rem;
}

.submenu-open {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
}

.submenu-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    text-decoration: none;
    margin: 0.5rem;
}

.submenu .login-btn,
.mobile-menu-item.login-btn {
    justify-content: flex-start;
    width: 100%;
    margin: 0.5rem;
    padding: 0.75rem 1rem;
}

.logout {
    background: linear-gradient(45deg, #2a1a1a, #3a2a2a, #2a1a1a);
}

.logout:hover {
    background: linear-gradient(45deg, #3a1a1a, #4a2a2a, #3a1a1a);
}

.logout .textButton {
    background: linear-gradient(90deg, 
        rgba(255, 100, 100, 1),
        rgba(255, 100, 100, 0.8),
        rgba(255, 100, 100, 1)
    );
    background-size: 200% auto;
    background-clip: text;
    -webkit-background-clip: text;
}

@media (max-width: 768px) {
    .mobile-menu-item.login-btn {
        width: 100%;
        margin: 0.5rem 0;
    }

    .profile-btn {
        width: 100%;
    }
}

.rotate-180 {
    transform: rotate(180deg);
    transition: transform 0.3s ease;
}

.textButton {
    position: relative;
    background: linear-gradient(90deg, 
        rgba(255, 255, 255, 1),
        rgba(255, 255, 255, 0.8),
        rgba(255, 255, 255, 1)
    );
    background-size: 200% auto;
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    animation: text 3s linear infinite;
    font-weight: 600;
    letter-spacing: 0.5px;
}

@keyframes shine {
    0% {
        opacity: 0;
        transform: rotate(45deg) translateX(-100%);
    }
    15% {
        opacity: 1;
    }
    35% {
        opacity: 1;
    }
    100% {
        opacity: 0;
        transform: rotate(45deg) translateX(100%);
    }
}

@keyframes text {
    0% {
        background-position: 100% center;
    }    
    100% {
        background-position: -100% center;
    }    
}

@media (max-width: 768px) {
    .menu-btn {
        display: block;
    }

    .nav {
        position: fixed;
        top: 0;
        right: -100%;
        height: 100vh;
        width: 70%;
        max-width: 300px;
        background-color: #0a0a0a;
        flex-direction: column;
        padding: 5rem 2rem;
        transition: right 0.3s ease;
        box-shadow: -2px 0 10px rgba(0, 0, 0, 0.3);
    }

    .nav-open {
        right: 0;
    }

    .nav a {
        width: 100%;
        justify-content: flex-start;
    }

    .login-btn {
        width: 100%;
        margin-top: 1rem;
    }

    .logo svg {
        width: 48px;
        height: 48px;
    }
}

:deep(body) {
    padding-top: 80px;
}

</style>