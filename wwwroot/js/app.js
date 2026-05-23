// ============ FORMAT CONVERSION MAPPING ============
const conversionMap = {
    pdf: ['jpg', 'png', 'docx', 'txt'],
    docx: ['pdf', 'txt', 'html'],
    doc: ['pdf', 'docx', 'txt'],
    txt: ['pdf', 'docx'],
    xlsx: ['pdf', 'csv', 'txt'],
    pptx: ['pdf', 'jpg'],
    jpg: ['png', 'webp', 'pdf', 'gif'],
    png: ['jpg', 'webp', 'pdf', 'gif'],
    gif: ['jpg', 'png', 'webp'],
    bmp: ['jpg', 'png', 'webp'],
    webp: ['jpg', 'png', 'gif'],
    svg: ['png', 'jpg', 'webp'],
    zip: ['rar', '7z'],
    rar: ['zip', '7z'],
    '7z': ['zip', 'rar']
};

// ============ STATE MANAGEMENT ============
let selectedFile = null;
let convertedFile = null;
let sourceFormat = '';
let targetFormat = '';

// ============ DOM ELEMENTS ============
const uploadZone = document.getElementById('uploadZone');
const fileInput = document.getElementById('fileInput');
const sourceFormatSelect = document.getElementById('sourceFormat');
const targetFormatSelect = document.getElementById('targetFormat');
const qualitySlider = document.getElementById('quality');
const qualityValue = document.getElementById('qualityValue');
const fileInfo = document.getElementById('fileInfo');
const convertBtn = document.getElementById('convertBtn');
const resultSection = document.getElementById('resultSection');
const conversionProgress = document.getElementById('conversionProgress');

// ============ INITIALIZATION ============
document.addEventListener('DOMContentLoaded', () => {
    setupDragAndDrop();
    setupEventListeners();
    populateTargetFormats();
});

// ============ DRAG AND DROP ============
function setupDragAndDrop() {
    uploadZone.addEventListener('click', () => fileInput.click());

    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.classList.add('drag-over');
    });

    uploadZone.addEventListener('dragleave', () => {
        uploadZone.classList.remove('drag-over');
    });

    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.classList.remove('drag-over');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileSelection(files[0]);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFileSelection(e.target.files[0]);
        }
    });
}

// ============ FILE SELECTION ============
function handleFileSelection(file) {
    selectedFile = file;
    const fileExtension = file.name.split('.').pop().toLowerCase();

    // Display file info
    fileInfo.style.display = 'block';
    resultSection.style.display = 'none';
    uploadZone.style.display = 'none';

    document.getElementById('fileName').textContent = file.name;
    document.getElementById('fileSize').textContent = `${(file.size / 1024).toFixed(2)} KB`;

    // Set file icon based on type
    setFileIcon(fileExtension, 'fileIcon');

    // Auto-select source format
    if (conversionMap[fileExtension]) {
        sourceFormatSelect.value = fileExtension;
        sourceFormat = fileExtension;
        populateTargetFormats();
    }
}

function setFileIcon(extension, elementId) {
    const icons = {
        pdf: '📄',
        docx: '📝',
        doc: '📝',
        txt: '📋',
        xlsx: '📊',
        pptx: '📈',
        jpg: '🖼️',
        jpeg: '🖼️',
        png: '🖼️',
        gif: '🖼️',
        webp: '🖼️',
        svg: '🖼️',
        bmp: '🖼️',
        zip: '📦',
        rar: '📦',
        '7z': '📦'
    };
    document.getElementById(elementId).textContent = icons[extension] || '📄';
}

function removeFile() {
    selectedFile = null;
    sourceFormat = '';
    targetFormat = '';
    fileInput.value = '';
    sourceFormatSelect.value = '';
    targetFormatSelect.value = '';

    uploadZone.style.display = 'block';
    fileInfo.style.display = 'none';
    resultSection.style.display = 'none';
    conversionProgress.style.display = 'none';
    convertBtn.disabled = false;
    convertBtn.textContent = 'Convert File';
}

// ============ FORMAT SELECTION ============
function setupEventListeners() {
    sourceFormatSelect.addEventListener('change', (e) => {
        sourceFormat = e.target.value;
        populateTargetFormats();
    });

    targetFormatSelect.addEventListener('change', (e) => {
        targetFormat = e.target.value;
    });

    qualitySlider.addEventListener('input', (e) => {
        qualityValue.textContent = e.target.value + '%';
    });
}

function populateTargetFormats() {
    const targetOptions = conversionMap[sourceFormat] || [];
    targetFormatSelect.innerHTML = '<option value="">Select target format...</option>';

    targetOptions.forEach(format => {
        const option = document.createElement('option');
        option.value = format;
        option.textContent = format.toUpperCase();
        targetFormatSelect.appendChild(option);
    });

    targetFormat = '';
}

// ============ FILE CONVERSION ============
async function convertFile() {
    if (!selectedFile) {
        showNotification('Please select a file', 'error');
        return;
    }

    if (!sourceFormat) {
        showNotification('Please select a source format', 'error');
        return;
    }

    if (!targetFormat) {
        showNotification('Please select a target format', 'error');
        return;
    }

    // Show progress
    conversionProgress.style.display = 'block';
    convertBtn.disabled = true;
    convertBtn.innerHTML = 'Converting...';

    try {
        // Simulate conversion with progress
        const duration = Math.random() * 2000 + 1000; // 1-3 seconds
        const startTime = Date.now();

        const progressInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min((elapsed / duration) * 100, 95);
            updateProgress(progress);

            if (progress >= 95) {
                clearInterval(progressInterval);
            }
        }, 100);

        // Make conversion request to backend
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('sourceFormat', sourceFormat);
        formData.append('targetFormat', targetFormat);
        formData.append('quality', qualitySlider.value);

        const response = await fetch('/api/convert', {
            method: 'POST',
            body: formData
        });

        clearInterval(progressInterval);

        if (response.ok) {
            updateProgress(100);
            const blob = await response.blob();
            convertedFile = {
                blob: blob,
                name: `${selectedFile.name.split('.')[0]}.${targetFormat}`,
                size: blob.size
            };

            // Wait a moment then show result
            setTimeout(() => {
                showResult();
                conversionProgress.style.display = 'none';
                convertBtn.disabled = false;
                convertBtn.innerHTML = '<span>Convert File</span><span class="btn-arrow">→</span>';
            }, 500);
        } else {
            const error = await response.text();
            showNotification(`Conversion failed: ${error}`, 'error');
            conversionProgress.style.display = 'none';
            convertBtn.disabled = false;
            convertBtn.innerHTML = '<span>Convert File</span><span class="btn-arrow">→</span>';
        }
    } catch (error) {
        console.error('Conversion error:', error);
        showNotification('An error occurred during conversion', 'error');
        conversionProgress.style.display = 'none';
        convertBtn.disabled = false;
        convertBtn.innerHTML = '<span>Convert File</span><span class="btn-arrow">→</span>';
    }
}

function updateProgress(progress) {
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    progressFill.style.width = progress + '%';
    progressText.textContent = Math.round(progress) + '%';
}

function showResult() {
    fileInfo.style.display = 'none';
    resultSection.style.display = 'block';

    // Update result file info
    document.getElementById('resultFileName').textContent = convertedFile.name;
    document.getElementById('resultFileSize').textContent = `${(convertedFile.blob.size / 1024).toFixed(2)} KB`;

    setFileIcon(targetFormat, 'resultFileIcon');

    // Show preview if it's an image
    showPreview();
}

function showPreview() {
    const resultPreview = document.getElementById('resultPreview');
    resultPreview.innerHTML = '';

    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(targetFormat)) {
        const url = URL.createObjectURL(convertedFile.blob);
        const img = document.createElement('img');
        img.src = url;
        img.onload = () => URL.revokeObjectURL(url);
        resultPreview.appendChild(img);
    } else if (targetFormat === 'pdf') {
        resultPreview.innerHTML = '<p>📄 PDF Preview - Download to view</p>';
    } else {
        resultPreview.innerHTML = `<p>✓ ${targetFormat.toUpperCase()} file ready</p>`;
    }
}

function downloadFile() {
    if (!convertedFile) return;

    const url = URL.createObjectURL(convertedFile.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = convertedFile.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showNotification('File downloaded successfully!', 'success');
}

function convertAnother() {
    removeFile();
    fileInput.click();
}

// ============ NOTIFICATIONS ============
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 10px;
        color: white;
        font-weight: 600;
        z-index: 9999;
        animation: slideInRight 0.3s ease-out;
        backdrop-filter: blur(10px);
    `;

    const colors = {
        success: '#10b981',
        error: '#ef4444',
        info: '#6366f1'
    };

    notification.style.background = colors[type] || colors.info;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ============ SMOOTH SCROLL ============
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============ ANIMATION OBSERVER ============
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.feature-card, .format-badge').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    observer.observe(el);
});

// ============ MOBILE OPTIMIZATION ============
// Detect if device is mobile
const isMobile = () => /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Remove hover-based animations on mobile
if (isMobile()) {
    document.body.style.pointerEvents = 'auto';
    // Reduce animation on mobile for better performance
    document.querySelectorAll('[style*="animation"]').forEach(el => {
        el.style.animationDuration = '1.5s';
    });
}

// Optimize touch events for mobile
document.addEventListener('touchstart', function() {
    // Allows :active pseudo-class to work on mobile
}, false);

// Prevent zoom on double-tap (for better UX)
let lastTouchEnd = 0;
document.addEventListener('touchend', function(event) {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// Handle viewport changes for responsive layout
window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        window.scrollTo(0, 0);
    }, 100);
});

// Improve button touch targets on mobile
if (isMobile()) {
    document.querySelectorAll('button, input[type="range"], select').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.height < 44 || rect.width < 44) {
            el.style.padding = '12px 16px';
            el.style.minHeight = '44px';
            el.style.minWidth = '44px';
        }
    });
}

// Optimize file drop zone for mobile touch
uploadZone.addEventListener('touchstart', () => {
    uploadZone.style.backgroundColor = 'rgba(99, 102, 241, 0.15)';
}, { passive: true });

uploadZone.addEventListener('touchend', () => {
    uploadZone.style.backgroundColor = '';
    fileInput.click();
}, { passive: true });

// Prevent input zoom on focus (iOS)
document.addEventListener('focusin', function(e) {
    if (e.target.type === 'select-one' || e.target.type === 'text' || e.target.type === 'range') {
        document.body.style.fontSize = '16px';
    }
});

document.addEventListener('focusout', function() {
    document.body.style.fontSize = '';
});

// Performance optimization: Lazy load animations
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reduceMotion) {
    document.querySelectorAll('*').forEach(el => {
        el.style.animationDuration = '0.01ms !important';
        el.style.animationIterationCount = '1 !important';
        el.style.transitionDuration = '0.01ms !important';
    });
}

// Optimize scrolling performance
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            ticking = false;
        });
        ticking = true;
    }
}, { passive: true });

// Add safe-area-inset support for notched devices
if (CSS.supports('padding-left', 'max(0px)')) {
    document.querySelector('body').style.paddingLeft = 'max(0px, env(safe-area-inset-left))';
    document.querySelector('body').style.paddingRight = 'max(0px, env(safe-area-inset-right))';
}
