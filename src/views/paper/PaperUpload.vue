<script setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { uploadService, downService } from '@/api/paper.js';
import axios from 'axios';

const file = ref(null);
const papername = ref('');
const downloadName = ref('');

const handleFileChange = (event) => {
    file.value = event.target.files[0];
};

const uploadFile = async () => {
    if (file.value && papername.value) {
        try {
            const formData = new FormData();
            formData.append('file', file.value);
            formData.append('papername', papername.value);

            const response = await uploadService(formData);
            console.log('Upload successful:', response);
            ElMessage.success('Upload successful');
        } catch (error) {
            console.error('Upload failed:', error);
            ElMessage.error('Upload failed');
        }
    } else {
        ElMessage.error('Please select a file and enter a paper name.');
    }
};

const downloadFile = async () => {
    if (downloadName.value) {
        try {
            const response = await downService(downloadName.value);
            const { fileType, fileData } = response.data;
            
            const binaryString = atob(fileData);
            const byteArray = new Uint8Array(binaryString.length);

            for (let i = 0; i < binaryString.length; i++) {
                byteArray[i] = binaryString.charCodeAt(i);
            }

            const blob = new Blob([byteArray], { type: fileType });
            const url = window.URL.createObjectURL(blob);

            let fileExtension = '';
            if (fileType.includes('plain')) {
                fileExtension = 'txt';
            } else if (fileType.includes('msword')) {
                fileExtension = 'doc';
            } else if (fileType.includes('pdf')) {
                fileExtension = 'pdf';
            }

            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${downloadName.value}.${fileExtension}`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            ElMessage.success('Download successful');
        } catch (error) {
            console.error('Download failed:', error);
            ElMessage.error('Download failed');
        }
    } else {
        alert('Please enter a paper name.');
    }
};
</script>

<template>
    <div class="page-container">
        <div class="header">
            <h1>论文上传下载</h1>
            <p class="subtitle">安全高效地管理您的学术论文</p>
        </div>
        
        <div class="card-container">
            <div class="upload-card">
                <h2>上传论文</h2>
                <div class="form-group">
                    <label class="custom-file-upload">
                        <input type="file" @change="handleFileChange" />
                        <span class="file-input-label">选择文件</span>
                        <span class="file-name">{{ file ? file.name : '未选择文件' }}</span>
                    </label>
                </div>
                <div class="form-group">
                    <el-input
                        v-model="papername"
                        placeholder="输入论文名称"
                        clearable
                    />
                </div>
                <el-button 
                    type="primary" 
                    @click="uploadFile"
                    class="action-button"
                    :disabled="!file || !papername"
                >
                    上传论文
                </el-button>
            </div>

            <div class="download-card">
                <h2>下载论文</h2>
                <div class="form-group">
                    <el-input
                        v-model="downloadName"
                        placeholder="输入要下载的论文名称"
                        clearable
                    />
                </div>
                <el-button 
                    type="success" 
                    @click="downloadFile"
                    class="action-button"
                    :disabled="!downloadName"
                >
                    下载论文
                </el-button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.page-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    padding: 40px 20px;
    font-family: 'Helvetica Neue', Arial, sans-serif;
}

.header {
    text-align: center;
    margin-bottom: 40px;
}

.header h1 {
    font-size: 2.5rem;
    color: #2c3e50;
    margin-bottom: 10px;
    font-weight: 600;
}

.subtitle {
    font-size: 1.1rem;
    color: #7f8c8d;
}

.card-container {
    display: flex;
    gap: 30px;
    width: 100%;
    max-width: 900px;
}

.upload-card, .download-card {
    flex: 1;
    background: white;
    border-radius: 12px;
    padding: 30px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.upload-card:hover, .download-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12);
}

.upload-card {
    border-top: 4px solid #409eff;
}

.download-card {
    border-top: 4px solid #67c23a;
}

h2 {
    font-size: 1.5rem;
    color: #34495e;
    margin-bottom: 25px;
    text-align: center;
    font-weight: 500;
}

.form-group {
    margin-bottom: 20px;
}

.custom-file-upload {
    display: flex;
    flex-direction: column;
    cursor: pointer;
    width: 100%;
}

.file-input-label {
    display: inline-block;
    padding: 12px 20px;
    background-color: #f8f9fa;
    border: 1px dashed #d1d5db;
    border-radius: 6px;
    text-align: center;
    color: #6b7280;
    font-size: 0.9rem;
    transition: all 0.3s;
}

.file-input-label:hover {
    background-color: #f0f2f5;
    border-color: #c1c7d0;
}

.file-name {
    margin-top: 8px;
    font-size: 0.85rem;
    color: #6b7280;
    text-align: center;
    word-break: break-all;
}

input[type="file"] {
    display: none;
}

.action-button {
    width: 100%;
    padding: 12px;
    font-size: 1rem;
    font-weight: 500;
    margin-top: 10px;
    transition: all 0.3s;
}

.action-button:hover {
    transform: translateY(-2px);
}

@media (max-width: 768px) {
    .card-container {
        flex-direction: column;
    }
    
    .header h1 {
        font-size: 2rem;
    }
    
    h2 {
        font-size: 1.3rem;
    }
}
</style>