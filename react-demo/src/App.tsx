import React, { useRef, useState, useCallback } from 'react'
import { createViewer } from '@jit-viewer/core'
import type { ViewerInstance, FileSource, Theme, Locale } from '@jit-viewer/core'
import './App.css'

function App() {
  const viewerRef = useRef<ViewerInstance | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [currentFile, setCurrentFile] = useState<FileSource>()
  const [urlInput, setUrlInput] = useState('')
  const [theme, setTheme] = useState<Theme>('light')
  const [locale, setLocale] = useState<Locale>('zh-CN')
  const [toolbar, setToolbar] = useState(true)
  const [fileInfo, setFileInfo] = useState<{ filename: string; type: string } | null>(null)

  // 初始化Viewer
  const initViewer = useCallback(() => {
    if (!containerRef.current) return

    // 如果已存在，先销毁
    if (viewerRef.current) {
      viewerRef.current.destroy()
    }

    // 创建新的Viewer实例
    viewerRef.current = createViewer({
      target: containerRef.current,
      file: currentFile,
      theme,
      locale,
      toolbar,
      width: '100%',
      height: '600px',
      onReady: () => {
        console.log('Viewer ready')
      },
      onLoad: () => {
        console.log('File loaded')
      },
      onError: (error) => {
        console.error('Load error:', error)
        alert('加载失败: ' + error.message)
      }
    })

    viewerRef.current.mount()
  }, [currentFile, theme, locale, toolbar])

  // 文件选择处理
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCurrentFile(file)
      setFileInfo({
        filename: file.name,
        type: file.type || 'unknown'
      })
      // 重新初始化以加载新文件
      setTimeout(initViewer, 0)
    }
  }

  // 加载URL
  const handleLoadUrl = () => {
    if (urlInput.trim()) {
      setCurrentFile(urlInput.trim())
      const filename = urlInput.split('/').pop() || 'unknown'
      setFileInfo({
        filename,
        type: 'url'
      })
      // 重新初始化以加载新文件
      setTimeout(initViewer, 0)
    }
  }

  // 设置主题
  const handleSetTheme = (t: Theme) => {
    setTheme(t)
    viewerRef.current?.setTheme(t)
  }

  // 设置语言
  const handleSetLocale = (l: Locale) => {
    setLocale(l)
    viewerRef.current?.setLocale(l)
  }

  // 放大
  const handleZoomIn = () => {
    const state = viewerRef.current?.getState()
    if (state) {
      viewerRef.current?.zoom(state.zoom + 0.1)
    }
  }

  // 缩小
  const handleZoomOut = () => {
    const state = viewerRef.current?.getState()
    if (state) {
      viewerRef.current?.zoom(state.zoom - 0.1)
    }
  }

  // 重置
  const handleReset = () => {
    viewerRef.current?.reset()
  }

  // 打印
  const handlePrint = () => {
    viewerRef.current?.print()
  }

  // 下载
  const handleDownload = async () => {
    await viewerRef.current?.download()
  }

  // 切换工具栏
  const handleToggleToolbar = () => {
    const newValue = !toolbar
    setToolbar(newValue)
    viewerRef.current?.setToolbar(newValue)
  }

  return (
    <div className="app">
      <header className="header">
        <h1>JitViewer React Demo</h1>
        <p>基于React的文档预览SDK演示</p>
      </header>

      <main className="main">
        <div className="sidebar">
          <div className="panel">
            <h3>文件操作</h3>

            <div className="form-group">
              <label>选择文件:</label>
              <input
                type="file"
                accept=".docx,.xlsx,.pdf,.pptx,.txt,.md"
                onChange={handleFileChange}
              />
            </div>

            <div className="form-group">
              <label>或输入URL:</label>
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/file.pdf"
              />
              <button className="btn-primary" onClick={handleLoadUrl}>
                加载URL
              </button>
            </div>
          </div>

          <div className="panel">
            <h3>配置选项</h3>

            <div className="form-group">
              <label>主题:</label>
              <div className="btn-group">
                <button
                  className={theme === 'light' ? 'active' : ''}
                  onClick={() => handleSetTheme('light')}
                >
                  浅色
                </button>
                <button
                  className={theme === 'dark' ? 'active' : ''}
                  onClick={() => handleSetTheme('dark')}
                >
                  深色
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>语言:</label>
              <div className="btn-group">
                <button
                  className={locale === 'zh-CN' ? 'active' : ''}
                  onClick={() => handleSetLocale('zh-CN')}
                >
                  中文
                </button>
                <button
                  className={locale === 'en' ? 'active' : ''}
                  onClick={() => handleSetLocale('en')}
                >
                  English
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>工具栏:</label>
              <div className="btn-group">
                <button
                  className={toolbar ? 'active' : ''}
                  onClick={handleToggleToolbar}
                >
                  {toolbar ? '显示' : '隐藏'}
                </button>
              </div>
            </div>
          </div>

          <div className="panel">
            <h3>操作控制</h3>
            <div className="btn-group vertical">
              <button onClick={handleZoomIn}>放大</button>
              <button onClick={handleZoomOut}>缩小</button>
              <button onClick={handleReset}>重置</button>
              <button onClick={handlePrint}>打印</button>
              <button onClick={handleDownload}>下载</button>
            </div>
          </div>

          {fileInfo && (
            <div className="panel">
              <h3>文件信息</h3>
              <div className="info-list">
                <div className="info-item">
                  <span className="label">文件名:</span>
                  <span className="value">{fileInfo.filename}</span>
                </div>
                <div className="info-item">
                  <span className="label">类型:</span>
                  <span className="value">{fileInfo.type}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="content">
          <div ref={containerRef} className="viewer-wrapper" />
          {!currentFile && (
            <div className="empty-state">
              <p>请选择文件或输入URL开始预览</p>
              <button className="btn-primary" onClick={initViewer}>
                初始化预览器
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default App
