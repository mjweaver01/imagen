<template>
  <div class="login-wrapper">
    <div class="login-container">
      <div class="login-header">
        <div class="login-icon">🔐</div>
        <h1>Access Required</h1>
        <p>Please enter the password to continue</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="input-group">
          <label for="password">Password:</label>
          <input
            id="password"
            type="password"
            v-model="password"
            placeholder="Enter password"
            :disabled="loading"
            ref="passwordInput"
          />
        </div>

        <button
          type="submit"
          class="login-btn"
          :disabled="!password.trim() || loading"
        >
          <span v-if="loading" class="loading-spinner-btn"></span>
          <span class="btn-icon">{{ loading ? '⏳' : '🚀' }}</span>
          {{ loading ? 'Checking...' : 'Enter App' }}
        </button>
      </form>

      <div v-if="error" class="error-message">
        <div class="error-icon">❌</div>
        <p>{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const password = ref('')
const loading = ref(false)
const error = ref('')
const passwordInput = ref<HTMLInputElement>()

onMounted(() => {
  // Check if already authenticated
  if (localStorage.getItem('imagen_authenticated') === 'true') {
    router.push('/')
  }
  // Focus password input
  passwordInput.value?.focus()
})

const handleLogin = async () => {
  if (!password.value.trim()) return

  loading.value = true
  error.value = ''

  try {
    const response = await fetch('/.netlify/functions/auth-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password: password.value,
      }),
    })

    const data = await response.json()

    if (response.ok && data.success) {
      localStorage.setItem('imagen_authenticated', 'true')
      router.push('/')
    } else {
      error.value = data.error || 'Invalid password. Please try again.'
      password.value = ''
    }
  } catch (err: any) {
    error.value = 'Connection error. Please try again.'
    console.error('Login error:', err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-wrapper {
  background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 50%, #ffcc80 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.login-container {
  background: linear-gradient(145deg, #ffffff 0%, #fefefe 100%);
  padding: 3rem;
  border-radius: 25px;
  box-shadow:
    0 20px 40px rgba(255, 107, 53, 0.1),
    0 8px 16px rgba(255, 107, 53, 0.08);
  border: 1px solid rgba(255, 138, 80, 0.1);
  backdrop-filter: blur(10px);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.login-header {
  margin-bottom: 2.5rem;
}

.login-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.login-header h1 {
  margin: 0 0 0.5rem 0;
  color: #2d1b1b;
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.login-header p {
  margin: 0;
  color: #666;
  font-size: 1rem;
  font-weight: 500;
}

.login-form {
  margin-bottom: 1.5rem;
}

.input-group {
  margin-bottom: 2rem;
  text-align: left;
}

.input-group label {
  display: block;
  margin-bottom: 0.75rem;
  font-weight: 600;
  color: #2d1b1b;
  font-size: 1rem;
}

.input-group input {
  width: 100%;
  padding: 1.25rem;
  border: 2px solid #ffcc80;
  border-radius: 12px;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: linear-gradient(145deg, #fefefe, #fff8f0);
  color: #2d1b1b;
  box-shadow: inset 0 2px 4px rgba(255, 138, 80, 0.1);
}

.input-group input:focus {
  outline: none;
  border-color: #ff8a50;
  background: #ffffff;
  box-shadow:
    0 0 0 4px rgba(255, 138, 80, 0.15),
    inset 0 2px 4px rgba(255, 138, 80, 0.1);
  transform: translateY(-1px);
}

.input-group input:disabled {
  background: linear-gradient(145deg, #f5f5f5, #eeeeee);
  cursor: not-allowed;
  opacity: 0.7;
}

.login-btn {
  background: linear-gradient(135deg, #ff6b35 0%, #ff8a50 50%, #ffa726 100%);
  color: white;
  border: none;
  padding: 1.25rem 2rem;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow:
    0 8px 16px rgba(255, 107, 53, 0.4),
    0 4px 8px rgba(255, 138, 80, 0.3);
  letter-spacing: -0.01em;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow:
    0 12px 24px rgba(255, 107, 53, 0.5),
    0 8px 16px rgba(255, 138, 80, 0.4);
}

.login-btn:disabled {
  background: linear-gradient(135deg, #bdbdbd, #9e9e9e);
  cursor: not-allowed;
  transform: none;
  box-shadow: 0 4px 8px rgba(158, 158, 158, 0.3);
}

.loading-spinner-btn {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.btn-icon {
  font-size: 1.1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error-message {
  background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
  border: 2px solid #ef5350;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 4px 8px rgba(239, 83, 80, 0.2);
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  75% {
    transform: translateX(5px);
  }
}

.error-icon {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.error-message p {
  color: #c62828;
  margin: 0;
  font-weight: 500;
  font-size: 0.95rem;
}

@media (max-width: 480px) {
  .login-wrapper {
    padding: 1rem;
  }

  .login-container {
    padding: 2rem;
  }

  .login-header h1 {
    font-size: 1.7rem;
  }

  .login-icon {
    font-size: 3rem;
  }
}
</style>
