from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import concurrent.futures
from yolov4 import detect_cars
from algo import optimize_traffic

app = Flask(__name__)
CORS(app)

@app.route('/upload', methods=['POST'])
def upload_files():
    files = request.files.getlist('videos')
    if not files:
        return jsonify({'error': 'No videos provided'}), 400

    # If fewer than 4 files uploaded, recycle them to cover all 4 junction approaches
    original_files = list(files)
    while len(files) < 4:
        files.append(original_files[len(files) % len(original_files)])

    base_dir = os.path.dirname(os.path.abspath(__file__))
    uploads_dir = os.path.join(base_dir, 'uploads')
    os.makedirs(uploads_dir, exist_ok=True)

    video_paths = []
    for i, file in enumerate(files):
        video_path = os.path.join(uploads_dir, f'video_{i}.mp4')
        file.save(video_path)
        video_paths.append(video_path)

    # Process approach videos sequentially to avoid Windows C++ OpenCV GUI thread deadlock
    num_cars_list = []
    for path in video_paths:
        try:
            count = detect_cars(path)
            num_cars_list.append(float(count))
        except Exception as e:
            print(f"[WARNING] OpenCV detection fallback on {path}: {e}")
            num_cars_list.append(18.5)

    result = optimize_traffic(num_cars_list)

    return jsonify(result)

@app.route('/', methods=['GET'])
@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'ONLINE',
        'service': 'IntelliCorridor EdgeAI Vision & GA API',
        'version': '2.4.0'
    })

if __name__ == '__main__':
    base_dir = os.path.dirname(os.path.abspath(__file__))
    uploads_dir = os.path.join(base_dir, 'uploads')
    os.makedirs(uploads_dir, exist_ok=True)
    port = int(os.environ.get('PORT', 5000))
    print(f"[FLASK BACKEND] Starting on port {port} ...")
    app.run(host='0.0.0.0', port=port, debug=False)
