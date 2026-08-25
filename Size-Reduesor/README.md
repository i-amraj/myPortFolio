# ⚡ OptiCompress PRO - Batch Image & PDF Reducer & Page Resizer

> **100% Free & Private Client-Side Web Application**  
> *No data is uploaded to any server — all processing happens directly inside your browser!*  
> **Made by Raj Soni**

---

## 📸 Screenshots & UI Preview

### 🖼️ Image Compression & Format Converter Tool
![OptiCompress Image Tool](./ss/Screenshot%20from%202026-08-01%2013-19-44.png)

### 📄 PDF Size Reducer & Page Resizer Tool
![OptiCompress PDF Tool](./ss/Screenshot%20from%202026-08-01%2013-19-38.png)

---

## 🔥 Key Features

### 🖼️ Image Reducer Tool
* **Target File Size Mode**: Set an exact size limit in **KB** or **MB** (e.g., 200 KB for online forms, passport photos, or email attachments).
* **Quality Slider Mode**: Precision slider control from **5% to 100%** quality.
* **Dimension Resizing**: Downscale or upscale image dimensions with popular presets (4K UHD, Full HD 1080p, HD 720p, Web 800px) or set custom width & height.
* **Format Conversion**: Convert images seamlessly between **JPEG, PNG, WebP, BMP, and GIF**.
* **Visual Comparison Modal**: Side-by-side zoomable image comparison (Original vs. Compressed) showing live KB savings and dimension changes.
* **Multi-Threaded**: Uses Web Workers for background image processing without freezing the UI.

### 📄 PDF Size Reducer & Page Resizer Tool
* **Reduce PDF Size (Compress)**: Reduce heavy PDF files or scanned documents down to specific target KB/MB limits.
* **Smart Compression Engine**: Intelligently handles text/vector PDFs and scanned documents, using dynamic canvas scale/quality adjustments while preventing file size inflation.
* **Increase / Resize Page Dimensions**: Rescale PDF page sizes (+50%, 2x Larger, 75%, 50%) or convert pages to standard paper presets (**A4, A3, US Letter**).
* **Encrypted PDF Handling**: Gracefully detects password-protected or encrypted PDFs without crashing.
* **Page Count Indicator**: Displays page counts for every queued PDF document.

### 📦 Batch Queue & Archiving
* **Batch Processing**: Drag & drop multiple images or PDFs to process them concurrently.
* **ZIP Archive Download**: Export all processed files with a single click using **Download All (.ZIP)**.
* **Real-time Statistics**: Live summary tracking original total size, processed total size, percentage saved, and total saved space.

---

## 🛠️ Technology Stack

* **Frontend**: HTML5, Vanilla CSS3 (Dark Glassmorphism Design System), JavaScript (ES6+)
* **Image Engine**: `browser-image-compression` (Web Worker multi-threading)
* **PDF Engine**: `pdf-lib` (PDF creation & dimension scaling) + `pdf.js` (Canvas page rendering)
* **Archive Engine**: `JSZip` (Client-side ZIP creation)
* **UI Icons**: `lucide-icons`

---

## 🚀 Quick Start / How to Run Locally

Since OptiCompress PRO is completely client-side, running it locally is super easy!

### Method 1: Using Python HTTP Server (Recommended)
1. Open terminal in the project directory:
   ```bash
   cd "/home/ubuntu_16gb/Documents/peanuts/chocolate /image_size_reduesor"
   ```
2. Start local server:
   ```bash
   python3 -m http.server 8085
   ```
3. Open your browser and navigate to:
   ```text
   http://localhost:8085
   ```

### Method 2: Using Node.js `http-server` or `npx`
```bash
npx http-server -p 8085
```

---

## 🔒 Privacy & Security

OptiCompress PRO processes **100% of your data locally in your web browser**. 
* No files are ever sent to an external server.
* Works completely offline once loaded.
* Ideal for confidential invoices, official certificates, and sensitive documents.

---

## 🧑‍💻 Author & Credits

Designed & Developed by **Raj Soni**  
*Free & Open Source Client-Side Web Tool*
