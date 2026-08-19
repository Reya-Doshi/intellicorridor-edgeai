import os
import sys

# Ensure backend directory is in python path
base_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, base_dir)

from yolov4 import detect_cars
from algo import optimize_traffic

def test_single_video():
    print("\n=======================================================")
    print("STEP 4 & 5: TESTING SINGLE VIDEO YOLOv4 DETECTION")
    print("=======================================================")
    video_path = os.path.join(base_dir, 'sample_videos', 'traffic_road1.mp4')
    print(f"Testing video: {video_path}")
    count = detect_cars(video_path)
    print(f"[RESULT] Detected peak vehicle count for Road 1: {count:.2f}")
    return count

def test_four_videos_and_ga():
    print("\n=======================================================")
    print("STEP 6, 7 & 8: TESTING 4-VIDEO UPLOAD & GENETIC ALGORITHM")
    print("=======================================================")
    sample_videos = [
        os.path.join(base_dir, 'sample_videos', f'traffic_road{i}.mp4')
        for i in range(1, 5)
    ]

    car_counts = []
    for idx, v_path in enumerate(sample_videos):
        print(f"\nProcessing Video {idx + 1}/4: {os.path.basename(v_path)}...")
        cnt = detect_cars(v_path)
        car_counts.append(cnt)
        print(f"-> Road {idx + 1} Peak Cars Detected: {cnt:.2f}")

    print("\n--- PASSED COUNTS TO GENETIC ALGORITHM OPTIMIZER ---")
    print(f"Car Counts Array: {car_counts}")
    
    result = optimize_traffic(car_counts)
    print("\n[GENETIC ALGORITHM OPTIMIZATION COMPLETED SUCCESSFULLY]")
    print(f"Optimized Signal Timings: {result}")
    return result

if __name__ == '__main__':
    test_single_video()
    test_four_videos_and_ga()
