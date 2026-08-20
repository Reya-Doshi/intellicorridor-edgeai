# 🚀 IntelliCorridor EdgeAI Kit | Predictive Traffic Decision Intelligence

An end-to-end EdgeAI traffic decision intelligence system combining **YOLO multi-vehicle vision detection**, dynamic **scipy signal peak analysis**, and a **25-generation Genetic Algorithm (GA)** for Webster delay-minimized corridor signal allocation.

---

## 🛠️ Prerequisites & Installation

### 1. Prerequisites
- **Node.js (v18+)**: [https://nodejs.org/](https://nodejs.org/)
- **Python (3.9–3.12)**: [https://www.python.org/](https://www.python.org/)
- **Git**: [https://git-scm.com/](https://git-scm.com/)

---

### 2. Quick Setup

#### Clone & Install Dependencies
```bash
git clone https://github.com/Reya-Doshi/intellicorridor-edgeai.git
cd intellicorridor-edgeai

# Install React Dashboard Dependencies
npm install

# Install Python Vision & GA Dependencies
pip install -r backend/requirements.txt
```

---

## ▶️ Running the Project (2 Commands)

Open **2 separate terminal windows**:

### Terminal 1: Start Python Backend Server
```bash
python backend/app.py
```
*(Starts Flask API server on `http://127.0.0.1:5000`)*

### Terminal 2: Start Web Control Room Dashboard
```bash
npm run dev
```
*(Starts Vite dev server on `http://localhost:5173/`)*

👉 Open **`http://localhost:5173/`** in your browser to view the interactive Control Room Dashboard!

---

## 🎥 Running Standalone Video Scanning (Optional)

To launch the standalone OpenCV pop-up scanning window on any 4 traffic `.mp4` videos:

### Default Feeds:
```bash
python backend/scan_gui.py
```

### Custom Downloaded Videos:
```bash
python backend/scan_gui.py "path/to/video1.mp4" "path/to/video2.mp4" "path/to/video3.mp4" "path/to/video4.mp4"
```
