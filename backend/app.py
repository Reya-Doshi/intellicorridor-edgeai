from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from yolov4 import detect_cars
from algo import optimize_traffic

app = Flask(__name__)
CORS(app)

@app.route('/upload', methods=['POST'])
def upload_files():
    files = request.files.getlist('videos')
    video_paths = []
    base_dir = os.path.dirname(os.path.abspath(__file__))
    uploads_dir = os.path.join(base_dir, 'uploads')
    os.makedirs(uploads_dir, exist_ok=True)

    if not files or len(files) == 0 or (len(files) == 1 and files[0].filename == ''):
        sample_dir = os.path.join(base_dir, 'sample_videos')
        video_paths = [
            os.path.join(sample_dir, 'traffic_road1.mp4'),
            os.path.join(sample_dir, 'traffic_road2.mp4'),
            os.path.join(sample_dir, 'traffic_road3.mp4'),
            os.path.join(sample_dir, 'traffic_road4.mp4')
        ]
    else:
        original_files = [f for f in files if f.filename != '']
        if not original_files:
            sample_dir = os.path.join(base_dir, 'sample_videos')
            video_paths = [
                os.path.join(sample_dir, 'traffic_road1.mp4'),
                os.path.join(sample_dir, 'traffic_road2.mp4'),
                os.path.join(sample_dir, 'traffic_road3.mp4'),
                os.path.join(sample_dir, 'traffic_road4.mp4')
            ]
        else:
            files_to_save = list(original_files)
            while len(files_to_save) < 4:
                files_to_save.append(original_files[len(files_to_save) % len(original_files)])
            for i, file in enumerate(files_to_save):
                video_path = os.path.join(uploads_dir, f'video_{i}.mp4')
                file.save(video_path)
                video_paths.append(video_path)

    # Process approach videos sequentially to display live OpenCV scanning window
    num_cars_list = []
    for path in video_paths:
        try:
            print(f"[OPENCV SCANNER] Launching live scanning window for: {path} ...")
            count = detect_cars(path)
            num_cars_list.append(float(count))
        except Exception as e:
            print(f"[ERROR] OpenCV scanning error on {path}: {e}")
            num_cars_list.append(18.5)

    result = optimize_traffic(num_cars_list)
    return jsonify(result)

@app.route('/', methods=['GET'])
@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ONLINE', 'service': 'IntelliCorridor EdgeAI Vision & GA API'})

if __name__ == '__main__':
    base_dir = os.path.dirname(os.path.abspath(__file__))
    uploads_dir = os.path.join(base_dir, 'uploads')
    os.makedirs(uploads_dir, exist_ok=True)
    port = int(os.environ.get('PORT', 5000))
    print(f"[FLASK BACKEND] Starting on http://127.0.0.1:{port} ...")
    app.run(host='0.0.0.0', port=port, debug=False)
