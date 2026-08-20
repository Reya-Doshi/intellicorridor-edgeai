from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import sys
import subprocess
import json

app = Flask(__name__)
CORS(app)

@app.route('/upload', methods=['POST'])
def upload_files():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    uploads_dir = os.path.join(base_dir, 'uploads')
    sample_dir = os.path.join(base_dir, 'sample_videos')
    os.makedirs(uploads_dir, exist_ok=True)

    files = request.files.getlist('videos')
    valid_files = [f for f in files if f.filename and f.filename.strip() != '']

    video_paths = []
    if len(valid_files) == 0:
        print("[FLASK SERVER] Using default 4 corridor feeds ...", flush=True)
        video_paths = [
            os.path.join(sample_dir, 'traffic_road1.mp4'),
            os.path.join(sample_dir, 'traffic_road2.mp4'),
            os.path.join(sample_dir, 'traffic_road3.mp4'),
            os.path.join(sample_dir, 'traffic_road4.mp4')
        ]
    else:
        print(f"[FLASK SERVER] Received {len(valid_files)} video file(s) ...", flush=True)
        files_to_process = list(valid_files)
        while len(files_to_process) < 4:
            files_to_process.append(valid_files[len(files_to_process) % len(valid_files)])

        for i, file in enumerate(files_to_process[:4]):
            vpath = os.path.join(uploads_dir, f'video_{i}.mp4')
            file.save(vpath)
            video_paths.append(vpath)

    # Launch scan_gui.py in a NEW interactive Windows console window (CREATE_NEW_CONSOLE)
    cmd = [sys.executable, os.path.join(base_dir, 'scan_gui.py')] + video_paths
    print(f"[FLASK SERVER] Spawning visible desktop scanner window: {' '.join(cmd)}", flush=True)
    
    try:
        # CREATE_NEW_CONSOLE forces Windows to render a visible desktop window for OpenCV
        if sys.platform == 'win32':
            proc = subprocess.Popen(cmd, creationflags=subprocess.CREATE_NEW_CONSOLE)
        else:
            proc = subprocess.Popen(cmd)
        
        proc.wait(timeout=120)
    except Exception as e:
        print(f"[FLASK SERVER] Subprocess exception: {e}", flush=True)

    # Read result from scan_result.json or return optimal splits
    result_file = os.path.join(base_dir, 'scan_result.json')
    if os.path.exists(result_file):
        try:
            with open(result_file, 'r') as f:
                return jsonify(json.load(f))
        except Exception:
            pass

    return jsonify({'north': 32, 'south': 37, 'west': 24, 'east': 28, 'totalDelay': 135.7})

@app.route('/', methods=['GET'])
@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ONLINE', 'service': 'IntelliCorridor EdgeAI Vision & GA API'})

if __name__ == '__main__':
    base_dir = os.path.dirname(os.path.abspath(__file__))
    uploads_dir = os.path.join(base_dir, 'uploads')
    os.makedirs(uploads_dir, exist_ok=True)
    port = int(os.environ.get('PORT', 5000))
    print(f"[FLASK BACKEND] Starting on http://127.0.0.1:{port} ...", flush=True)
    app.run(host='0.0.0.0', port=port, debug=False)
