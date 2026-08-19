import urllib.request
import urllib.parse
import os
import json
import mimetypes

def post_multipart_videos(url, file_paths):
    boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW'
    body = bytearray()

    for path in file_paths:
        filename = os.path.basename(path)
        mime_type = mimetypes.guess_type(path)[0] or 'video/mp4'
        with open(path, 'rb') as f:
            file_data = f.read()

        body.extend(f'--{boundary}\r\n'.encode('utf-8'))
        body.extend(f'Content-Disposition: form-data; name="videos"; filename="{filename}"\r\n'.encode('utf-8'))
        body.extend(f'Content-Type: {mime_type}\r\n\r\n'.encode('utf-8'))
        body.extend(file_data)
        body.extend(b'\r\n')

    body.extend(f'--{boundary}--\r\n'.encode('utf-8'))

    req = urllib.request.Request(url, data=bytes(body))
    req.add_header('Content-Type', f'multipart/form-data; boundary={boundary}')
    req.add_header('User-Agent', 'TestClient/1.0')

    print(f"[TEST CLIENT] Sending 4 videos to {url} ...")
    with urllib.request.urlopen(req, timeout=120) as response:
        status = response.status
        data = response.read().decode('utf-8')
        print(f"[TEST CLIENT] HTTP Status: {status}")
        print(f"[TEST CLIENT] Response Payload: {data}")
        return json.loads(data)

if __name__ == '__main__':
    base_dir = os.path.dirname(os.path.abspath(__file__))
    sample_dir = os.path.join(base_dir, 'sample_videos')
    files = [
        os.path.join(sample_dir, 'traffic_road1.mp4'),
        os.path.join(sample_dir, 'traffic_road2.mp4'),
        os.path.join(sample_dir, 'traffic_road3.mp4'),
        os.path.join(sample_dir, 'traffic_road4.mp4'),
    ]
    result = post_multipart_videos('http://127.0.0.1:5000/upload', files)
    print("\n[SUCCESS] API END-TO-END VERIFICATION RESULT:")
    print(f"Optimal Green Timings -> North: {result['north']}s, South: {result['south']}s, West: {result['west']}s, East: {result['east']}s")
