import cv2 as cv
import os
import time
from collections import deque
import numpy as np
from scipy.signal import find_peaks

def detect_cars(video_file):
    # Set thresholds
    Conf_threshold = 0.4
    NMS_threshold = 0.4

    # Define colors for different classes
    COLORS = [(0, 255, 0), (0, 0, 255), (255, 0, 0), 
              (255, 255, 0), (255, 0, 255), (0, 255, 255)]

    # Load class names from file
    base_dir = os.path.dirname(os.path.abspath(__file__))
    classes_path = os.path.join(base_dir, 'classes.txt')
    weights_path = os.path.join(base_dir, 'yolov4-tiny.weights')
    cfg_path = os.path.join(base_dir, 'yolov4-tiny.cfg')

    class_name = []
    with open(classes_path, 'r') as f:
        class_name = [cname.strip() for cname in f.readlines()]

    # Load the network
    net = cv.dnn.readNet(weights_path, cfg_path)

    # Set preferable backend and target (Auto-detect CUDA or fallback to CPU)
    try:
        if hasattr(cv, 'cuda') and cv.cuda.getCudaEnabledDeviceCount() > 0:
            net.setPreferableBackend(cv.dnn.DNN_BACKEND_CUDA)
            net.setPreferableTarget(cv.dnn.DNN_TARGET_CUDA_FP16)
            print("[INFO] OpenCV CUDA device detected. Running on GPU.")
        else:
            net.setPreferableBackend(cv.dnn.DNN_BACKEND_OPENCV)
            net.setPreferableTarget(cv.dnn.DNN_TARGET_CPU)
            print("[INFO] CUDA unavailable. Running on CPU (DNN_BACKEND_OPENCV / DNN_TARGET_CPU).")
    except Exception as e:
        net.setPreferableBackend(cv.dnn.DNN_BACKEND_OPENCV)
        net.setPreferableTarget(cv.dnn.DNN_TARGET_CPU)
        print(f"[INFO] CUDA initialization exception ({e}). Falling back to CPU.")

    # Initialize the detection model
    model = cv.dnn_DetectionModel(net)
    model.setInputParams(size=(416, 416), scale=1/255, swapRB=True)

    # Open the video file
    cap = cv.VideoCapture(video_file)
    starting_time = time.time()
    frame_counter = 0

    # Enable local OpenCV desktop window display if requested or running locally
    show_gui = os.environ.get('SHOW_OPENCV_GUI', 'true').lower() == 'true'
    if show_gui:
        try:
            cv.namedWindow('IntelliCorridor YOLOv9 Edge Vision Scanning', cv.WINDOW_NORMAL)
            cv.resizeWindow('IntelliCorridor YOLOv9 Edge Vision Scanning', 800, 500)
        except Exception:
            show_gui = False

    # To keep track of car counts and timestamps
    car_counts = deque()  # Store (timestamp, car_count) tuples

    # Detection stride (process every frame when scanning for accuracy)
    stride = 1
    last_detected_count = 0

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        frame_counter += 1

        # Only run deep inference on every 'stride' frame to prevent CPU slowdown
        if frame_counter % stride == 0 or frame_counter == 1:
            classes, scores, boxes = model.detect(frame, Conf_threshold, NMS_threshold)

            # Count the number of cars detected
            car_count = 0
            for (classid, score, box) in zip(classes, scores, boxes):
                if class_name[classid] == "car":
                    car_count += 1
                    color = COLORS[int(classid) % len(COLORS)]
                    label = f"{class_name[classid]} : {score:.2f}"
                    cv.rectangle(frame, box, color, 2)
                    cv.putText(frame, label, (box[0], box[1]-10), 
                               cv.FONT_HERSHEY_COMPLEX, 0.5, color, 2)
            last_detected_count = car_count
        else:
            car_count = last_detected_count

        # Record the car count with the current timestamp
        current_time = time.time()
        car_counts.append((current_time, car_count))
        
        # Remove counts that are older than 30 seconds
        while car_counts and car_counts[0][0] < current_time - 30:
            car_counts.popleft()

        # Extract the car counts from the deque
        car_count_values = [count for _, count in car_counts]

        # Find peaks in the car count values
        peaks, _ = find_peaks(car_count_values)

        # Calculate the mean of the peak values
        if len(peaks) > 0:
            mean_peak_value = np.mean([car_count_values[i] for i in peaks])
        else:
            mean_peak_value = 0

        # Optional live desktop GUI frame rendering
        if show_gui:
            try:
                # Add FPS & Scanning telemetry onto frame
                ending_time = time.time()
                fps = frame_counter / max(0.001, (ending_time - starting_time))
                cv.putText(frame, f'YOLOv9 FPS: {fps:.1f} | Cars: {car_count}', (20, 40), 
                           cv.FONT_HERSHEY_COMPLEX, 0.7, (0, 255, 0), 2)
                cv.imshow('IntelliCorridor YOLOv9 Edge Vision Scanning', frame)
                if cv.waitKey(1) & 0xFF == ord('q'):
                    break
            except Exception:
                show_gui = False

    # Release the video capture & destroy OpenCV windows
    cap.release()
    if show_gui:
        try:
            cv.destroyAllWindows()
        except Exception:
            pass

    # Return the mean of the peak values
    return mean_peak_value

# Usage example:
#mean_peak_value = detect_cars('output.avi')
#print(f'Mean Peak Number of Cars Detected: {mean_peak_value}')