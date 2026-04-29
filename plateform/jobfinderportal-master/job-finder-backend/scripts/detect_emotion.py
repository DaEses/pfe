#!/usr/bin/env python3
"""
detect_emotion.py — Emotion detection helper script using the binary Keras model.

Usage:
    python3 detect_emotion.py <image_file_path>

Outputs a JSON object to stdout:
    {"emotion": "NEUTRAL"|"IRRITATED", "confidence": <float 0-1>}

On error outputs:
    {"error": "<error message>", "emotion": "NEUTRAL", "confidence": 0.0}

The model is expected at:
    <repo_root>/emotiondetection/models/binary_emotion_model.h5
"""
import sys
import json
import os

# Resolve path to emotion model relative to this script's location
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
# scripts/ is inside job-finder-backend/, go up 4 levels to reach repo root
REPO_ROOT = os.path.abspath(os.path.join(SCRIPT_DIR, "..", "..", "..", "..", ".."))
MODEL_PATH = os.path.join(REPO_ROOT, "emotiondetection", "models", "binary_emotion_model.h5")

# Image dimensions expected by the model (grayscale 48x48 as used in training)
IMG_SIZE = (48, 48)
LABELS = ["NEUTRAL", "IRRITATED"]


def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No image file path provided", "emotion": "NEUTRAL", "confidence": 0.0}))
        sys.exit(1)

    image_path = sys.argv[1]

    if not os.path.exists(image_path):
        print(json.dumps({"error": f"File not found: {image_path}", "emotion": "NEUTRAL", "confidence": 0.0}))
        sys.exit(1)

    if not os.path.exists(MODEL_PATH):
        print(json.dumps({
            "error": f"Emotion model not found at {MODEL_PATH}",
            "emotion": "NEUTRAL",
            "confidence": 0.0
        }))
        sys.exit(1)

    try:
        import numpy as np  # type: ignore
        import cv2  # type: ignore
    except ImportError as exc:
        print(json.dumps({"error": f"Missing dependency: {exc}. Run: pip install numpy opencv-python", "emotion": "NEUTRAL", "confidence": 0.0}))
        sys.exit(1)

    try:
        os.environ.setdefault("TF_CPP_MIN_LOG_LEVEL", "3")
        from tensorflow.keras.models import load_model  # type: ignore
    except ImportError:
        print(json.dumps({"error": "TensorFlow not installed. Run: pip install tensorflow", "emotion": "NEUTRAL", "confidence": 0.0}))
        sys.exit(1)

    try:
        # Load image in grayscale
        frame = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
        if frame is None:
            raise ValueError("Could not read image file")

        # Detect face using Haar cascade
        cascade_path = cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
        face_cascade = cv2.CascadeClassifier(cascade_path)
        faces = face_cascade.detectMultiScale(frame, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

        if len(faces) == 0:
            # No face detected — use entire image resized
            roi = cv2.resize(frame, IMG_SIZE)
        else:
            # Use the first (largest) detected face
            x, y, w, h = sorted(faces, key=lambda f: f[2] * f[3], reverse=True)[0]
            roi = cv2.resize(frame[y:y + h, x:x + w], IMG_SIZE)

        # Normalize and reshape for model
        roi = roi.astype("float32") / 255.0
        roi = np.expand_dims(roi, axis=-1)   # (48, 48, 1)
        roi = np.expand_dims(roi, axis=0)    # (1, 48, 48, 1)

        # Load model and predict
        model = load_model(MODEL_PATH, compile=False)
        prediction = model.predict(roi, verbose=0)[0]

        # Binary model: single output neuron (sigmoid) or two-neuron softmax
        if len(prediction) == 1:
            # Sigmoid: >0.5 means IRRITATED
            confidence = float(prediction[0])
            label_idx = 1 if confidence >= 0.5 else 0
            confidence = confidence if label_idx == 1 else (1.0 - confidence)
        else:
            # Softmax over two classes
            label_idx = int(np.argmax(prediction))
            confidence = float(prediction[label_idx])

        emotion = LABELS[label_idx]
        print(json.dumps({"emotion": emotion, "confidence": round(confidence, 4)}))

    except Exception as exc:
        print(json.dumps({"error": str(exc), "emotion": "NEUTRAL", "confidence": 0.0}))
        sys.exit(1)


if __name__ == "__main__":
    main()
