<script lang="ts">
import { defineComponent, ref } from 'vue';
import { Shield, Upload, Download, File, AlertTriangle, X, Loader } from 'lucide-vue-next';

interface DecryptedFile {
  id: string;
  name: string;
  size: number;
  decryptionType: string;
  dateDecrypted: string;
  downloadUrl?: string;
}

interface QueueFile {
  id: string;
  file: File;
  status: 'queued' | 'processing' | 'completed' | 'error';
  progress: number;
  error?: string;
}

export default defineComponent({
  name: 'Desencrypt',
  components: {
    Shield,
    Upload,
    Download,
    File,
    AlertTriangle,
    X,
    Loader
  },
  setup() {
    const fileInput = ref<HTMLInputElement | null>(null);
    const selectedMethod = ref('');
    const decryptQueue = ref<QueueFile[]>([]);
    const decryptedFiles = ref<DecryptedFile[]>([]);
    const isProcessing = ref(false);
    const errorMessage = ref('');

    const decryptionMethods = [
      {
        id: 'base64',
        title: 'Base64 Decryption',
        description: 'Decode Base64 encrypted files',
        icon: Shield
      },
      {
        id: 'fernel',
        title: 'Fernel Cipher',
        description: 'Advanced decryption for Fernel encrypted files',
        icon: Shield
      },
      {
        id: 'T0m4s1n',
        title: 'T0m4s1n Method',
        description: 'Custom T0m4s1n decryption method',
        icon: Shield
      }
    ];

    const selectMethod = (methodId: string) => {
      selectedMethod.value = methodId;
      errorMessage.value = '';
    };

    const triggerFileInput = () => {
      fileInput.value?.click();
    };

    const handleFileUpload = (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (!target.files || !selectedMethod.value) {
        errorMessage.value = 'Please select a decryption method first';
        return;
      }
      addFilesToQueue(Array.from(target.files));
    };

    const handleFileDrop = (event: DragEvent) => {
      if (!selectedMethod.value) {
        errorMessage.value = 'Please select a decryption method first';
        return;
      }
      const files = Array.from(event.dataTransfer?.files || []);
      addFilesToQueue(files);
    };

    const addFilesToQueue = (files: File[]) => {
      files.forEach(file => {
        const queueFile: QueueFile = {
          id: Math.random().toString(36).substr(2, 9),
          file,
          status: 'queued',
          progress: 0
        };
        decryptQueue.value.push(queueFile);
      });
    };

    const decryptBase64 = async (content: string): Promise<string> => {
      try {
        return atob(content);
      } catch (error) {
        throw new Error('Invalid Base64 content');
      }
    };

    const decryptFernel = async (content: string): Promise<string> => {
      const reversed = content.split('').reverse().join('');
      return decryptBase64(reversed);
    };

    const decryptT0m4s1n = async (content: string): Promise<string> => {
      try {
        let decryptedData = content;
        decryptedData = decryptedData.split('').reverse().join('');
        
        const keyArray = new Uint8Array(16);
        crypto.getRandomValues(keyArray);
        const key = Array.from(keyArray)
          .map(byte => byte.toString(16).padStart(2, '0'))
          .join('');
        
        decryptedData = xorWithKey(decryptedData, key);
        decryptedData = rotateCharacters(decryptedData, 5);
        decryptedData = btoa(decryptedData);
        decryptedData = atob(decryptedData);
        decryptedData = rotateCharacters(decryptedData, -5);
        decryptedData = xorWithKey(decryptedData, key);
        decryptedData = decryptedData.split('').reverse().join('');
        
        return decryptedData;
      } catch (error) {
        throw new Error('Invalid T0m4s1n encrypted content');
      }
    };

    const xorWithKey = (data: string, key: string): string => {
      let result = '';
      for (let i = 0; i < data.length; i++) {
        result += String.fromCharCode(
          data.charCodeAt(i) ^ key.charCodeAt(i % key.length)
        );
      }
      return result;
    };

    const rotateCharacters = (data: string, shift: number): string => {
      return data.split('').map(char => {
        const code = char.charCodeAt(0);
        if (code >= 65 && code <= 90) { // Uppercase
          return String.fromCharCode(((code - 65 + shift + 26) % 26) + 65);
        } else if (code >= 97 && code <= 122) { // Lowercase
          return String.fromCharCode(((code - 97 + shift + 26) % 26) + 97);
        }
        return char;
      }).join('');
    };

    const processQueue = async () => {
      if (isProcessing.value || !selectedMethod.value) return;
      
      isProcessing.value = true;
      
      for (const queueFile of decryptQueue.value) {
        try {
          queueFile.status = 'processing';
          queueFile.progress = 30;

          const fileContent = await readFileContent(queueFile.file);
          let decryptedContent = '';

          switch (selectedMethod.value) {
            case 'base64':
              decryptedContent = await decryptBase64(fileContent);
              break;
            case 'fernel':
              decryptedContent = await decryptFernel(fileContent);
              break;
            case 'T0m4s1n':
              decryptedContent = await decryptT0m4s1n(fileContent);
              break;
          }

          queueFile.progress = 70;

          const blob = new Blob([decryptedContent], { type: 'text/plain' });
          const downloadUrl = URL.createObjectURL(blob);

          const decryptedFile: DecryptedFile = {
            id: queueFile.id,
            name: `decrypted_${queueFile.file.name}`,
            size: blob.size,
            decryptionType: selectedMethod.value,
            dateDecrypted: new Date().toISOString(),
            downloadUrl
          };

          decryptedFiles.value.unshift(decryptedFile);
          queueFile.status = 'completed';
          queueFile.progress = 100;

        } catch (error) {
          queueFile.status = 'error';
          queueFile.error = 'Decryption failed';
          console.error('Decryption error:', error);
        }
      }

      setTimeout(() => {
        decryptQueue.value = decryptQueue.value.filter(
          file => file.status !== 'completed'
        );
      }, 2000);

      isProcessing.value = false;
    };

    const readFileContent = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsText(file);
      });
    };

    const downloadFile = (file: DecryptedFile) => {
      if (file.downloadUrl) {
        const link = document.createElement('a');
        link.href = file.downloadUrl;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    };

    const deleteFile = (fileId: string) => {
      decryptedFiles.value = decryptedFiles.value.filter(
        file => file.id !== fileId
      );
    };

    const removeFromQueue = (fileId: string) => {
      decryptQueue.value = decryptQueue.value.filter(
        file => file.id !== fileId
      );
    };

    const clearQueue = () => {
      decryptQueue.value = [];
      errorMessage.value = '';
    };

    const formatFileSize = (bytes: number): string => {
      if (bytes < 1024) return bytes + ' B';
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
      return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    return {
      fileInput,
      selectedMethod,
      decryptQueue,
      decryptedFiles,
      isProcessing,
      errorMessage,
      decryptionMethods,
      selectMethod,
      triggerFileInput,
      handleFileUpload,
      handleFileDrop,
      processQueue,
      downloadFile,
      deleteFile,
      removeFromQueue,
      clearQueue,
      formatFileSize
    };
  }
});
</script>
<template>
  <div class="dashboard">
    <div class="header">
      <h2 class="dashboard-title">File Decryption</h2>
      <p class="section-description">Select a decryption method and upload your encrypted files</p>
    </div>
    <div v-if="errorMessage" class="error-message">
      <AlertTriangle class="alert-icon" />
      {{ errorMessage }}
    </div>
    <div class="encryption-boxes">
      <div
        v-for="method in decryptionMethods"
        :key="method.id"
        class="encryption-box"
        :class="{ 'selected': selectedMethod === method.id }"
        @click="selectMethod(method.id)"
      >
        <component :is="method.icon" class="box-icon" />
        <h3>{{ method.title }}</h3>
        <p>{{ method.description }}</p>
      </div>
    </div>
    <div class="upload-section">
      <div class="file-input-container">
        <input
          ref="fileInput"
          type="file"
          multiple
          class="file-input"
          @change="handleFileUpload"
        />
        <div 
          class="file-input-overlay"
          @dragover.prevent
          @drop.prevent="handleFileDrop"
        >
          <Upload class="box-icon" />
          <span>Drop files here or click to select</span>
        </div>
      </div>
      <button 
        class="upload-button"
        :disabled="isProcessing"
        @click="processQueue"
      >
        Upload Files
      </button>
    </div>
    <div v-if="decryptQueue.length > 0" class="upload-queue">
      <div class="queue-header">
        <h2>Decryption Queue</h2>
        <div class="queue-actions">
          <button 
            class="process-button"
            :disabled="isProcessing || !selectedMethod"
            @click="processQueue"
          >
            <Loader v-if="isProcessing" class="spin" />
            <span>{{ isProcessing ? 'Processing...' : 'Start Decryption' }}</span>
          </button>
          <button class="clear-button" @click="clearQueue">
            Clear Queue
          </button>
        </div>
      </div>
      <div class="queue-items">
        <div v-for="file in decryptQueue" :key="file.id" class="queue-item">
          <div class="queue-item-info">
            <span class="filename">{{ file.file.name }}</span>
            <span class="size">{{ formatFileSize(file.file.size) }}</span>
          </div>
          <div class="queue-item-status">
            <div v-if="file.status === 'processing'" class="status-badge">
              Processing {{ file.progress }}%
            </div>
            <div v-else-if="file.status === 'error'" class="status-badge error">
              {{ file.error }}
            </div>
            <div v-else class="status-badge queued">
              Queued
            </div>
            <button class="remove-button" @click="removeFromQueue(file.id)">
              <X />
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="decryptedFiles.length > 0" class="files-list">
      <h2>Decrypted Files</h2>
      <div class="files-grid">
        <div v-for="file in decryptedFiles" :key="file.id" class="file-card">
          <File class="file-icon" />
          <div class="file-info">
            <h4>{{ file.name }}</h4>
            <p>{{ formatFileSize(file.size) }}</p>
          </div>
          <div class="file-actions">
            <button class="action-button download-button" @click="downloadFile(file)">
              <Download />
            </button>
            <button class="action-button delete-button" @click="deleteFile(file.id)">
              <X />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.dashboard {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
    background: #000000;
    margin-top: 4rem;
}

.dashboard-title {
    color: #ffffff;
    margin-bottom: 1rem;
    font-size: 2rem;
    font-weight: 600;
    text-align: center;
}

.section-description {
    color: #888888;
    text-align: center;
    margin-bottom: 2rem;
}

.error-message {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
    background: rgba(255, 100, 100, 0.1);
    border: 1px solid rgba(255, 100, 100, 0.2);
    border-radius: 0.5rem;
    color: #ff6464;
    margin-bottom: 2rem;
}

.encryption-boxes {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
}

.encryption-box {
    background: #1a1a1a;
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: 1rem;
    padding: 1.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
}

.encryption-box:hover {
    transform: translateY(-2px);
    border-color: rgba(255, 255, 255, 0.2);
}

.encryption-box.selected {
    border-color: #4a9eff;
    background: linear-gradient(45deg, #1a1a1a, #2a2a2a);
}

.box-icon {
    color: #fff;
    margin-bottom: 1rem;
}

.encryption-box h3 {
    color: #ffffff;
    margin-bottom: 0.5rem;
}

.encryption-box p {
    color: #888888;
    font-size: 0.9rem;
}

.upload-section {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
}

.file-input-container {
    position: relative;
    flex: 1;
}

.file-input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
}

.file-input-overlay {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background: #1a1a1a;
    border: 2px dashed rgba(255, 255, 255, 0.1);
    border-radius: 0.5rem;
    color: #ffffff;
}

.upload-button {
    width: 30%;
    padding: 0.75rem;
    background: linear-gradient(45deg, #1a1a1a, #2a2a2a);
    color: white;
    border: 2px solid #333;
    border-radius: 0.5rem;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
}

.upload-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.upload-button:not(:disabled):hover {
    transform: translateY(-2px);
    border-color: #2563eb;
    background: linear-gradient(45deg, #2563eb, #1a1a1a);
}

.upload-queue {
    margin: 2rem 0;
    background: #1a1a1a;
    border-radius: 1rem;
    padding: 1.5rem;
}

.queue-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.queue-header h2 {
    color: #ffffff;
    margin: 0;
}

.queue-actions {
    display: flex;
    gap: 1rem;
}

.process-button {
    background: #333;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.3s ease;
}

.process-button:disabled {
    background: #1e40af;
    opacity: 0.5;
    cursor: not-allowed;
}

.clear-button {
    background: transparent;
    color: #ef4444;
    border: 1px solid #ef4444;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.3s ease;
}

.queue-items {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.queue-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 0.5rem;
}

.queue-item-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.filename {
    color: #ffffff;
    font-size: 0.9rem;
}

.size {
    color: #888888;
    font-size: 0.8rem;
}

.queue-item-status {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.status-badge {
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.8rem;
}

.status-badge.queued {
    background: rgba(255, 255, 255, 0.1);
    color: #ffffff;
}

.status-badge.error {
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
}

.files-list {
    margin-top: 2rem;
}

.files-list h2 {
    color: #ffffff;
    margin-bottom: 1rem;
}

.files-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1rem;
}

.file-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    background: #1a1a1a;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 0.5rem;
    padding: 1rem;
}

.file-icon {
    color: #fff;
}

.file-info {
    flex: 1;
}

.file-info h4 {
    color: #ffffff;
    margin: 0;
    margin-bottom: 0.25rem;
}

.file-actions {
    display: flex;
    gap: 0.5rem;
}

.action-button {
    background: transparent;
    border: none;
    color: #ffffff;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 0.5rem;
    transition: all 0.3s ease;
}

.download-button:hover {
    background: rgba(74, 158, 255, 0.1);
}

.delete-button:hover {
    background: rgba(255, 100, 100, 0.1);
    color: #ff6464;
}

.spin {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

@media (max-width: 768px) {
    .dashboard {
        padding: 1rem;
    }

    .upload-section {
        flex-direction: column;
    }

    .upload-button {
        width: 100%;
    }

    .files-grid {
        grid-template-columns: 1fr;
    }
}
</style>