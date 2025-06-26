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
              <a :href="imageUrl" target="_blank" download="generated-image.png" class="save-btn">
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
    A vibrant, photorealistic image of a futuristic city at sunset. 
    Skyscrapers are adorned with holographic ads and flying vehicles zip between them. 
    The color palette should be a mix of warm oranges, deep purples, and electric blues.
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

    if (data.imageUrl) {
      imageUrl.value = data.imageUrl
    } else {
      throw new Error('No image URL received from server.')
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
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  min-height: 100vh;
  width: 100%;
}

.image-generator {
  max-width: 800px;
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
  overflow: hidden;
  text-align: center;
}

.header-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
    repeat;
  opacity: 0.3;
}

.header-nav {
  position: relative;
  z-index: 1;
}

.header-title h1 {
  margin: 0;
  color: white;
  font-size: 1.8rem;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn-icon {
  font-size: 1.1rem;
}

.content {
  padding: 3rem 2rem;
}

.generator-form {
  background: white;
  padding: 3rem;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
  border: 1px solid #e5e7eb;
}

.input-section {
  margin-bottom: 2rem;
}

.input-section label {
  display: block;
  margin-bottom: 0.75rem;
  font-weight: 600;
  color: #1f2937;
  font-size: 1.1rem;
}

.input-section textarea {
  width: 100%;
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  resize: vertical;
  transition: all 0.3s ease;
  background: #f8fafc;
  line-height: 1.6;
}

.input-section textarea:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.input-section textarea:disabled {
  background-color: #f1f5f9;
  cursor: not-allowed;
  opacity: 0.7;
}

.prefill-section {
  margin-bottom: 2rem;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.clear-btn,
.prefill-btn {
  background: transparent;
  color: #4b5563;
  border: 1px solid #d1d5db;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
}

.clear-btn:hover:not(:disabled),
.prefill-btn:hover:not(:disabled) {
  background-color: #f3f4f6;
  border-color: #9ca3af;
}

.clear-btn:disabled,
.prefill-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.generate-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
  gap: 0.75rem;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.generate-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.generate-btn:disabled {
  background: linear-gradient(135deg, #94a3b8, #64748b);
  cursor: not-allowed;
  transform: none;
  box-shadow: 0 4px 12px rgba(148, 163, 184, 0.2);
}

.loading-spinner-btn {
  width: 16px;
  height: 16px;
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
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  border: 1px solid #fca5a5;
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  text-align: center;
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.error-message h3 {
  color: #dc2626;
  margin: 0 0 0.5rem 0;
  font-weight: 600;
  font-size: 1.2rem;
}

.error-message p {
  color: #dc2626;
  margin: 0;
  font-weight: 500;
}

.result-section {
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  border: 1px solid #e5e7eb;
  animation: slideInUp 0.6s ease-out;
  margin-top: 2rem;
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
  padding: 1.5rem 2rem;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.result-header h2 {
  margin: 0;
  color: #1f2937;
  font-size: 1.5rem;
  font-weight: 600;
}

.save-btn {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  text-decoration: none;
}

.save-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(16, 185, 129, 0.4);
}

.image-preview {
  padding: 2rem;
  background-color: #f8fafc;
  text-align: center;
}

.image-preview img {
  max-width: 100%;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 999;
  text-align: center;
}

.loading-overlay p {
  margin-top: 1.5rem;
  font-size: 1.2rem;
  font-weight: 500;
  color: #374151;
}

.loading-spinner {
  width: 60px;
  height: 60px;
  border: 5px solid #d1d5db;
  border-top: 5px solid #667eea;
  border-radius: 50%;
  animation: spin 1.2s cubic-bezier(0.6, 0.1, 0.3, 1) infinite;
}

@media (max-width: 768px) {
  .content {
    padding: 2rem 1rem;
  }

  .generator-form {
    padding: 2rem 1.5rem;
    border-radius: 16px;
  }
  
  .result-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .generator-form {
    padding: 1.5rem 1rem;
  }
  
  .prefill-section {
    justify-content: space-between;
  }
}
</style>
