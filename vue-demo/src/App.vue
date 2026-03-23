<template>
  <div class="app">
    <header class="header">
      <h1>JitViewer 文档预览Demo</h1>
      <p>支持 DOCX, XLSX, PDF, PPTX, TXT, Markdown 格式</p>
    </header>
    
    <main class="main">
      <div class="sidebar">
        <div class="panel">
          <h3>选择文件</h3>
          <input 
            type="file" 
            id="fileInput"
            accept=".docx,.xlsx,.xls,.pdf,.pptx,.txt,.md"
            @change="handleFileChange"
          />
        </div>
        
        <div class="panel">
          <h3>或输入URL</h3>
          <input 
            v-model="urlInput"
            type="text"
            placeholder="输入文件URL"
          />
          <button class="btn-primary" @click="loadUrl">加载</button>
        </div>
        
        <div class="panel" v-if="fileInfo">
          <h3>文件信息</h3>
          <p><strong>文件名:</strong> {{ fileInfo.name }}</p>
          <p><strong>类型:</strong> {{ fileInfo.type }}</p>
        </div>
        
        <div class="panel">
          <h3>示例文件</h3>
          <div class="demo-links">
            <button @click="loadDemo('docx')">DOCX示例</button>
            <button @click="loadDemo('pdf')">PDF示例</button>
            <button @click="loadDemo('excel')">Excel示例</button>
          </div>
        </div>
      </div>
      
      <div class="content">
        <div v-if="loading" class="loading">
          <div class="spinner"></div>
          <p>加载中...</p>
        </div>
        
        <div v-else-if="error" class="error">
          <p>{{ error }}</p>
        </div>
        
        <div v-else-if="!fileSource" class="empty">
          <p>请选择文件或输入URL开始预览</p>
        </div>
        
        <!-- DOCX预览 -->
        <VueOfficeDocx
          v-else-if="fileType === 'docx'"
          :src="fileSource"
          class="viewer"
          @rendered="onRendered"
          @error="onError"
        />
        
        <!-- Excel预览 -->
        <VueOfficeExcel
          v-else-if="fileType === 'xlsx' || fileType === 'xls'"
          :src="fileSource"
          class="viewer"
          @rendered="onRendered"
          @error="onError"
        />
        
        <!-- PDF预览 -->
        <VueOfficePdf
          v-else-if="fileType === 'pdf'"
          :src="fileSource"
          class="viewer"
          @rendered="onRendered"
          @error="onError"
        />
        
        <!-- PPTX预览 -->
        <VueOfficePptx
          v-else-if="fileType === 'pptx'"
          :src="fileSource"
          class="viewer"
          @rendered="onRendered"
          @error="onError"
        />
        
        <!-- TXT预览 -->
        <div v-else-if="fileType === 'txt'" class="text-viewer">
          <pre>{{ textContent }}</pre>
        </div>
        
        <!-- Markdown预览 -->
        <div v-else-if="fileType === 'md'" class="markdown-viewer">
          <div v-html="markdownContent"></div>
        </div>
        
        <div v-else class="error">
          <p>不支持的文件类型: {{ fileType }}</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 引入vue-office组件
import VueOfficeDocx from '@vue-office/docx'
import VueOfficeExcel from '@vue-office/excel'
import VueOfficePdf from '@vue-office/pdf'
import VueOfficePptx from '@vue-office/pptx'

// 引入样式（只有docx和excel有CSS文件）
import '@vue-office/docx/lib/index.css'
import '@vue-office/excel/lib/index.css'

// 状态
const fileSource = ref(null)
const fileType = ref('')
const fileInfo = ref(null)
const urlInput = ref('')
const loading = ref(false)
const error = ref('')
const textContent = ref('')
const markdownContent = ref('')

// 示例文件URL
const demoFiles = {
  docx: 'http://static.shanhuxueyuan.com/test6.docx',
  pdf: 'http://static.shanhuxueyuan.com/test.pdf',
  excel: 'http://static.shanhuxueyuan.com/demo/excel.xlsx'
}

// 获取文件扩展名
function getExtension(filename) {
  const match = filename.toLowerCase().match(/\.([a-z0-9]+)$/)
  return match ? match[1] : ''
}

// 检测文件类型
function detectType(filename) {
  const ext = getExtension(filename)
  const typeMap = {
    'docx': 'docx',
    'xlsx': 'xlsx',
    'xls': 'xls',
    'pdf': 'pdf',
    'pptx': 'pptx',
    'txt': 'txt',
    'md': 'md',
    'markdown': 'md'
  }
  return typeMap[ext] || 'unknown'
}

// 处理文件选择
async function handleFileChange(e) {
  const file = e.target.files[0]
  if (!file) return
  
  loading.value = true
  error.value = ''
  
  fileInfo.value = {
    name: file.name,
    type: file.type || 'unknown'
  }
  
  fileType.value = detectType(file.name)
  
  try {
    // 对于txt和md文件，读取文本内容
    if (fileType.value === 'txt' || fileType.value === 'md') {
      const text = await file.text()
      if (fileType.value === 'md') {
        markdownContent.value = simpleMarkdownToHtml(text)
      } else {
        textContent.value = text
      }
      fileSource.value = 'loaded'
    } else {
      // 对于office文件，使用Blob URL
      const blobUrl = URL.createObjectURL(file)
      fileSource.value = blobUrl
    }
  } catch (err) {
    error.value = '文件加载失败: ' + err.message
  }
  
  loading.value = false
}

// 加载URL
async function loadUrl() {
  if (!urlInput.value.trim()) {
    error.value = '请输入URL'
    return
  }
  
  loading.value = true
  error.value = ''
  
  const url = urlInput.value.trim()
  const filename = url.split('/').pop() || 'unknown'
  
  fileInfo.value = {
    name: filename,
    type: 'url'
  }
  
  fileType.value = detectType(filename)
  fileSource.value = url
  
  loading.value = false
}

// 加载示例文件
function loadDemo(type) {
  loading.value = true
  error.value = ''
  
  const url = demoFiles[type]
  if (!url) {
    error.value = '没有该类型的示例文件'
    return
  }
  
  fileInfo.value = {
    name: `示例${type.toUpperCase()}文件`,
    type: 'demo'
  }
  
  fileType.value = type
  fileSource.value = url
  
  loading.value = false
}

// 渲染完成
function onRendered() {
  loading.value = false
  console.log('文件渲染完成')
}

// 渲染错误
function onError(err) {
  loading.value = false
  error.value = '渲染失败: ' + (err.message || err)
  console.error('渲染错误:', err)
}

// 简单的Markdown转HTML
function simpleMarkdownToHtml(md) {
  if (!md) return ''
  return md
    .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
    .replace(/\n/g, '<br />')
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #f5f5f5;
}

.app {
  min-height: 100vh;
}

.header {
  background: #1677ff;
  color: white;
  padding: 20px;
  text-align: center;
}

.header h1 {
  margin-bottom: 8px;
}

.header p {
  opacity: 0.9;
  font-size: 14px;
}

.main {
  display: flex;
  max-width: 1400px;
  margin: 20px auto;
  gap: 20px;
  padding: 0 20px;
}

.sidebar {
  width: 280px;
  flex-shrink: 0;
}

.panel {
  background: white;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.panel h3 {
  font-size: 14px;
  color: #333;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.panel input[type="file"],
.panel input[type="text"] {
  width: 100%;
  padding: 8px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  margin-bottom: 8px;
}

.btn-primary {
  width: 100%;
  padding: 8px 16px;
  background: #1677ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-primary:hover {
  background: #4096ff;
}

.demo-links {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.demo-links button {
  padding: 8px;
  background: #f5f5f5;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
}

.demo-links button:hover {
  background: #e6e6e6;
}

.content {
  flex: 1;
  background: white;
  border-radius: 8px;
  min-height: 600px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  overflow: hidden;
}

.viewer {
  width: 100%;
  height: 600px;
  overflow: auto;
}

.loading,
.error,
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 600px;
  color: #999;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f0f0f0;
  border-top-color: #1677ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error {
  color: #ff4d4f;
}

.text-viewer,
.markdown-viewer {
  padding: 40px;
  height: 600px;
  overflow: auto;
  background: white;
  max-width: 900px;
  margin: 0 auto;
}

.text-viewer pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.6;
  color: #333;
}

/* Markdown 样式优化 */
.markdown-viewer {
  line-height: 1.8;
  color: #24292e;
  font-size: 16px;
}

.markdown-viewer h1 { 
  font-size: 2em; 
  margin: 0.67em 0;
  padding-bottom: 0.3em;
  border-bottom: 1px solid #eaecef;
  font-weight: 600;
}
.markdown-viewer h2 { 
  font-size: 1.5em; 
  margin: 0.75em 0;
  padding-bottom: 0.3em;
  border-bottom: 1px solid #eaecef;
  font-weight: 600;
}
.markdown-viewer h3 { 
  font-size: 1.25em; 
  margin: 0.83em 0;
  font-weight: 600;
}
.markdown-viewer h4 { 
  font-size: 1em; 
  margin: 1em 0;
  font-weight: 600;
}
.markdown-viewer h5 { 
  font-size: 0.875em; 
  margin: 1.17em 0;
  font-weight: 600;
}
.markdown-viewer h6 { 
  font-size: 0.85em; 
  margin: 1.33em 0;
  font-weight: 600;
  color: #6a737d;
}

.markdown-viewer p {
  margin: 0 0 1em 0;
}

.markdown-viewer code {
  background: rgba(27, 31, 35, 0.05);
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-family: 'SFMono-Regular', 'Consolas', 'Monaco', monospace;
  font-size: 85%;
}

.markdown-viewer pre {
  background: #f6f8fa;
  padding: 16px;
  border-radius: 6px;
  overflow-x: auto;
  margin: 0 0 16px 0;
}

.markdown-viewer pre code {
  background: transparent;
  padding: 0;
  font-size: 100%;
}

.markdown-viewer a {
  color: #0366d6;
  text-decoration: none;
}

.markdown-viewer a:hover {
  text-decoration: underline;
}

.markdown-viewer ul, 
.markdown-viewer ol {
  padding-left: 2em;
  margin: 0 0 16px 0;
}

.markdown-viewer li {
  margin: 0.25em 0;
}

.markdown-viewer blockquote {
  border-left: 4px solid #dfe2e5;
  padding: 0 1em;
  margin: 0 0 16px 0;
  color: #6a737d;
}

.markdown-viewer blockquote p {
  margin: 0;
}

.markdown-viewer hr {
  border: none;
  border-top: 1px solid #e1e4e8;
  margin: 24px 0;
}

.markdown-viewer table {
  border-collapse: collapse;
  width: 100%;
  margin: 0 0 16px 0;
}

.markdown-viewer th,
.markdown-viewer td {
  border: 1px solid #dfe2e5;
  padding: 6px 13px;
}

.markdown-viewer th {
  background: #f6f8fa;
  font-weight: 600;
}

.markdown-viewer tr:nth-child(2n) {
  background: #f6f8fa;
}

.markdown-viewer img {
  max-width: 100%;
  box-sizing: content-box;
}
</style>
