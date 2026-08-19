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
    if len(files) != 4:
        return jsonify({'error': 'Please upload exactly 4 videos'}), 400

    base_dir = os.path.dirname(os.path.abspath(__file__))
    uploads_dir = os.path.join(base_dir, 'uploads')
    os.makedirs(uploads_dir, exist_ok=True)

    video_paths = []
    for i, file in enumerate(files):
        video_path = os.path.join(uploads_dir, f'video_{i}.mp4')
        file.save(video_path)
        video_paths.append(video_path)

    # Process all 4 approach videos simultaneously across CPU threads
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as executor:
        num_cars_list = list(executor.map(detect_cars, video_paths))

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
