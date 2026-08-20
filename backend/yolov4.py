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

    # Create a named desktop window for vehicle scanning
    show_gui = True
    window_title = 'IntelliCorridor YOLOv9 Edge Vision Scanning'
    try:
        cv.namedWindow(window_title, cv.WINDOW_NORMAL)
        cv.resizeWindow(window_title, 960, 540)
    except Exception as e:
        print(f"[NOTICE] Window creation notice: {e}")

    # To keep track of car counts and timestamps
    car_counts = deque()  # Store (timestamp, car_count) tuples

    # Detection stride (process every 2nd frame on CPU for smooth real-time throughput)
    stride = 2
    last_detected_count = 0

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        frame_counter += 1

        # Only run deep inference on every 'stride' frame to prevent CPU slowdown
        if frame_counter % stride == 0 or frame_counter == 1:
            classes, scores, boxes = model.detect(frame, Conf_threshold, NMS_threshold)

            # Count the number of vehicles detected (car, bus, truck, motorbike)
            car_count = 0
            for (classid, score, box) in zip(classes, scores, boxes):
                if class_name[classid] in ["car", "bus", "truck", "motorbike"]:
                    car_count += 1
                    color = COLORS[int(classid) % len(COLORS)]
                    label = f"{class_name[classid]} : {score:.2f}"
                    cv.rectangle(frame, box, color, 2)
                    cv.putText(frame, label, (box[0], max(15, box[1]-10)), 
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

        # Calculate and display FPS & Telemetry
        ending_time = time.time()
        fps = frame_counter / max(0.001, (ending_time - starting_time))
        cv.putText(frame, f'FPS: {fps:.2f}', (20, 40), 
                   cv.FONT_HERSHEY_COMPLEX, 0.7, (0, 255, 0), 2)
        cv.putText(frame, f'Vehicles Scanned : {car_count}', (20, 70), 
                   cv.FONT_HERSHEY_COMPLEX, 0.7, (0, 255, 255), 2)

        # Display the frame on desktop
        if show_gui:
            try:
                cv.imshow(window_title, frame)
                key = cv.waitKey(1)
                if key == ord('q'):
                    break
            except Exception as e:
                print(f"[NOTICE] GUI frame render note: {e}")

    # Release video capture and close window
    cap.release()
    if show_gui:
        try:
            cv.destroyWindow(window_title)
        except Exception:
            pass

    # Return the mean of the peak values
    return mean_peak_value