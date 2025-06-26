<template>
  <div class="image-generator-wrapper">
    <div class="image-generator">
      <div class="header">
        <div class="header-background"></div>
        <div class="header-nav">
          <div class="header-title">
            <h1>🎨 AI Image Generator</h1>
          </div>
        </div>
      </div>

      <div class="content">
        <div class="generator-form">
          <div class="input-section">
            <label for="prompt">Your Image Prompt:</label>
            <textarea
              id="prompt"
              v-model="prompt"
              placeholder="e.g., A majestic lion wearing a crown, painted in the style of Rembrandt"
              rows="4"
              :disabled="loading"
            ></textarea>
          </div>

          <div class="prefill-section">
            <button
              @click="clearForm"
              class="clear-btn"
              :disabled="loading || !prompt.trim()"
            >
              <span class="btn-icon">🗑️</span>
              Clear
            </button>
            <button
              @click="prefillExample"
              class="prefill-btn"
              :disabled="loading"
            >
              <span class="btn-icon">💡</span>
              Prefill Example
            </button>
          </div>

          <button
            @click="generateImage"
            :disabled="!prompt.trim() || loading"
            class="generate-btn"
          >
            <span v-if="loading" class="loading-spinner-btn"></span>
            <span class="btn-icon">{{ loading ? '⏳' : '✨' }}</span>
            {{ loading ? 'Generating Image...' : 'Generate Image' }}
          </button>
        </div>

        <div v-if="error" class="error-message">
          <div class="error-icon">⚠️</div>
          <h3>Generation Error</h3>
          <p>{{ error }}</p>
        </div>

        <div v-if="imageUrl" class="result-section">
          <div class="result-header">
            <h2>🖼️ Generated Image</h2>
            <div class="result-actions">
              <a
                :href="imageUrl"
                target="_blank"
                download="generated-image.png"
                class="save-btn"
              >
                <span class="btn-icon">💾</span>
                Download Image
              </a>
            </div>
          </div>
          <div class="image-preview">
            <img :src="imageUrl" alt="Generated Image" />
          </div>
        </div>

        <div v-if="loading" class="loading-overlay">
          <div class="loading-spinner"></div>
          <p>Generating your masterpiece...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const prompt = ref('')
const imageUrl = ref('')
const loading = ref(false)
const error = ref('')

const clearForm = () => {
  prompt.value = ''
  imageUrl.value = ''
  error.value = ''
}

const prefillExample = () => {
  prompt.value = `
    A vibrant, photorealistic image of a beautiful woman with long, flowing hair. 
    She is wearing a flowing dress with a deep V-neckline and a flowing skirt. 
    The background is a beautiful sunset over a body of water.
  `.trim()
}

const generateImage = async () => {
  if (!prompt.value.trim()) return

  loading.value = true
  error.value = ''
  imageUrl.value = ''

  try {
    const response = await fetch('/api/generate-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt.value.trim(),
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || 'Failed to generate image')
    }

    const data = await response.json()

    // Handle both URL and base64 image formats
    if (data.image_url) {
      imageUrl.value = data.image_url
    } else if (data.image_b64) {
      // Convert base64 to data URL for display
      imageUrl.value = `data:image/png;base64,${data.image_b64}`
    } else {
      throw new Error('No image data received from server.')
    }
  } catch (err: any) {
    error.value = err.message || 'An unknown error occurred'
    console.error('Error generating image:', err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.image-generator-wrapper {
  background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 50%, #ffcc80 100%);
  min-height: 100vh;
  width: 100%;
}

.image-generator {
  max-width: 900px;
  margin: 0 auto;
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    sans-serif;
}

.header {
  position: relative;
  background: linear-gradient(135deg, #ff6b35 0%, #ff8a50 50%, #ffa726 100%);
  padding: 3rem 2rem;
  box-shadow: 0 15px 35px rgba(255, 107, 53, 0.3);
  overflow: hidden;
  text-align: center;
  border-radius: 0 0 30px 30px;
}

.header-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M40 40c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm20 0c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
    repeat;
  opacity: 0.2;
}

.header-nav {
  position: relative;
  z-index: 1;
}

.header-title h1 {
  margin: 0;
  color: white;
  font-size: 2.5rem;
  font-weight: 700;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  letter-spacing: -0.02em;
}

.btn-icon {
  font-size: 1.2rem;
}

.content {
  padding: 4rem 2rem;
}

.generator-form {
  background: linear-gradient(145deg, #ffffff 0%, #fefefe 100%);
  padding: 3.5rem;
  border-radius: 25px;
  box-shadow:
    0 20px 40px rgba(255, 107, 53, 0.1),
    0 8px 16px rgba(255, 107, 53, 0.08);
  margin-bottom: 2rem;
  border: 1px solid rgba(255, 138, 80, 0.1);
  backdrop-filter: blur(10px);
}

.input-section {
  margin-bottom: 2.5rem;
}

.input-section label {
  display: block;
  margin-bottom: 1rem;
  font-weight: 700;
  color: #2d1b1b;
  font-size: 1.2rem;
  letter-spacing: -0.01em;
}

.input-section textarea {
  width: 100%;
  padding: 1.5rem;
  border: 2px solid #ffcc80;
  border-radius: 16px;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  resize: vertical;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: linear-gradient(145deg, #fefefe, #fff8f0);
  line-height: 1.7;
  color: #2d1b1b;
  box-shadow: inset 0 2px 4px rgba(255, 138, 80, 0.1);
}

.input-section textarea:focus {
  outline: none;
  border-color: #ff8a50;
  background: #ffffff;
  box-shadow:
    0 0 0 4px rgba(255, 138, 80, 0.15),
    inset 0 2px 4px rgba(255, 138, 80, 0.1);
  transform: translateY(-1px);
}

.input-section textarea:disabled {
  background: linear-gradient(145deg, #f5f5f5, #eeeeee);
  cursor: not-allowed;
  opacity: 0.7;
}

.prefill-section {
  margin-bottom: 2.5rem;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.clear-btn,
.prefill-btn {
  background: linear-gradient(145deg, #ffffff, #fff8f0);
  color: #d84315;
  border: 2px solid #ffcc80;
  padding: 1rem 1.75rem;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
  box-shadow: 0 4px 8px rgba(255, 138, 80, 0.2);
}

.clear-btn:hover:not(:disabled),
.prefill-btn:hover:not(:disabled) {
  background: linear-gradient(145deg, #fff8f0, #ffe0b2);
  border-color: #ff8a50;
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(255, 138, 80, 0.3);
}

.clear-btn:disabled,
.prefill-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
  transform: none;
}

.generate-btn {
  background: linear-gradient(135deg, #ff6b35 0%, #ff8a50 50%, #ffa726 100%);
  color: white;
  border: none;
  padding: 1.5rem 2.5rem;
  border-radius: 16px;
  font-size: 1.2rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  box-shadow:
    0 8px 16px rgba(255, 107, 53, 0.4),
    0 4px 8px rgba(255, 138, 80, 0.3);
  letter-spacing: -0.01em;
}

.generate-btn:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow:
    0 12px 24px rgba(255, 107, 53, 0.5),
    0 8px 16px rgba(255, 138, 80, 0.4);
}

.generate-btn:disabled {
  background: linear-gradient(135deg, #bdbdbd, #9e9e9e);
  cursor: not-allowed;
  transform: none;
  box-shadow: 0 4px 8px rgba(158, 158, 158, 0.3);
}

.loading-spinner-btn {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
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
  border-radius: 20px;
  padding: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
  box-shadow: 0 8px 16px rgba(239, 83, 80, 0.2);
}

.error-icon {
  font-size: 3.5rem;
  margin-bottom: 1rem;
}

.error-message h3 {
  color: #c62828;
  margin: 0 0 0.5rem 0;
  font-weight: 700;
  font-size: 1.3rem;
}

.error-message p {
  color: #d32f2f;
  margin: 0;
  font-weight: 500;
  font-size: 1rem;
}

.result-section {
  background: linear-gradient(145deg, #ffffff 0%, #fefefe 100%);
  border-radius: 25px;
  box-shadow:
    0 20px 40px rgba(255, 107, 53, 0.15),
    0 8px 16px rgba(255, 138, 80, 0.1);
  overflow: hidden;
  border: 1px solid rgba(255, 138, 80, 0.1);
  animation: slideInUp 0.6s ease-out;
  margin-top: 2rem;
  backdrop-filter: blur(10px);
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.result-header {
  padding: 2rem 2.5rem;
  background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
  border-bottom: 2px solid rgba(255, 138, 80, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.result-header h2 {
  margin: 0;
  color: #2d1b1b;
  font-size: 1.7rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.save-btn {
  background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
  box-shadow: 0 6px 12px rgba(76, 175, 80, 0.4);
  text-decoration: none;
}

.save-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(76, 175, 80, 0.5);
}

.image-preview {
  padding: 2.5rem;
  background: linear-gradient(145deg, #fefefe, #fff8f0);
  text-align: center;
}

.image-preview img {
  max-width: 100%;
  border-radius: 16px;
  box-shadow:
    0 12px 24px rgba(0, 0, 0, 0.15),
    0 6px 12px rgba(255, 138, 80, 0.1);
  transition: transform 0.3s ease;
}

.image-preview img:hover {
  transform: scale(1.02);
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 243, 224, 0.95),
    rgba(255, 224, 178, 0.95)
  );
  backdrop-filter: blur(12px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 999;
  text-align: center;
}

.loading-overlay p {
  margin-top: 2rem;
  font-size: 1.3rem;
  font-weight: 600;
  color: #d84315;
  letter-spacing: -0.01em;
}

.loading-spinner {
  width: 70px;
  height: 70px;
  border: 6px solid rgba(255, 138, 80, 0.3);
  border-top: 6px solid #ff8a50;
  border-radius: 50%;
  animation: spin 1.5s cubic-bezier(0.6, 0.1, 0.3, 1) infinite;
  box-shadow: 0 8px 16px rgba(255, 138, 80, 0.2);
}

@media (max-width: 768px) {
  .content {
    padding: 3rem 1.5rem;
  }

  .generator-form {
    padding: 2.5rem 2rem;
    border-radius: 20px;
  }

  .result-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
  }

  .header-title h1 {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .generator-form {
    padding: 2rem 1.5rem;
  }

  .prefill-section {
    justify-content: space-between;
  }

  .header {
    padding: 2rem 1rem;
  }

  .header-title h1 {
    font-size: 1.8rem;
  }

  .content {
    padding: 2rem 1rem;
  }
}
</style>
