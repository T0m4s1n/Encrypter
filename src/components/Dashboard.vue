<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Shield, Upload, Download, File, AlertTriangle, X } from 'lucide-vue-next';

interface UploadedFile {
    id: string;
    name: string;
    size: number;
    encryptionType: string;
    dateUploaded: string;
    downloadUrl?: string;
    userId: string;
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
        X
    },
    setup() {
        const router = useRouter();
        const uploadedFiles = ref<UploadedFile[]>([]);
        const selectedFile = ref<File | null>(null);
        const selectedEncryption = ref<string>('');
        const isUploading = ref(false);
        const errorMessage = ref<string>('');
        const currentUserId = ref<string>('');

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
                const allFiles = JSON.parse(storedFiles);
                // Filter files to only show those belonging to the current user
                uploadedFiles.value = allFiles.filter((file: UploadedFile) => file.userId === userId);
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
            // Remove file content from localStorage
            localStorage.removeItem(`fileContent_${fileId}`);
            
            // Remove file from uploadedFiles array
            uploadedFiles.value = uploadedFiles.value.filter(file => file.id !== fileId);
            
            // Save updated files list
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

        const handleFileSelect = (event: Event) => {
            const target = event.target as HTMLInputElement;
            if (target.files && target.files.length > 0) {
                selectedFile.value = target.files[0];
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

        const handleUpload = async () => {
            if (!selectedFile.value || !selectedEncryption.value) {
                errorMessage.value = 'Please select both a file and encryption method';
                return;
            }

            try {
                isUploading.value = true;
                errorMessage.value = '';

                let encryptedContent = '';
                if (selectedEncryption.value === 'base64') {
                    encryptedContent = await encryptBase64(selectedFile.value);
                } else if (selectedEncryption.value === 'fernel') {
                    encryptedContent = await encryptFernel(selectedFile.value);
                }

                const fileId = Math.random().toString(36).substring(7);
                const blob = new Blob([encryptedContent], { type: 'text/plain' });
                const downloadUrl = URL.createObjectURL(blob);
                localStorage.setItem(`fileContent_${fileId}`, encryptedContent);

                const newFile: UploadedFile = {
                    id: fileId,
                    name: selectedFile.value.name,
                    size: selectedFile.value.size,
                    encryptionType: selectedEncryption.value,
                    dateUploaded: new Date().toLocaleString(),
                    downloadUrl,
                    userId: currentUserId.value
                };

                uploadedFiles.value.unshift(newFile);
                saveUserFiles(currentUserId.value);

                selectedFile.value = null;
                selectedEncryption.value = '';

                const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                if (fileInput) {
                    fileInput.value = '';
                }
            } catch (error) {
                errorMessage.value = 'Error processing file. Please try again.';
                console.error(error);
            } finally {
                isUploading.value = false;
            }
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
            selectedFile,
            selectedEncryption,
            isUploading,
            errorMessage,
            encryptionBoxes,
            handleFileSelect,
            handleUpload,
            downloadFile,
            formatFileSize,
            deleteFile
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
                    type="file"
                    @change="handleFileSelect"
                    class="file-input"
                >
                <div class="file-input-overlay">
                    <Upload :size="24" />
                    <span>{{ selectedFile ? selectedFile.name : 'Choose a file' }}</span>
                </div>
            </div>

            <button 
                class="upload-button"
                @click="handleUpload"
                :disabled="!selectedFile || !selectedEncryption || isUploading"
            >
                <span class="button-text">
                    {{ isUploading ? 'Processing...' : 'Encrypt & Upload' }}
                </span>
            </button>
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