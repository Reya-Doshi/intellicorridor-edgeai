import sys
import os
import json

base_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(base_dir)

from yolov4 import detect_cars
from algo import optimize_traffic

if __name__ == '__main__':
    video_paths = sys.argv[1:]
    if not video_paths:
        sample_dir = os.path.join(base_dir, 'sample_videos')
        video_paths = [
            os.path.join(sample_dir, 'traffic_road1.mp4'),
            os.path.join(sample_dir, 'traffic_road2.mp4'),
            os.path.join(sample_dir, 'traffic_road3.mp4'),
            os.path.join(sample_dir, 'traffic_road4.mp4')
        ]

    num_cars_list = []
    for path in video_paths:
        try:
            print(f"[SCANNER PROCESS] Scanning {path} ...", flush=True)
            count = detect_cars(path)
            num_cars_list.append(float(count))
        except Exception as e:
            print(f"[SCANNER ERROR] {e}", flush=True)
            num_cars_list.append(18.5)

    result = optimize_traffic(num_cars_list)
    result_file = os.path.join(base_dir, 'scan_result.json')
    try:
        with open(result_file, 'w') as f:
            json.dump(result, f)
    except Exception as e:
        print(f"[SCANNER ERROR] Writing result file error: {e}", flush=True)

    print("RESULT_JSON:" + json.dumps(result), flush=True)
