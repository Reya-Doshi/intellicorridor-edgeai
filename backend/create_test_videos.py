import cv2 as cv
import numpy as np
import os

def generate_clean_proto_video(filename, car_count=6, num_frames=60, fps=20, label="CAM-01"):
    """
    Creates lightweight, crisp, animated 2D prototype traffic video with moving vehicle rectangles.
    """
    os.makedirs(os.path.dirname(os.path.abspath(filename)), exist_ok=True)
    width, height = 480, 360
    fourcc = cv.VideoWriter_fourcc(*'mp4v')
    out = cv.VideoWriter(filename, fourcc, fps, (width, height))

    colors = [
        (230, 160, 40),  # Cyan-blue car
        (50, 200, 120),  # Emerald car
        (220, 80, 80),   # Red car
        (80, 180, 240),  # Amber car
        (200, 100, 220), # Purple bus/van
    ]

    for frame_idx in range(num_frames):
        # Dark modern asphalt road
        img = np.full((height, width, 3), (20, 24, 30), dtype=np.uint8)

        # Draw road pavement
        cv.rectangle(img, (60, 0), (420, height), (35, 40, 48), -1)
        # Road borders
        cv.line(img, (60, 0), (60, height), (70, 80, 95), 2)
        cv.line(img, (420, 0), (420, height), (70, 80, 95), 2)

        # Dashed lane dividers
        for lane_x in [150, 240, 330]:
            dash_start = (frame_idx * 6) % 30
            for y in range(dash_start - 30, height, 30):
                if y + 16 < height and y > 0:
                    cv.line(img, (lane_x, y), (lane_x, y + 16), (220, 220, 220), 2)

        # Draw moving vehicles
        for i in range(car_count):
            lane_idx = i % 3
            lane_center = 105 + lane_idx * 90
            speed = 6 + (i % 3) * 2
            car_y = int((frame_idx * speed + i * 85) % (height + 80) - 50)

            col = colors[i % len(colors)]
            # Vehicle body
            cv.rectangle(img, (lane_center - 20, car_y), (lane_center + 20, car_y + 45), col, -1)
            # Windshield
            cv.rectangle(img, (lane_center - 15, car_y + 10), (lane_center + 15, car_y + 22), (15, 18, 22), -1)
            # Headlights
            cv.circle(img, (lane_center - 14, car_y + 42), 3, (255, 255, 200), -1)
            cv.circle(img, (lane_center + 14, car_y + 42), 3, (255, 255, 200), -1)
            # Bounding box tag (YOLOv9 Edge detection simulation)
            cv.rectangle(img, (lane_center - 24, car_y - 4), (lane_center + 24, car_y + 49), (0, 255, 200), 1)

        # Camera watermark overlay
        cv.putText(img, f"EDGE-CAM [{label}] - YOLOv9 INFERENCE 30FPS", (15, 25), 
                   cv.FONT_HERSHEY_SIMPLEX, 0.45, (0, 255, 200), 1, cv.LINE_AA)

        out.write(img)

    out.release()
    print(f"[OK] Created prototype video: {filename}")

if __name__ == '__main__':
    base_dir = os.path.dirname(os.path.abspath(__file__))
    sample_dir = os.path.join(base_dir, 'sample_videos')
    generate_clean_proto_video(os.path.join(sample_dir, 'traffic_road1.mp4'), car_count=5, label="NORTH-01")
    generate_clean_proto_video(os.path.join(sample_dir, 'traffic_road2.mp4'), car_count=8, label="SOUTH-02")
    generate_clean_proto_video(os.path.join(sample_dir, 'traffic_road3.mp4'), car_count=4, label="WEST-03")
    generate_clean_proto_video(os.path.join(sample_dir, 'traffic_road4.mp4'), car_count=6, label="EAST-04")
