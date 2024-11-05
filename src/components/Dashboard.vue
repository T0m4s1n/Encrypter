<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Shield, Upload, Download, File, AlertTriangle, X, Loader, Plus } from 'lucide-vue-next';

interface UploadedFile {
    id: string;
    name: string;
    size: number;
    encryptionType: string;
    dateUploaded: string;
    downloadUrl?: string;
    userId: string;
}

interface QueuedFile {
    id: string;
    file: File;
    encryptionType: string;
    status: 'queued' | 'processing' | 'completed' | 'error';
    progress: number;
    error?: string;
}

interface EncryptionBox {
    id: string;
    title: string;
    description: string;
    type: 'base64' | 'fernel';
    icon: any;
}

export default defineComponent({
    name: 'Dashboard',
    components: {
        Shield,
        Upload,
        Download,
        File,
        AlertTriangle,
        X,
        Loader,
        Plus
    },
    setup() {
        const router = useRouter();
        const uploadedFiles = ref<UploadedFile[]>([]);
        const uploadQueue = ref<QueuedFile[]>([]);
        const selectedEncryption = ref<string>('');
        const isProcessing = ref(false);
        const errorMessage = ref<string>('');
        const currentUserId = ref<string>('');
        const fileInput = ref<HTMLInputElement | null>(null);

        const encryptionBoxes: EncryptionBox[] = [
            {
                id: 'base64',
                title: 'Base64 Encryption',
                description: 'Simple and widely supported encoding method',
                type: 'base64',
                icon: Shield
            },
            {
                id: 'fernel',
                title: 'Fernel Cipher',
                description: 'Advanced encryption for enhanced security',
                type: 'fernel',
                icon: Shield
            }
        ];

        const loadUserFiles = (userId: string) => {
            const storedFiles = localStorage.getItem(`userFiles_${userId}`);
            if (storedFiles) {
                uploadedFiles.value = JSON.parse(storedFiles)
                    .filter((file: UploadedFile) => file.userId === userId);
                uploadedFiles.value.forEach(file => {
                    if (file.downloadUrl) {
                        const encryptedContent = localStorage.getItem(`fileContent_${file.id}`);
                        if (encryptedContent) {
                            const blob = new Blob([encryptedContent], { type: 'text/plain' });
                            file.downloadUrl = URL.createObjectURL(blob);
                        }
                    }
                });
            } else {
                uploadedFiles.value = [];
            }
        };

        const saveUserFiles = (userId: string) => {
            localStorage.setItem(`userFiles_${userId}`, JSON.stringify(uploadedFiles.value));
        };

        const deleteFile = (fileId: string) => {
            localStorage.removeItem(`fileContent_${fileId}`);
            uploadedFiles.value = uploadedFiles.value.filter(file => file.id !== fileId);
            saveUserFiles(currentUserId.value);
        };

        const checkAuth = () => {
            const session = localStorage.getItem('session');
            if (!session) {
                router.push('/login');
                return;
            }
            try {
                const sessionData = JSON.parse(session);
                currentUserId.value = sessionData.userId || sessionData.id;
                loadUserFiles(currentUserId.value);
            } catch (error) {
                console.error('Error parsing session:', error);
                router.push('/login');
            }
        };

        const addFilesToQueue = (event: Event) => {
            const target = event.target as HTMLInputElement;
            if (!target.files || !selectedEncryption.value) {
                errorMessage.value = 'Please select an encryption method first';
                return;
            }

            const files = Array.from(target.files);
            files.forEach(file => {
                const queuedFile: QueuedFile = {
                    id: Math.random().toString(36).substring(7),
                    file,
                    encryptionType: selectedEncryption.value,
                    status: 'queued',
                    progress: 0
                };
                uploadQueue.value.push(queuedFile);
            });

            if (fileInput.value) {
                fileInput.value.value = '';
            }
        };

        const encryptBase64 = async (file: File): Promise<string> => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    const base64String = btoa(reader.result as string);
                    resolve(base64String);
                };
                reader.onerror = reject;
                reader.readAsBinaryString(file);
            });
        };

        const encryptFernel = async (file: File): Promise<string> => {
            const base64 = await encryptBase64(file);
            return base64.split('').reverse().join('');
        };

        const processQueue = async () => {
            if (uploadQueue.value.length === 0 || isProcessing.value) {
                return;
            }

            isProcessing.value = true;
            errorMessage.value = '';

            for (const queuedFile of uploadQueue.value) {
                try {
                    queuedFile.status = 'processing';

                    let encryptedContent = '';
                    if (queuedFile.encryptionType === 'base64') {
                        encryptedContent = await encryptBase64(queuedFile.file);
                    } else if (queuedFile.encryptionType === 'fernel') {
                        encryptedContent = await encryptFernel(queuedFile.file);
                    }

                    const fileId = queuedFile.id;
                    const blob = new Blob([encryptedContent], { type: 'text/plain' });
                    const downloadUrl = URL.createObjectURL(blob);
                    localStorage.setItem(`fileContent_${fileId}`, encryptedContent);

                    const newFile: UploadedFile = {
                        id: fileId,
                        name: queuedFile.file.name,
                        size: queuedFile.file.size,
                        encryptionType: queuedFile.encryptionType,
                        dateUploaded: new Date().toLocaleString(),
                        downloadUrl,
                        userId: currentUserId.value
                    };

                    uploadedFiles.value.unshift(newFile);
                    queuedFile.status = 'completed';
                    queuedFile.progress = 100;
                    
                    saveUserFiles(currentUserId.value);
                    
                    await new Promise(resolve => setTimeout(resolve, 500));
                } catch (error) {
                    queuedFile.status = 'error';
                    queuedFile.error = 'Error processing file';
                    console.error(error);
                }
            }
            setTimeout(() => {
                uploadQueue.value = uploadQueue.value.filter(
                    file => file.status !== 'completed' && file.status !== 'error'
                );
            }, 2000);

            isProcessing.value = false;
        };

        const clearQueue = () => {
            uploadQueue.value = [];
            errorMessage.value = '';
        };

        const removeFromQueue = (fileId: string) => {
            uploadQueue.value = uploadQueue.value.filter(file => file.id !== fileId);
        };

        const downloadFile = (file: UploadedFile) => {
            if (file.downloadUrl) {
                const link = document.createElement('a');
                link.href = file.downloadUrl;
                link.download = `encrypted_${file.name}`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        };

        const formatFileSize = (bytes: number): string => {
            if (bytes < 1024) return bytes + ' B';
            if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
            return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
        };

        onMounted(() => {
            checkAuth();
        });

        return {
            uploadedFiles,
            uploadQueue,
            selectedEncryption,
            isProcessing,
            errorMessage,
            encryptionBoxes,
            fileInput,
            addFilesToQueue,
            processQueue,
            clearQueue,
            downloadFile,
            formatFileSize,
            deleteFile,
            removeFromQueue
        };
    }
});
</script>

<template>
    <div class="dashboard">
        <h1 class="dashboard-title">Encryption Dashboard</h1>
        
        <div class="encryption-boxes">
            <div
                v-for="box in encryptionBoxes"
                :key="box.id"
                class="encryption-box"
                :class="{ 'selected': selectedEncryption === box.id }"
                @click="selectedEncryption = box.id"
            >
                <component :is="box.icon" size="32" class="box-icon" />
                <h3>{{ box.title }}</h3>
                <p>{{ box.description }}</p>
            </div>
        </div>

        <div class="upload-section">
            <div class="file-input-container">
                <input 
                    ref="fileInput"
                    type="file"
                    @change="addFilesToQueue"
                    class="file-input"
                    multiple
                    :disabled="!selectedEncryption"
                >
                <div class="file-input-overlay">
                    <Plus :size="24" />
                    <span>Add files to queue</span>
                </div>
            </div>
        </div>

        <div v-if="uploadQueue.length > 0" class="upload-queue">
            <div class="queue-header">
                <h2>Upload Queue ({{ uploadQueue.length }} files)</h2>
                <div class="queue-actions">
                    <button 
                        @click="processQueue" 
                        class="process-button"
                        :disabled="isProcessing || uploadQueue.length === 0"
                    >
                        <span v-if="isProcessing">Processing...</span>
                        <span v-else>Start Upload</span>
                    </button>
                    <button 
                        @click="clearQueue"
                        class="clear-button"
                        :disabled="isProcessing"
                    >
                        Clear Queue
                    </button>
                </div>
            </div>
            
            <div class="queue-items">
                <div 
                    v-for="file in uploadQueue" 
                    :key="file.id"
                    class="queue-item"
                >
                    <div class="queue-item-info">
                        <span class="filename">{{ file.file.name }}</span>
                        <span class="size">{{ formatFileSize(file.file.size) }}</span>
                    </div>
                    <div class="queue-item-status">
                        <Loader v-if="file.status === 'processing'" class="spin" />
                        <div 
                            v-if="file.status === 'queued'"
                            class="status-badge queued"
                        >
                            Queued
                        </div>
                        <div 
                            v-if="file.status === 'completed'"
                            class="status-badge completed"
                        >
                            Completed
                        </div>
                        <div 
                            v-if="file.status === 'error'"
                            class="status-badge error"
                        >
                            Error
                        </div>
                        <button 
                            @click="removeFromQueue(file.id)"
                            class="remove-button"
                            v-if="file.status !== 'processing'"
                        >
                            <X :size="16" />
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="errorMessage" class="error-message">
            <AlertTriangle :size="20" />
            {{ errorMessage }}
        </div>

        <div class="files-list" v-if="uploadedFiles.length > 0">
            <h2>Encrypted Files</h2>
            <div class="files-grid">
                <div 
                    v-for="file in uploadedFiles" 
                    :key="file.id"
                    class="file-card"
                >
                    <div class="file-icon">
                        <File :size="32" />
                    </div>
                    <div class="file-info">
                        <h4>{{ file.name }}</h4>
                        <p>{{ formatFileSize(file.size) }} • {{ file.encryptionType }}</p>
                        <small>{{ file.dateUploaded }}</small>
                    </div>
                    <div class="file-actions">
                        <button 
                            class="action-button download-button"
                            @click="downloadFile(file)"
                            title="Download"
                        >
                            <Download :size="20" />
                        </button>
                        <button 
                            class="action-button delete-button"
                            @click="deleteFile(file.id)"
                            title="Delete"
                        >
                            <X :size="20" />
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
}

.dashboard-title {
    color: #ffffff;
    margin-bottom: 2rem;
    font-size: 2rem;
    font-weight: 600;
}

.encryption-boxes {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
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
    font-family: "Poppins", sans-serif;
}

.process-button:disabled {
    background: #1e40af;
    opacity: 0.5;
    cursor: not-allowed;
}

.process-button:not(:disabled):hover {
    background: #333;
    transform: translateY(-1px);
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
    font-family: "Poppins", sans-serif;
}

.clear-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.clear-button:hover {
    background: rgba(239, 68, 68, 0.1);
    transform: translateY(-1px);
}

.upload-queue h2 {
    color: #ffffff;
    margin-bottom: 1rem;
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
    font-family: "Poppins", sans-serif;
}

.status-badge.queued {
    background: rgba(255, 255, 255, 0.1);
    color: #ffffff;
}

.status-badge.completed {
    background: rgba(34, 197, 94, 0.1);
    color: #22c55e;
}

.status-badge.error {
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
}

.remove-button {
    background: transparent;
    border: none;
    color: #888888;
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 0.25rem;
    transition: all 0.2s ease;
}

.remove-button:hover {
    color: #ef4444;
    background: rgba(239, 68, 68, 0.1);
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
    position: relative;
    overflow: hidden;
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

.file-info p {
    color: #888888;
    font-size: 0.9rem;
    margin: 0;
    margin-bottom: 0.25rem;
}

.file-info small {
    color: #666666;
    font-size: 0.8rem;
}

.download-button {
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

@media (max-width: 768px) {
    .dashboard {
        padding: 1rem;
    }

    .upload-section {
        flex-direction: column;
    }

    .files-grid {
        grid-template-columns: 1fr;
    }
}
</style>