<template>
  <div class="app">
    <header class="header">
      <div class="header-content">
        <div class="header-title">
          <h1>JitViewer 水印测试 Demo</h1>
          <p>默认加载本地 HTML 示例，可直接切换文本水印和图片水印验证效果</p>
        </div>
        <div class="header-actions">
          <a
            class="header-link header-link--primary"
            href="https://jitword.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span class="header-link__eyebrow">AI Office</span>
            <span class="header-link__title">JitWord 协同AI文档</span>
          </a>
          <a
            class="header-link header-link--secondary"
            href="https://know.jitword.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span class="header-link__eyebrow">Knowledge Base</span>
            <span class="header-link__title">JitKnow AI知识库</span>
          </a>
        </div>
      </div>
    </header>

    <main class="main">
      <aside class="sidebar">
        <section class="panel">
          <h3>文件来源</h3>
          <input
            type="file"
            accept=".docx,.xlsx,.xls,.pdf,.pptx,.ppt,.txt,.md,.ofd,.html,.htm,.jpg,.jpeg,.png,.gif,.webp,.svg,.bmp,.tiff,.tif,.ico"
            @change="handleFileChange"
          />
          <input
            v-model="urlInput"
            type="text"
            placeholder="输入文件 URL"
          />
          <button class="btn-primary" @click="loadUrl">加载 URL</button>
        </section>

        <section class="panel">
          <h3>示例文件</h3>
          <div class="demo-links">
            <button @click="loadDemo('localHtml')">本地 HTML</button>
            <button @click="loadDemo('pdf')">远程 PDF</button>
            <button @click="loadDemo('docx')">远程 DOCX</button>
            <button @click="loadDemo('excel')">远程 Excel</button>
          </div>
        </section>

        <section v-if="fileInfo" class="panel">
          <h3>当前文件</h3>
          <p><strong>名称:</strong> {{ fileInfo.name }}</p>
          <p><strong>类型:</strong> {{ fileInfo.type }}</p>
        </section>

        <section class="panel">
          <h3>预览配置</h3>
          <div class="form-group">
            <label>主题</label>
            <div class="btn-group">
              <button :class="{ active: theme === 'light' }" @click="setTheme('light')">浅色</button>
              <button :class="{ active: theme === 'dark' }" @click="setTheme('dark')">深色</button>
            </div>
          </div>

          <div class="form-group">
            <label>语言</label>
            <div class="btn-group">
              <button :class="{ active: locale === 'zh-CN' }" @click="setLocale('zh-CN')">中文</button>
              <button :class="{ active: locale === 'en' }" @click="setLocale('en')">English</button>
            </div>
          </div>

          <div class="form-group">
            <label>PDF 渲染方式</label>
            <div class="btn-group">
              <button :class="{ active: pdfRenderMode === 'inset' }" @click="setPdfRender('inset')">内置渲染</button>
              <button :class="{ active: pdfRenderMode === 'native' }" @click="setPdfRender('native')">浏览器原生</button>
            </div>
          </div>

          <div class="form-group">
            <label>工具栏</label>
            <div class="btn-group">
              <button :class="{ active: showToolbar }" @click="toggleToolbar(true)">显示</button>
              <button :class="{ active: !showToolbar }" @click="toggleToolbar(false)">隐藏</button>
            </div>
          </div>
        </section>

        <section class="panel">
          <h3>水印配置</h3>
          <div class="form-group">
            <label>水印状态</label>
            <div class="btn-group">
              <button :class="{ active: watermarkEnabled }" @click="watermarkEnabled = true">开启</button>
              <button :class="{ active: !watermarkEnabled }" @click="watermarkEnabled = false">关闭</button>
            </div>
          </div>

          <div class="form-group">
            <label>水印类型</label>
            <div class="btn-group">
              <button :class="{ active: watermarkType === 'text' }" @click="watermarkType = 'text'">文本</button>
              <button :class="{ active: watermarkType === 'image' }" @click="watermarkType = 'image'">图片</button>
            </div>
          </div>

          <div v-if="watermarkType === 'text'" class="stack">
            <div class="form-group">
              <label>文本内容</label>
              <input v-model="watermarkText" type="text" placeholder="请输入水印文案" />
            </div>

            <div class="form-group">
              <label>字体颜色</label>
              <input v-model="watermarkColor" type="color" class="color-input" />
            </div>

            <div class="form-group">
              <label>字体大小 <span>{{ watermarkFontSize }}px</span></label>
              <input v-model="watermarkFontSize" type="range" min="12" max="48" />
            </div>
          </div>

          <div v-else class="stack">
            <div class="form-group">
              <label>图片地址</label>
              <input v-model="watermarkImage" type="text" placeholder="请输入图片 URL" />
            </div>

            <div class="form-group">
              <label>图片尺寸 <span>{{ watermarkImageSize }}px</span></label>
              <input v-model="watermarkImageSize" type="range" min="40" max="180" />
            </div>

            <button class="btn-secondary" @click="useDefaultImageWatermark">恢复默认图片</button>
          </div>

          <div class="form-group">
            <label>透明度 <span>{{ watermarkOpacity }}</span></label>
            <input v-model="watermarkOpacity" type="range" min="0.05" max="0.6" step="0.05" />
          </div>

          <div class="form-group">
            <label>旋转角度 <span>{{ watermarkRotate }}deg</span></label>
            <input v-model="watermarkRotate" type="range" min="-90" max="90" step="5" />
          </div>

          <div class="form-group">
            <label>水平间距 <span>{{ watermarkGapX }}px</span></label>
            <input v-model="watermarkGapX" type="range" min="60" max="240" step="10" />
          </div>

          <div class="form-group">
            <label>垂直间距 <span>{{ watermarkGapY }}px</span></label>
            <input v-model="watermarkGapY" type="range" min="40" max="200" step="10" />
          </div>

          <div class="form-group">
            <label>层级位置</label>
            <div class="btn-group">
              <button :class="{ active: watermarkPosition === 'bottom' }" @click="watermarkPosition = 'bottom'">底层</button>
              <button :class="{ active: watermarkPosition === 'top' }" @click="watermarkPosition = 'top'">顶层</button>
            </div>
          </div>

          <div class="preset-group">
            <button @click="applyPreset('light')">轻量</button>
            <button @click="applyPreset('dense')">密集</button>
            <button @click="applyPreset('confidential')">保密</button>
          </div>

          <button class="btn-primary" @click="applyWatermark">应用水印</button>
          <button class="btn-secondary danger" @click="clearWatermark">移除水印</button>

          <p class="watermark-summary">{{ watermarkSummary }}</p>
        </section>

        <section class="panel">
          <h3>操作控制</h3>
          <div class="btn-group vertical">
            <button @click="zoomIn">放大</button>
            <button @click="zoomOut">缩小</button>
            <button @click="reset">重置</button>
            <button @click="print">打印</button>
            <button @click="download">下载</button>
          </div>
        </section>
      </aside>

      <section class="content">
        <div class="status-bar">{{ statusMessage }}</div>
        <div ref="viewerContainer" class="viewer-wrapper"></div>
        <div v-if="!currentFile" class="empty-state">
          <p>请选择文件或示例后开始预览</p>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { createViewer } from 'jit-viewer'
import type { FileSource, Locale, Theme, ViewerInstance } from 'jit-viewer'

type WatermarkMode = 'text' | 'image'
type WatermarkPosition = 'top' | 'bottom'

interface DemoFileMeta {
  source: string
  name: string
  type: string
}

interface LocalWatermarkConfig {
  type: WatermarkMode
  content?: string
  image?: string
  fontSize?: number
  color?: string
  imageWidth?: number
  imageHeight?: number
  opacity?: number
  rotate?: number
  gapX?: number
  gapY?: number
  position?: WatermarkPosition
}

const defaultWatermarkImage = '/samples/watermark-badge.svg'

const viewerInstance = ref<ViewerInstance | null>(null)
const viewerContainer = ref<HTMLElement | null>(null)

const currentFile = ref<FileSource | null>(null)
const fileInfo = ref<{ name: string; type: string } | null>(null)
const urlInput = ref('')
const theme = ref<Theme>('light')
const locale = ref<Locale>('zh-CN')
const pdfRenderMode = ref<'native' | 'inset'>('inset')
const showToolbar = ref(true)
const statusMessage = ref('等待加载示例文件')

const watermarkEnabled = ref(true)
const watermarkType = ref<WatermarkMode>('text')
const watermarkText = ref('内部资料 严禁外传')
const watermarkColor = ref('#bfbfbf')
const watermarkFontSize = ref(20)
const watermarkImage = ref(defaultWatermarkImage)
const watermarkImageSize = ref(96)
const watermarkOpacity = ref(0.2)
const watermarkRotate = ref(-24)
const watermarkGapX = ref(140)
const watermarkGapY = ref(90)
const watermarkPosition = ref<WatermarkPosition>('top')

const demoFiles: Record<string, DemoFileMeta> = {
  localHtml: {
    source: '/samples/watermark-demo.html',
    name: 'watermark-demo.html',
    type: 'html'
  },
  pdf: {
    source: 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf',
    name: 'compressed.tracemonkey-pldi-09.pdf',
    type: 'pdf'
  },
  docx: {
    source: 'https://static.jitword.com/test6.docx',
    name: 'test6.docx',
    type: 'docx'
  },
  excel: {
    source: 'https://static.jitword.com/demo/excel.xlsx',
    name: 'excel.xlsx',
    type: 'xlsx'
  }
}

const watermarkSummary = computed(() => {
  if (!watermarkEnabled.value) {
    return '当前未启用水印，点击“应用水印”后会以无水印方式重新渲染。'
  }

  if (watermarkType.value === 'text') {
    return `文本水印：${watermarkText.value || '未填写内容'}，透明度 ${watermarkOpacity.value}，间距 ${watermarkGapX.value} x ${watermarkGapY.value}px。`
  }

  return `图片水印：${watermarkImage.value || '未填写图片地址'}，尺寸 ${watermarkImageSize.value}px，透明度 ${watermarkOpacity.value}。`
})

function buildWatermarkConfig(): LocalWatermarkConfig | null {
  if (!watermarkEnabled.value) {
    return null
  }

  if (watermarkType.value === 'text') {
    return {
      type: 'text',
      content: watermarkText.value.trim() || '内部资料',
      fontSize: Number(watermarkFontSize.value),
      color: watermarkColor.value,
      opacity: Number(watermarkOpacity.value),
      rotate: Number(watermarkRotate.value),
      gapX: Number(watermarkGapX.value),
      gapY: Number(watermarkGapY.value),
      position: watermarkPosition.value
    }
  }

  return {
    type: 'image',
    image: watermarkImage.value.trim() || defaultWatermarkImage,
    imageWidth: Number(watermarkImageSize.value),
    imageHeight: Number(watermarkImageSize.value),
    opacity: Number(watermarkOpacity.value),
    rotate: Number(watermarkRotate.value),
    gapX: Number(watermarkGapX.value),
    gapY: Number(watermarkGapY.value),
    position: watermarkPosition.value
  }
}

function initViewer() {
  if (!viewerContainer.value) {
    return
  }

  if (viewerInstance.value) {
    viewerInstance.value.destroy()
  }

  const viewerOptions: any = {
    target: viewerContainer.value,
    file: currentFile.value || undefined,
    filename: fileInfo.value?.name,
    theme: theme.value,
    locale: locale.value,
    pdfRender: pdfRenderMode.value,
    toolbar: showToolbar.value,
    watermark: buildWatermarkConfig(),
    width: '100%',
    height: '720px',
    onReady: () => {
      statusMessage.value = 'Viewer 已初始化，可以切换参数继续测试'
    },
    onLoad: () => {
      statusMessage.value = `文件已加载：${fileInfo.value?.name || '未命名文件'}`
    },
    onError: (error: Error) => {
      statusMessage.value = `加载失败：${error.message}`
      console.error('Load error:', error)
    }
  }

  viewerInstance.value = createViewer(viewerOptions)
  viewerInstance.value.mount()
}

function refreshViewer(message: string) {
  statusMessage.value = message
  window.setTimeout(initViewer, 0)
}

function setCurrentFile(source: FileSource, name: string, type: string) {
  currentFile.value = source
  fileInfo.value = { name, type }
}

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) {
    return
  }

  setCurrentFile(file, file.name, file.type || 'local')
  refreshViewer(`正在加载本地文件：${file.name}`)
}

function loadUrl() {
  const url = urlInput.value.trim()
  if (!url) {
    statusMessage.value = '请输入有效的文件 URL'
    return
  }

  const filename = url.split('/').pop() || 'remote-file'
  setCurrentFile(url, filename, 'url')
  refreshViewer(`正在加载远程文件：${filename}`)
}

function loadDemo(key: string) {
  const demoFile = demoFiles[key]
  if (!demoFile) {
    statusMessage.value = '未找到对应的示例文件'
    return
  }

  setCurrentFile(demoFile.source, demoFile.name, demoFile.type)
  refreshViewer(`已切换示例文件：${demoFile.name}`)
}

function applyWatermark() {
  if (!currentFile.value) {
    loadDemo('localHtml')
    return
  }

  refreshViewer('正在应用当前水印配置')
}

function clearWatermark() {
  watermarkEnabled.value = false
  refreshViewer('已移除水印，正在重新渲染')
}

function applyPreset(preset: 'light' | 'dense' | 'confidential') {
  if (preset === 'light') {
    watermarkOpacity.value = 0.12
    watermarkRotate.value = -20
    watermarkGapX.value = 180
    watermarkGapY.value = 120
  }

  if (preset === 'dense') {
    watermarkOpacity.value = 0.18
    watermarkRotate.value = -35
    watermarkGapX.value = 90
    watermarkGapY.value = 60
  }

  if (preset === 'confidential') {
    watermarkType.value = 'text'
    watermarkEnabled.value = true
    watermarkText.value = 'CONFIDENTIAL'
    watermarkColor.value = '#d4380d'
    watermarkFontSize.value = 26
    watermarkOpacity.value = 0.2
    watermarkRotate.value = -30
    watermarkGapX.value = 120
    watermarkGapY.value = 80
    watermarkPosition.value = 'top'
  }
}

function useDefaultImageWatermark() {
  watermarkType.value = 'image'
  watermarkImage.value = defaultWatermarkImage
}

function setTheme(nextTheme: Theme) {
  theme.value = nextTheme
  viewerInstance.value?.setTheme(nextTheme)
}

function setLocale(nextLocale: Locale) {
  locale.value = nextLocale
  viewerInstance.value?.setLocale(nextLocale)
}

function setPdfRender(mode: 'native' | 'inset') {
  pdfRenderMode.value = mode
  refreshViewer(`已切换 PDF 渲染方式：${mode}`)
}

function toggleToolbar(visible: boolean) {
  showToolbar.value = visible
  refreshViewer(`工具栏已${visible ? '显示' : '隐藏'}`)
}

function zoomIn() {
  const state = viewerInstance.value?.getState()
  if (state) {
    viewerInstance.value?.zoom(state.zoom + 0.1)
  }
}

function zoomOut() {
  const state = viewerInstance.value?.getState()
  if (state) {
    viewerInstance.value?.zoom(Math.max(0.2, state.zoom - 0.1))
  }
}

function reset() {
  viewerInstance.value?.reset()
}

function print() {
  viewerInstance.value?.print()
}

async function download() {
  await viewerInstance.value?.download()
}

onMounted(() => {
  loadDemo('localHtml')
})

onUnmounted(() => {
  viewerInstance.value?.destroy()
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: #eef3f7;
  color: #223046;
}

button,
input {
  font: inherit;
}

.app {
  min-height: 100vh;
}

.header {
  background: linear-gradient(135deg, #0f3d56 0%, #1f6f8b 100%);
  color: #fff;
  padding: 24px 28px;
  box-shadow: 0 14px 32px rgba(15, 61, 86, 0.16);
}

.header-content {
  max-width: 1440px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.header-title h1 {
  margin-bottom: 8px;
  font-size: 28px;
}

.header-title p {
  color: rgba(255, 255, 255, 0.82);
  font-size: 14px;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.header-link {
  min-width: 220px;
  padding: 14px 18px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  text-decoration: none;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 14px 32px rgba(8, 49, 104, 0.26);
  transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
}

.header-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 18px 36px rgba(8, 49, 104, 0.32);
  filter: brightness(1.03);
}

.header-link--primary {
  background: linear-gradient(135deg, #56b8ff 0%, #257cff 52%, #1750d4 100%);
}

.header-link--secondary {
  background: linear-gradient(135deg, #75c6ff 0%, #3b8dff 52%, #1f63df 100%);
}

.header-link__eyebrow {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.76);
}

.header-link__title {
  font-size: 15px;
  font-weight: 700;
  line-height: 1.35;
}

.main {
  max-width: 1440px;
  margin: 20px auto;
  padding: 0 20px 24px;
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.sidebar {
  width: 320px;
  flex-shrink: 0;
  position: sticky;
  top: 20px;
  max-height: calc(100vh - 40px);
  overflow-y: auto;
  padding-right: 6px;
}

.panel {
  background: #fff;
  border: 1px solid #dbe6ee;
  border-radius: 16px;
  padding: 18px;
  margin-bottom: 16px;
  box-shadow: 0 8px 20px rgba(34, 48, 70, 0.05);
}

.panel h3 {
  margin-bottom: 14px;
  font-size: 15px;
  color: #13263a;
}

.panel p {
  line-height: 1.6;
  font-size: 13px;
}

.panel input[type='file'],
.panel input[type='text'] {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #c7d6e2;
  border-radius: 10px;
  margin-bottom: 10px;
  background: #fbfdff;
}

.form-group {
  margin-bottom: 14px;
}

.form-group label {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
  font-size: 13px;
  color: #4a6072;
}

.stack {
  margin-bottom: 10px;
}

.btn-primary,
.btn-secondary,
.btn-group button,
.demo-links button,
.preset-group button {
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary,
.btn-secondary {
  width: 100%;
  padding: 10px 14px;
}

.btn-primary {
  background: #1f6f8b;
  color: #fff;
}

.btn-primary:hover {
  background: #16576d;
}

.btn-secondary {
  margin-top: 10px;
  background: #e8eef3;
  color: #28465a;
}

.btn-secondary:hover {
  background: #d7e3ec;
}

.btn-secondary.danger {
  color: #8c2d1f;
}

.btn-group {
  display: flex;
  gap: 8px;
}

.btn-group button {
  flex: 1;
  padding: 8px 12px;
  background: #edf3f7;
  color: #385267;
}

.btn-group button:hover,
.demo-links button:hover,
.preset-group button:hover {
  background: #dfeaf2;
}

.btn-group button.active {
  background: #1f6f8b;
  color: #fff;
}

.btn-group.vertical {
  flex-direction: column;
}

.demo-links,
.preset-group {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.preset-group {
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin-bottom: 12px;
}

.demo-links button,
.preset-group button {
  padding: 10px 12px;
  background: #edf3f7;
  color: #385267;
}

.content {
  flex: 1;
  min-width: 0;
  background: #fff;
  border: 1px solid #dbe6ee;
  border-radius: 20px;
  padding: 18px;
  box-shadow: 0 10px 24px rgba(34, 48, 70, 0.06);
}

.status-bar {
  margin-bottom: 14px;
  padding: 12px 14px;
  border-radius: 12px;
  background: #f2f7fb;
  color: #375268;
  font-size: 13px;
}

.viewer-wrapper {
  min-height: 720px;
  border-radius: 16px;
  overflow: hidden;
  background: #f7fafc;
}

.empty-state {
  min-height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6f8191;
  font-size: 15px;
}

.watermark-summary {
  margin-top: 12px;
  font-size: 12px;
  line-height: 1.6;
  color: #617789;
}

.sidebar::-webkit-scrollbar {
  width: 8px;
}

.sidebar::-webkit-scrollbar-thumb {
  background: rgba(31, 111, 139, 0.28);
  border-radius: 999px;
}

.sidebar::-webkit-scrollbar-track {
  background: transparent;
}

.color-input {
  height: 42px;
  padding: 4px;
}

input[type='range'] {
  width: 100%;
}

@media (max-width: 1100px) {
  .header-content,
  .main {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    position: static;
    max-height: none;
    overflow: visible;
    padding-right: 0;
  }

  .viewer-wrapper {
    min-height: 600px;
  }
}

@media (max-width: 720px) {
  .header {
    padding: 20px;
  }

  .header-actions,
  .demo-links,
  .preset-group {
    width: 100%;
  }

  .header-actions {
    flex-direction: column;
  }

  .demo-links,
  .preset-group {
    grid-template-columns: 1fr;
  }
}
</style>
