/**
 * OptiCompress PRO - Batch Image & PDF Reducer/Resizer
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    lucide.createIcons();
  }

  // Detect file:// protocol
  const isFileProtocol = window.location.protocol === 'file:';

  // Set pdf.js worker source safely
  if (window.pdfjsLib) {
    try {
      if (!isFileProtocol) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      } else {
        console.warn('Running via file:// protocol. Disabling external web workers for CORS safety.');
      }
    } catch (e) {
      console.warn('Worker configuration note:', e);
    }
  }

  if (isFileProtocol) {
    showProtocolWarning();
  }

  // --- APP STATE ---
  const state = {
    activeTab: 'image', // 'image' | 'pdf'

    // Image State
    imageFiles: [],
    imageMode: 'target',
    imageTargetSize: 300,
    imageTargetUnit: 'KB',
    imageQuality: 0.8,
    imageMaxDimension: 'original',
    imageOutputFormat: 'original',
    imageProcessing: false,

    // PDF State
    pdfFiles: [],
    pdfMode: 'compress', // 'compress' | 'resize'
    pdfTargetSize: 500,
    pdfTargetUnit: 'KB',
    pdfQualityPreset: 'balanced',
    pdfScalePreset: 'scale_150',
    pdfCustomScale: 120,
    pdfProcessing: false
  };

  // --- DOM ELEMENTS ---

  // Navigation Tabs
  const tabBtnImage = document.getElementById('tab-btn-image');
  const tabBtnPdf = document.getElementById('tab-btn-pdf');
  const tabContentImage = document.getElementById('tab-content-image');
  const tabContentPdf = document.getElementById('tab-content-pdf');

  // Image Controls
  const imgDropzone = document.getElementById('dropzone');
  const imgFileInput = document.getElementById('file-input');
  const imgList = document.getElementById('image-list');
  const imgEmptyState = document.getElementById('empty-state');
  const imgSummaryBar = document.getElementById('summary-bar');
  const imgBatchToolbar = document.getElementById('batch-toolbar');

  const modeTargetRadio = document.getElementById('mode-target');
  const modeQualityRadio = document.getElementById('mode-quality');
  const targetSizeContainer = document.getElementById('target-size-container');
  const qualitySliderContainer = document.getElementById('quality-slider-container');
  const targetSizeInput = document.getElementById('target-size-input');
  const targetSizeUnit = document.getElementById('target-size-unit');
  const qualitySlider = document.getElementById('quality-slider');
  const qualityValueDisplay = document.getElementById('quality-value-display');
  const maxDimensionPreset = document.getElementById('max-dimension-preset');
  const customDimensionContainer = document.getElementById('custom-dimension-container');
  const customMaxWidth = document.getElementById('custom-max-width');
  const customMaxHeight = document.getElementById('custom-max-height');
  const outputFormat = document.getElementById('output-format');
  const applySettingsBtn = document.getElementById('apply-settings-btn');

  const statCount = document.getElementById('stat-count');
  const statOrigSize = document.getElementById('stat-orig-size');
  const statCompSize = document.getElementById('stat-comp-size');
  const statSavedPercent = document.getElementById('stat-saved-percent');
  const statSavedSize = document.getElementById('stat-saved-size');
  const queueCount = document.getElementById('queue-count');

  const clearAllBtn = document.getElementById('clear-all-btn');
  const compressAllBtn = document.getElementById('compress-all-btn');
  const downloadAllBtn = document.getElementById('download-all-btn');

  // PDF Controls
  const pdfDropzone = document.getElementById('pdf-dropzone');
  const pdfFileInput = document.getElementById('pdf-file-input');
  const pdfList = document.getElementById('pdf-list');
  const pdfEmptyState = document.getElementById('pdf-empty-state');
  const pdfSummaryBar = document.getElementById('pdf-summary-bar');
  const pdfBatchToolbar = document.getElementById('pdf-batch-toolbar');

  const pdfModeCompressRadio = document.getElementById('pdf-mode-compress');
  const pdfModeResizeRadio = document.getElementById('pdf-mode-resize');
  const pdfCompressContainer = document.getElementById('pdf-compress-container');
  const pdfResizeContainer = document.getElementById('pdf-resize-container');
  const pdfTargetSizeInput = document.getElementById('pdf-target-size-input');
  const pdfTargetSizeUnit = document.getElementById('pdf-target-size-unit');
  const pdfQualityPreset = document.getElementById('pdf-quality-preset');
  const pdfScalePreset = document.getElementById('pdf-scale-preset');
  const pdfCustomScaleRow = document.getElementById('pdf-custom-scale-row');
  const pdfCustomScaleVal = document.getElementById('pdf-custom-scale-val');
  const pdfApplySettingsBtn = document.getElementById('pdf-apply-settings-btn');

  const pdfStatCount = document.getElementById('pdf-stat-count');
  const pdfStatOrigSize = document.getElementById('pdf-stat-orig-size');
  const pdfStatCompSize = document.getElementById('pdf-stat-comp-size');
  const pdfStatSavedPercent = document.getElementById('pdf-stat-saved-percent');
  const pdfStatSavedSize = document.getElementById('pdf-stat-saved-size');
  const pdfQueueCount = document.getElementById('pdf-queue-count');

  const pdfClearAllBtn = document.getElementById('pdf-clear-all-btn');
  const pdfProcessAllBtn = document.getElementById('pdf-process-all-btn');
  const pdfDownloadAllBtn = document.getElementById('pdf-download-all-btn');

  // Modal
  const previewModal = document.getElementById('preview-modal');
  const modalBackdrop = document.getElementById('modal-backdrop');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalTitle = document.getElementById('modal-title');
  const modalImgOrig = document.getElementById('modal-img-orig');
  const modalImgComp = document.getElementById('modal-img-comp');
  const modalOrigDim = document.getElementById('modal-orig-dim');
  const modalOrigSize = document.getElementById('modal-orig-size');
  const modalCompDim = document.getElementById('modal-comp-dim');
  const modalCompSize = document.getElementById('modal-comp-size');
  const modalSavedBadge = document.getElementById('modal-saved-badge');
  const modalDownloadBtn = document.getElementById('modal-download-btn');

  // --- TAB SWITCHING LOGIC ---

  function switchTab(tabName) {
    state.activeTab = tabName;
    if (tabName === 'image') {
      tabBtnImage.classList.add('active');
      tabBtnPdf.classList.remove('active');
      tabContentImage.classList.remove('hidden');
      tabContentPdf.classList.add('hidden');
    } else {
      tabBtnPdf.classList.add('active');
      tabBtnImage.classList.remove('active');
      tabContentPdf.classList.remove('hidden');
      tabContentImage.classList.add('hidden');
    }
  }

  tabBtnImage.addEventListener('click', () => switchTab('image'));
  tabBtnPdf.addEventListener('click', () => switchTab('pdf'));

  // --- IMAGE CONTROLS LISTENERS ---

  modeTargetRadio.addEventListener('change', () => {
    state.imageMode = 'target';
    targetSizeContainer.classList.remove('hidden');
    qualitySliderContainer.classList.add('hidden');
  });

  modeQualityRadio.addEventListener('change', () => {
    state.imageMode = 'quality';
    targetSizeContainer.classList.add('hidden');
    qualitySliderContainer.classList.remove('hidden');
  });

  qualitySlider.addEventListener('input', (e) => {
    qualityValueDisplay.textContent = `${e.target.value}%`;
    state.imageQuality = e.target.value / 100;
  });

  maxDimensionPreset.addEventListener('change', (e) => {
    state.imageMaxDimension = e.target.value;
    if (e.target.value === 'custom') {
      customDimensionContainer.classList.remove('hidden');
    } else {
      customDimensionContainer.classList.add('hidden');
    }
  });

  applySettingsBtn.addEventListener('click', () => {
    if (state.imageFiles.length === 0) {
      showToast('No images in queue to re-compress.', 'warning');
      return;
    }
    recompressAllImages();
  });

  // Image Drag & Drop
  ['dragenter', 'dragover'].forEach(name => {
    imgDropzone.addEventListener(name, (e) => { e.preventDefault(); imgDropzone.classList.add('drag-over'); });
  });
  ['dragleave', 'drop'].forEach(name => {
    imgDropzone.addEventListener(name, (e) => { e.preventDefault(); imgDropzone.classList.remove('drag-over'); });
  });

  imgDropzone.addEventListener('drop', (e) => {
    const dropped = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    if (dropped.length > 0) addImagesToQueue(dropped);
    else showToast('Please drop valid image files.', 'warning');
  });

  imgFileInput.addEventListener('change', (e) => {
    const selected = Array.from(e.target.files).filter(f => f.type.startsWith('image/'));
    if (selected.length > 0) addImagesToQueue(selected);
    imgFileInput.value = '';
  });

  clearAllBtn.addEventListener('click', () => {
    state.imageFiles = [];
    renderImageQueue();
    updateImageStats();
    showToast('Image queue cleared', 'info');
  });

  compressAllBtn.addEventListener('click', compressAllImages);
  downloadAllBtn.addEventListener('click', downloadAllImagesAsZip);

  // --- PDF CONTROLS LISTENERS ---

  pdfModeCompressRadio.addEventListener('change', () => {
    state.pdfMode = 'compress';
    pdfCompressContainer.classList.remove('hidden');
    pdfResizeContainer.classList.add('hidden');
  });

  pdfModeResizeRadio.addEventListener('change', () => {
    state.pdfMode = 'resize';
    pdfCompressContainer.classList.add('hidden');
    pdfResizeContainer.classList.remove('hidden');
  });

  pdfScalePreset.addEventListener('change', (e) => {
    state.pdfScalePreset = e.target.value;
    if (e.target.value === 'custom_scale') {
      pdfCustomScaleRow.classList.remove('hidden');
    } else {
      pdfCustomScaleRow.classList.add('hidden');
    }
  });

  pdfApplySettingsBtn.addEventListener('click', () => {
    if (state.pdfFiles.length === 0) {
      showToast('No PDFs in queue to process.', 'warning');
      return;
    }
    reprocessAllPdfs();
  });

  // PDF Drag & Drop
  ['dragenter', 'dragover'].forEach(name => {
    pdfDropzone.addEventListener(name, (e) => { e.preventDefault(); pdfDropzone.classList.add('drag-over'); });
  });
  ['dragleave', 'drop'].forEach(name => {
    pdfDropzone.addEventListener(name, (e) => { e.preventDefault(); pdfDropzone.classList.remove('drag-over'); });
  });

  pdfDropzone.addEventListener('drop', (e) => {
    const dropped = Array.from(e.dataTransfer.files).filter(f => f.type === 'application/pdf' || f.name.endsWith('.pdf'));
    if (dropped.length > 0) addPdfsToQueue(dropped);
    else showToast('Please drop valid PDF files.', 'warning');
  });

  pdfFileInput.addEventListener('change', (e) => {
    const selected = Array.from(e.target.files).filter(f => f.type === 'application/pdf' || f.name.endsWith('.pdf'));
    if (selected.length > 0) addPdfsToQueue(selected);
    pdfFileInput.value = '';
  });

  pdfClearAllBtn.addEventListener('click', () => {
    state.pdfFiles = [];
    renderPdfQueue();
    updatePdfStats();
    showToast('PDF queue cleared', 'info');
  });

  pdfProcessAllBtn.addEventListener('click', processAllPdfs);
  pdfDownloadAllBtn.addEventListener('click', downloadAllPdfsAsZip);

  // Modal Close
  modalCloseBtn.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', closeModal);

  // ==========================================================================
  // IMAGE PROCESSING LOGIC
  // ==========================================================================

  function addImagesToQueue(files) {
    const newItems = files.map(file => ({
      id: generateId(),
      originalFile: file,
      compressedBlob: null,
      status: 'queued',
      progress: 0,
      origSize: file.size,
      compSize: 0,
      savedBytes: 0,
      savedPercent: 0,
      origDimensions: null,
      compDimensions: null,
      errorMessage: null
    }));

    state.imageFiles.push(...newItems);
    renderImageQueue();
    updateImageStats();
    showToast(`Added ${newItems.length} image(s) to queue`, 'success');
    compressAllImages();
  }

  function renderImageQueue() {
    if (state.imageFiles.length === 0) {
      imgEmptyState.classList.remove('hidden');
      imgSummaryBar.classList.add('hidden');
      imgBatchToolbar.classList.add('hidden');
      imgList.innerHTML = '';
      imgList.appendChild(imgEmptyState);
      return;
    }

    imgEmptyState.classList.add('hidden');
    imgSummaryBar.classList.remove('hidden');
    imgBatchToolbar.classList.remove('hidden');
    queueCount.textContent = state.imageFiles.length;

    imgList.innerHTML = '';
    state.imageFiles.forEach(item => {
      const card = createImageCardElement(item);
      imgList.appendChild(card);
    });

    if (window.lucide) lucide.createIcons();
  }

  function createImageCardElement(item) {
    const card = document.createElement('div');
    card.className = 'image-card';
    card.id = `img-card-${item.id}`;

    const thumbUrl = URL.createObjectURL(item.originalFile);

    let statusHtml = '';
    if (item.status === 'queued') statusHtml = `<span class="status-indicator queued"><i data-lucide="clock"></i> Ready</span>`;
    else if (item.status === 'processing') statusHtml = `<span class="status-indicator processing"><i data-lucide="loader-2" class="spin"></i> ${item.progress}%</span>`;
    else if (item.status === 'done') statusHtml = `<span class="status-indicator done"><i data-lucide="check-circle-2"></i> Done</span>`;
    else if (item.status === 'error') statusHtml = `<span class="status-indicator error"><i data-lucide="alert-triangle"></i> Failed</span>`;

    let resultColHtml = '';
    if (item.status === 'done') {
      resultColHtml = `
        <span class="comp-size-text">${formatBytes(item.compSize)}</span>
        <span class="saved-percent-badge">Saved ${item.savedPercent.toFixed(1)}%</span>
      `;
    } else if (item.status === 'error') {
      resultColHtml = `<span class="text-subtle" style="font-size:0.75rem;">${item.errorMessage || 'Error'}</span>`;
    } else {
      resultColHtml = `<span class="text-subtle" style="font-size:0.8rem;">--</span>`;
    }

    card.innerHTML = `
      <div class="thumb-wrapper">
        <img src="${thumbUrl}" alt="Thumbnail" class="thumb-img">
      </div>
      
      <div class="img-meta-info">
        <span class="file-name" title="${escapeHtml(item.originalFile.name)}">${escapeHtml(item.originalFile.name)}</span>
        <span class="file-orig-size">Original: ${formatBytes(item.origSize)}</span>
      </div>

      <div class="compression-status-col">
        <div class="status-badge-row">${statusHtml}</div>
        <div class="card-progress-bg">
          <div class="card-progress-fill" style="width: ${item.progress}%"></div>
        </div>
      </div>

      <div class="result-info-col">
        ${resultColHtml}
      </div>

      <div class="card-actions-col">
        ${item.status === 'done' ? `
          <button type="button" class="btn-icon btn-preview-item" data-id="${item.id}" title="Preview Comparison"><i data-lucide="eye"></i></button>
          <button type="button" class="btn-icon btn-download-item" data-id="${item.id}" title="Download File"><i data-lucide="download"></i></button>
        ` : ''}
        <button type="button" class="btn-icon btn-remove-item" data-id="${item.id}" title="Remove image"><i data-lucide="trash-2"></i></button>
      </div>
    `;

    const previewBtn = card.querySelector('.btn-preview-item');
    if (previewBtn) previewBtn.addEventListener('click', () => openImagePreviewModal(item.id));

    const downloadBtn = card.querySelector('.btn-download-item');
    if (downloadBtn) downloadBtn.addEventListener('click', () => downloadSingleImage(item.id));

    const removeBtn = card.querySelector('.btn-remove-item');
    if (removeBtn) removeBtn.addEventListener('click', () => {
      state.imageFiles = state.imageFiles.filter(f => f.id !== item.id);
      renderImageQueue();
      updateImageStats();
    });

    return card;
  }

  async function compressAllImages() {
    if (state.imageProcessing) return;
    const queuedItems = state.imageFiles.filter(f => f.status !== 'processing');
    if (queuedItems.length === 0) return;

    state.imageProcessing = true;
    compressAllBtn.disabled = true;
    applySettingsBtn.disabled = true;

    for (const item of queuedItems) {
      if (!state.imageFiles.find(f => f.id === item.id)) continue;
      await compressSingleImage(item);
    }

    state.imageProcessing = false;
    compressAllBtn.disabled = false;
    applySettingsBtn.disabled = false;
    updateImageStats();
    showToast('Image compression completed!', 'success');
  }

  async function recompressAllImages() {
    state.imageFiles.forEach(item => {
      item.status = 'queued';
      item.progress = 0;
      item.compressedBlob = null;
    });
    renderImageQueue();
    compressAllImages();
  }

  async function compressSingleImage(item) {
    item.status = 'processing';
    item.progress = 10;
    updateImageCardUI(item);

    try {
      const options = {
        useWebWorker: !isFileProtocol,
        onProgress: (percent) => {
          item.progress = Math.min(95, Math.max(10, percent));
          updateImageCardUI(item);
        }
      };

      if (state.imageMode === 'target') {
        const val = parseFloat(targetSizeInput.value) || 300;
        const unit = targetSizeUnit.value;
        options.maxSizeMB = unit === 'KB' ? val / 1024 : val;
      } else {
        options.initialQuality = parseFloat(qualitySlider.value) / 100;
        options.maxSizeMB = 100;
      }

      if (state.imageMaxDimension !== 'original') {
        if (state.imageMaxDimension === 'custom') {
          const w = parseInt(customMaxWidth.value) || 1920;
          const h = parseInt(customMaxHeight.value) || 1080;
          options.maxWidthOrHeight = Math.max(w, h);
        } else {
          options.maxWidthOrHeight = parseInt(state.imageMaxDimension);
        }
      }

      if (outputFormat.value !== 'original') {
        options.fileType = outputFormat.value;
      }

      let compressedBlob;
      try {
        compressedBlob = await imageCompression(item.originalFile, options);
      } catch (workerErr) {
        options.useWebWorker = false;
        compressedBlob = await imageCompression(item.originalFile, options);
      }

      item.compressedBlob = compressedBlob;
      item.compSize = compressedBlob.size;
      item.savedBytes = Math.max(0, item.origSize - item.compSize);
      item.savedPercent = item.origSize > 0 ? (item.savedBytes / item.origSize) * 100 : 0;
      item.status = 'done';
      item.progress = 100;

      item.origDimensions = await getImageDimensions(item.originalFile);
      item.compDimensions = await getImageDimensions(compressedBlob);

    } catch (err) {
      console.error('Image Compression Error:', err);
      item.status = 'error';
      item.errorMessage = err.message || 'Compression failed';
      item.progress = 0;
    }

    updateImageCardUI(item);
    updateImageStats();
  }

  function updateImageCardUI(item) {
    const card = document.getElementById(`img-card-${item.id}`);
    if (!card) return;
    const newCard = createImageCardElement(item);
    card.replaceWith(newCard);
    if (window.lucide) lucide.createIcons();
  }

  function updateImageStats() {
    const totalCount = state.imageFiles.length;
    const completed = state.imageFiles.filter(f => f.status === 'done');

    statCount.textContent = totalCount;

    if (totalCount === 0) {
      statOrigSize.textContent = '0 KB';
      statCompSize.textContent = '0 KB';
      statSavedPercent.textContent = '0%';
      statSavedSize.textContent = '(0 KB)';
      downloadAllBtn.disabled = true;
      return;
    }

    const origSum = state.imageFiles.reduce((acc, f) => acc + f.origSize, 0);
    const compSum = completed.reduce((acc, f) => acc + f.compSize, 0);
    const savedSum = Math.max(0, origSum - compSum);
    const percentSum = origSum > 0 ? (savedSum / origSum) * 100 : 0;

    statOrigSize.textContent = formatBytes(origSum);
    statCompSize.textContent = formatBytes(compSum);
    statSavedPercent.textContent = `${percentSum.toFixed(1)}%`;
    statSavedSize.textContent = `(${formatBytes(savedSum)})`;

    downloadAllBtn.disabled = completed.length === 0;
  }

  function downloadSingleImage(id) {
    const item = state.imageFiles.find(f => f.id === id);
    if (!item || !item.compressedBlob) return;

    const ext = getExtensionFromBlob(item.compressedBlob, item.originalFile.name);
    const baseName = item.originalFile.name.substring(0, item.originalFile.name.lastIndexOf('.')) || item.originalFile.name;
    const filename = `${baseName}_compressed.${ext}`;

    triggerDownload(item.compressedBlob, filename);
  }

  async function downloadAllImagesAsZip() {
    const completed = state.imageFiles.filter(f => f.status === 'done' && f.compressedBlob);
    if (completed.length === 0) return;

    showToast('Creating ZIP archive...', 'info');
    const zip = new JSZip();
    const folder = zip.folder('compressed_images');

    completed.forEach((item, index) => {
      const ext = getExtensionFromBlob(item.compressedBlob, item.originalFile.name);
      const baseName = item.originalFile.name.substring(0, item.originalFile.name.lastIndexOf('.')) || `image_${index + 1}`;
      folder.file(`${baseName}_compressed.${ext}`, item.compressedBlob);
    });

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    triggerDownload(zipBlob, 'OptiCompress_Images.zip');
    showToast('ZIP downloaded successfully!', 'success');
  }

  // ==========================================================================
  // PDF PROCESSING LOGIC (pdf-lib & pdf.js)
  // ==========================================================================

  async function addPdfsToQueue(files) {
    const newItems = [];
    for (const file of files) {
      const pageCountStr = await getPdfPageCount(file);
      newItems.push({
        id: generateId(),
        originalFile: file,
        processedBlob: null,
        status: 'queued',
        progress: 0,
        origSize: file.size,
        compSize: 0,
        savedBytes: 0,
        savedPercent: 0,
        pageCount: pageCountStr,
        thumbnailUrl: null,
        errorMessage: null
      });
    }

    state.pdfFiles.push(...newItems);
    renderPdfQueue();
    updatePdfStats();
    showToast(`Added ${newItems.length} PDF file(s) to queue`, 'success');
    processAllPdfs();
  }

  function renderPdfQueue() {
    if (state.pdfFiles.length === 0) {
      pdfEmptyState.classList.remove('hidden');
      pdfSummaryBar.classList.add('hidden');
      pdfBatchToolbar.classList.add('hidden');
      pdfList.innerHTML = '';
      pdfList.appendChild(pdfEmptyState);
      return;
    }

    pdfEmptyState.classList.add('hidden');
    pdfSummaryBar.classList.remove('hidden');
    pdfBatchToolbar.classList.remove('hidden');
    pdfQueueCount.textContent = state.pdfFiles.length;

    pdfList.innerHTML = '';
    state.pdfFiles.forEach(item => {
      const card = createPdfCardElement(item);
      pdfList.appendChild(card);
    });

    if (window.lucide) lucide.createIcons();
  }

  function createPdfCardElement(item) {
    const card = document.createElement('div');
    card.className = 'image-card';
    card.id = `pdf-card-${item.id}`;

    let statusHtml = '';
    if (item.status === 'queued') statusHtml = `<span class="status-indicator queued"><i data-lucide="clock"></i> Ready</span>`;
    else if (item.status === 'processing') statusHtml = `<span class="status-indicator processing"><i data-lucide="loader-2" class="spin"></i> ${item.progress}%</span>`;
    else if (item.status === 'done') statusHtml = `<span class="status-indicator done"><i data-lucide="check-circle-2"></i> Done</span>`;
    else if (item.status === 'error') statusHtml = `<span class="status-indicator error"><i data-lucide="alert-triangle"></i> Failed</span>`;

    let resultColHtml = '';
    if (item.status === 'done') {
      const isSaving = item.savedBytes >= 0;
      resultColHtml = `
        <span class="comp-size-text">${formatBytes(item.compSize)}</span>
        <span class="saved-percent-badge">${isSaving ? 'Saved ' : 'Size '} ${Math.abs(item.savedPercent).toFixed(1)}%</span>
      `;
    } else if (item.status === 'error') {
      resultColHtml = `<span class="text-subtle" style="font-size:0.75rem;">${item.errorMessage || 'Error'}</span>`;
    } else {
      resultColHtml = `<span class="text-subtle" style="font-size:0.8rem;">--</span>`;
    }

    card.innerHTML = `
      <div class="thumb-wrapper">
        <div class="pdf-thumb-icon">
          <i data-lucide="file-text"></i>
          <span class="page-count-badge">${item.pageCount}</span>
        </div>
      </div>
      
      <div class="img-meta-info">
        <span class="file-name" title="${escapeHtml(item.originalFile.name)}">${escapeHtml(item.originalFile.name)}</span>
        <span class="file-orig-size">Original: ${formatBytes(item.origSize)}</span>
      </div>

      <div class="compression-status-col">
        <div class="status-badge-row">${statusHtml}</div>
        <div class="card-progress-bg">
          <div class="card-progress-fill" style="width: ${item.progress}%"></div>
        </div>
      </div>

      <div class="result-info-col">
        ${resultColHtml}
      </div>

      <div class="card-actions-col">
        ${item.status === 'done' ? `
          <button type="button" class="btn-icon btn-download-pdf" data-id="${item.id}" title="Download Processed PDF"><i data-lucide="download"></i></button>
        ` : ''}
        <button type="button" class="btn-icon btn-remove-pdf" data-id="${item.id}" title="Remove PDF"><i data-lucide="trash-2"></i></button>
      </div>
    `;

    const downloadBtn = card.querySelector('.btn-download-pdf');
    if (downloadBtn) downloadBtn.addEventListener('click', () => downloadSinglePdf(item.id));

    const removeBtn = card.querySelector('.btn-remove-pdf');
    if (removeBtn) removeBtn.addEventListener('click', () => {
      state.pdfFiles = state.pdfFiles.filter(f => f.id !== item.id);
      renderPdfQueue();
      updatePdfStats();
    });

    return card;
  }

  async function processAllPdfs() {
    if (state.pdfProcessing) return;
    const queuedItems = state.pdfFiles.filter(f => f.status !== 'processing');
    if (queuedItems.length === 0) return;

    state.pdfProcessing = true;
    pdfProcessAllBtn.disabled = true;
    pdfApplySettingsBtn.disabled = true;

    for (const item of queuedItems) {
      if (!state.pdfFiles.find(f => f.id === item.id)) continue;
      await processSinglePdf(item);
    }

    state.pdfProcessing = false;
    pdfProcessAllBtn.disabled = false;
    pdfApplySettingsBtn.disabled = false;
    updatePdfStats();
    showToast('PDF processing completed!', 'success');
  }

  async function reprocessAllPdfs() {
    state.pdfFiles.forEach(item => {
      item.status = 'queued';
      item.progress = 0;
      item.processedBlob = null;
    });
    renderPdfQueue();
    processAllPdfs();
  }

  async function processSinglePdf(item) {
    item.status = 'processing';
    item.progress = 10;
    updatePdfCardUI(item);

    try {
      const fileArrayBuffer = await item.originalFile.arrayBuffer();

      if (state.pdfMode === 'compress') {
        item.progress = 30;
        updatePdfCardUI(item);

        const processedBlob = await compressPdfFile(fileArrayBuffer, item);
        item.processedBlob = processedBlob;
        item.compSize = processedBlob.size;

      } else {
        item.progress = 40;
        updatePdfCardUI(item);

        const processedBlob = await resizePdfDimensions(fileArrayBuffer);
        item.processedBlob = processedBlob;
        item.compSize = processedBlob.size;
      }

      item.savedBytes = item.origSize - item.compSize;
      item.savedPercent = item.origSize > 0 ? (item.savedBytes / item.origSize) * 100 : 0;
      item.status = 'done';
      item.progress = 100;

    } catch (err) {
      console.error('PDF Processing Error:', err);
      item.status = 'error';

      const errStr = (err.name || '') + ' ' + (err.message || '');
      if (errStr.includes('Password') || errStr.includes('password') || errStr.includes('Encrypted') || errStr.includes('encrypted')) {
        item.errorMessage = '🔒 Password Protected (Unlock PDF first)';
        showToast(`"${item.originalFile.name}" is password-protected. Please remove password first.`, 'warning');
      } else {
        item.errorMessage = err.message || 'PDF processing failed';
      }
      item.progress = 0;
    }

    updatePdfCardUI(item);
    updatePdfStats();
  }

  // --- SMART PDF COMPRESSION ENGINE ---
  async function compressPdfFile(arrayBuffer, item) {
    if (!window.pdfjsLib || !window.PDFLib) {
      throw new Error('PDF Libraries not loaded.');
    }

    const targetVal = parseFloat(pdfTargetSizeInput.value) || 500;
    const targetUnit = pdfTargetSizeUnit.value;
    const targetBytes = (targetUnit === 'KB' ? targetVal * 1024 : targetVal * 1024 * 1024);

    // 1. First, attempt Native Vector PDF Optimization (stream compression) using PDF-Lib
    let nativeBlob = null;
    try {
      const nativePdfDoc = await PDFLib.PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      const nativeBytes = await nativePdfDoc.save({ useObjectStreams: true, addDefaultPage: false });
      nativeBlob = new Blob([nativeBytes], { type: 'application/pdf' });

      // If native stream compression reaches target or is tiny vector PDF, use it!
      if (nativeBlob.size <= targetBytes) {
        return nativeBlob;
      }
    } catch (e) {
      console.warn('Native PDF compression attempt note:', e);
    }

    // 2. Load PDF in pdf.js for Page-by-Page Canvas Rasterization
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    loadingTask.onPassword = () => {
      throw new Error('PasswordException: PDF is password protected');
    };

    let pdfDocObj;
    try {
      pdfDocObj = await loadingTask.promise;
    } catch (pdfErr) {
      if (pdfErr.name === 'PasswordException' || (pdfErr.message && pdfErr.message.includes('Password'))) {
        throw new Error('PasswordException: PDF is password protected');
      }
      throw pdfErr;
    }

    const numPages = pdfDocObj.numPages;
    const bytesPerPage = targetBytes / Math.max(1, numPages);

    // Calculate Adaptive Resolution Scale & Quality dynamically based on target limit!
    let scaleFactor = 1.0;
    let imageQuality = 0.6;

    if (bytesPerPage < 15000) {
      // Extremely low target (e.g. 5 KB - 15 KB total)
      scaleFactor = 0.45;
      imageQuality = 0.25;
    } else if (bytesPerPage < 50000) {
      // Small target (e.g. 20 KB - 50 KB total)
      scaleFactor = 0.65;
      imageQuality = 0.45;
    } else if (bytesPerPage < 150000) {
      // Medium target (100 KB - 200 KB)
      scaleFactor = 0.9;
      imageQuality = 0.65;
    } else {
      // High target
      scaleFactor = 1.2;
      imageQuality = 0.8;
    }

    // Adjust based on UI profile dropdown
    if (pdfQualityPreset.value === 'high') {
      scaleFactor *= 0.8;
      imageQuality *= 0.8;
    } else if (pdfQualityPreset.value === 'light') {
      scaleFactor *= 1.2;
      imageQuality = Math.min(0.9, imageQuality * 1.2);
    }

    const newPdfDoc = await PDFLib.PDFDocument.create();

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      item.progress = Math.min(90, Math.floor(30 + (pageNum / numPages) * 60));
      updatePdfCardUI(item);

      const page = await pdfDocObj.getPage(pageNum);
      const viewport = page.getViewport({ scale: scaleFactor });

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = Math.max(100, viewport.width);
      canvas.height = Math.max(100, viewport.height);

      // Fill white background for clean rendering
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      await page.render({ canvasContext: ctx, viewport: viewport }).promise;

      const jpegUrl = canvas.toDataURL('image/jpeg', imageQuality);
      const embeddedJpeg = await newPdfDoc.embedJpg(jpegUrl);
      const pdfPage = newPdfDoc.addPage([viewport.width, viewport.height]);
      pdfPage.drawImage(embeddedJpeg, {
        x: 0,
        y: 0,
        width: viewport.width,
        height: viewport.height,
      });
    }

    const pdfBytes = await newPdfDoc.save();
    const rasterBlob = new Blob([pdfBytes], { type: 'application/pdf' });

    // 3. Safety Check: Always select the SMALLEST output and NEVER inflate file size!
    const candidates = [];
    candidates.push({ blob: rasterBlob, size: rasterBlob.size, type: 'raster' });

    if (nativeBlob) {
      candidates.push({ blob: nativeBlob, size: nativeBlob.size, type: 'native' });
    }

    // Also include original if both candidates are larger than original!
    const origBlob = new Blob([arrayBuffer], { type: 'application/pdf' });
    candidates.push({ blob: origBlob, size: origBlob.size, type: 'original' });

    // Sort candidates by size
    candidates.sort((a, b) => a.size - b.size);

    // Pick smallest candidate that is closest to target
    const bestCandidate = candidates[0];
    return bestCandidate.blob;
  }

  // --- PDF RESIZE ENGINE ---
  async function resizePdfDimensions(arrayBuffer) {
    if (!window.PDFLib) throw new Error('PDF-Lib library not loaded');

    let pdfDoc;
    try {
      pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
    } catch (loadErr) {
      if (loadErr.message && (loadErr.message.includes('encrypt') || loadErr.message.includes('password'))) {
        throw new Error('PasswordException: PDF is password protected');
      }
      throw loadErr;
    }

    const pages = pdfDoc.getPages();
    const preset = pdfScalePreset.value;

    pages.forEach(page => {
      const { width, height } = page.getSize();

      if (preset === 'scale_150') {
        page.setSize(width * 1.5, height * 1.5);
        page.scale(1.5, 1.5);
      } else if (preset === 'scale_200') {
        page.setSize(width * 2.0, height * 2.0);
        page.scale(2.0, 2.0);
      } else if (preset === 'scale_75') {
        page.setSize(width * 0.75, height * 0.75);
        page.scale(0.75, 0.75);
      } else if (preset === 'scale_50') {
        page.setSize(width * 0.5, height * 0.5);
        page.scale(0.5, 0.5);
      } else if (preset === 'preset_a4') {
        page.setSize(595.28, 841.89);
      } else if (preset === 'preset_a3') {
        page.setSize(841.89, 1190.55);
      } else if (preset === 'preset_letter') {
        page.setSize(612, 792);
      } else if (preset === 'custom_scale') {
        const factor = (parseFloat(pdfCustomScaleVal.value) || 120) / 100;
        page.setSize(width * factor, height * factor);
        page.scale(factor, factor);
      }
    });

    const pdfBytes = await pdfDoc.save();
    return new Blob([pdfBytes], { type: 'application/pdf' });
  }

  function updatePdfCardUI(item) {
    const card = document.getElementById(`pdf-card-${item.id}`);
    if (!card) return;
    const newCard = createPdfCardElement(item);
    card.replaceWith(newCard);
    if (window.lucide) lucide.createIcons();
  }

  function updatePdfStats() {
    const totalCount = state.pdfFiles.length;
    const completed = state.pdfFiles.filter(f => f.status === 'done');

    pdfStatCount.textContent = totalCount;

    if (totalCount === 0) {
      pdfStatOrigSize.textContent = '0 KB';
      pdfStatCompSize.textContent = '0 KB';
      pdfStatSavedPercent.textContent = '0%';
      pdfStatSavedSize.textContent = '(0 KB)';
      pdfDownloadAllBtn.disabled = true;
      return;
    }

    const origSum = state.pdfFiles.reduce((acc, f) => acc + f.origSize, 0);
    const compSum = completed.reduce((acc, f) => acc + f.compSize, 0);
    const savedSum = origSum - compSum;
    const percentSum = origSum > 0 ? (savedSum / origSum) * 100 : 0;

    pdfStatOrigSize.textContent = formatBytes(origSum);
    pdfStatCompSize.textContent = formatBytes(compSum);
    pdfStatSavedPercent.textContent = `${percentSum.toFixed(1)}%`;
    pdfStatSavedSize.textContent = `(${formatBytes(Math.abs(savedSum))})`;

    pdfDownloadAllBtn.disabled = completed.length === 0;
  }

  function downloadSinglePdf(id) {
    const item = state.pdfFiles.find(f => f.id === id);
    if (!item || !item.processedBlob) return;

    const baseName = item.originalFile.name.replace(/\.pdf$/i, '');
    const suffix = state.pdfMode === 'compress' ? 'compressed' : 'resized';
    const filename = `${baseName}_${suffix}.pdf`;

    triggerDownload(item.processedBlob, filename);
  }

  async function downloadAllPdfsAsZip() {
    const completed = state.pdfFiles.filter(f => f.status === 'done' && f.processedBlob);
    if (completed.length === 0) return;

    showToast('Creating PDF ZIP archive...', 'info');
    const zip = new JSZip();
    const folder = zip.folder('processed_pdfs');

    completed.forEach((item, index) => {
      const baseName = item.originalFile.name.replace(/\.pdf$/i, '') || `document_${index + 1}`;
      const suffix = state.pdfMode === 'compress' ? 'compressed' : 'resized';
      folder.file(`${baseName}_${suffix}.pdf`, item.processedBlob);
    });

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    triggerDownload(zipBlob, 'OptiCompress_PDFs.zip');
    showToast('PDF ZIP downloaded successfully!', 'success');
  }

  // --- HELPER PDF UTILS ---

  async function getPdfPageCount(file) {
    try {
      if (!window.pdfjsLib) return '1 pg';
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      loadingTask.onPassword = () => {
        throw new Error('PasswordException');
      };
      const pdf = await loadingTask.promise;
      return pdf.numPages ? `${pdf.numPages} pgs` : '1 pg';
    } catch (e) {
      if (e.name === 'PasswordException' || (e.message && e.message.includes('Password'))) {
        return '🔒 Encrypted';
      }
      return '1 pg';
    }
  }

  function showProtocolWarning() {
    const container = document.querySelector('.app-container');
    if (!container || document.getElementById('protocol-warning-banner')) return;

    const banner = document.createElement('div');
    banner.id = 'protocol-warning-banner';
    banner.style.cssText = `
      background: rgba(245, 158, 11, 0.15);
      border: 1px solid rgba(245, 158, 11, 0.4);
      color: #fcd34d;
      padding: 10px 18px;
      border-radius: 12px;
      margin-bottom: 16px;
      font-size: 0.82rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
    `;
    banner.innerHTML = `
      <div style="display:flex; align-items:center; gap:8px;">
        <i data-lucide="alert-triangle" style="width:16px; height:16px;"></i>
        <span><strong></strong>This is a Free service no data is uploaded to server Made By Raj Soni</span>
      </div>
      <button onclick="this.parentElement.remove()" style="background:none; border:none; color:#fcd34d; cursor:pointer; font-size:16px;">✕</button>
    `;
    container.insertBefore(banner, container.firstChild);
    if (window.lucide) lucide.createIcons();
  }

  // --- PREVIEW MODAL ---

  function openImagePreviewModal(id) {
    const item = state.imageFiles.find(f => f.id === id);
    if (!item || !item.compressedBlob) return;

    modalTitle.textContent = item.originalFile.name;
    modalImgOrig.src = URL.createObjectURL(item.originalFile);
    modalImgComp.src = URL.createObjectURL(item.compressedBlob);

    modalOrigSize.textContent = formatBytes(item.origSize);
    modalCompSize.textContent = formatBytes(item.compSize);
    modalSavedBadge.textContent = `${item.savedPercent.toFixed(1)}% Smaller`;

    modalOrigDim.textContent = item.origDimensions ? `${item.origDimensions.width} x ${item.origDimensions.height} px` : 'Auto';
    modalCompDim.textContent = item.compDimensions ? `${item.compDimensions.width} x ${item.compDimensions.height} px` : 'Auto';

    modalDownloadBtn.onclick = () => downloadSingleImage(id);
    previewModal.classList.remove('hidden');
  }

  function closeModal() {
    previewModal.classList.add('hidden');
  }

  // --- GENERAL UTILS ---

  function triggerDownload(blob, filename) {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Downloaded ${filename}`, 'info');
  }

  function generateId() {
    return Math.random().toString(36).substring(2, 9);
  }

  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  function getExtensionFromBlob(blob, originalName) {
    const type = blob.type;
    if (type === 'image/jpeg') return 'jpg';
    if (type === 'image/png') return 'png';
    if (type === 'image/webp') return 'webp';
    if (type === 'image/gif') return 'gif';
    if (type === 'image/bmp') return 'bmp';

    const parts = originalName.split('.');
    return parts.length > 1 ? parts.pop() : 'jpg';
  }

  function getImageDimensions(fileOrBlob) {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(fileOrBlob);
      img.onload = () => {
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
        URL.revokeObjectURL(url);
      };
      img.onerror = () => {
        resolve(null);
        URL.revokeObjectURL(url);
      };
      img.src = url;
    });
  }

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, function (m) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
      }[m];
    });
  }

  function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let icon = 'info';
    if (type === 'success') icon = 'check-circle-2';
    if (type === 'warning') icon = 'alert-triangle';

    toast.innerHTML = `<i data-lucide="${icon}"></i> <span>${escapeHtml(message)}</span>`;
    container.appendChild(toast);

    if (window.lucide) lucide.createIcons();

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
});
