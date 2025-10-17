import pickle

import cv2
from fastapi import UploadFile
from tensorflow.keras.models import load_model
import numpy as np

model_filename = "leaf_disease_cnn_model.h5"
le_filename = "label_encoder.pkl"

loaded_model = load_model(model_filename)
print(f"Model '{model_filename}' dosyasından yüklendi.")


def _preprocess_image_path(image_path, img_size=(128, 128)):
    img = cv2.imread(image_path)
    if img is None:
        print(f"Hata: Görüntü yüklenemedi: {image_path}")
        return None
    img = cv2.resize(img, img_size)
    img = np.expand_dims(img, axis=0)
    return img


def _preprocess_image_from_bytes(image_bytes: UploadFile, img_size=(128, 128)):
    image_bytes.file.seek(0)
    contents = image_bytes.file.read()
    img_array = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
    if img is None:
        print("Hata: Görüntü çözümlenemedi (imdecode başarısız).")
        return None
    img = cv2.resize(img, img_size)
    img = np.expand_dims(img, axis=0)
    return img


def classification_result(image: UploadFile):
    preprocessed_image = _preprocess_image_from_bytes(image)
    predictions = loaded_model.predict(preprocessed_image)
    predicted_class_index = np.argmax(predictions)
    predicted_probability = np.max(predictions)

    with open(le_filename, 'rb') as f:
        loaded_le = pickle.load(f)
    print(f"LabelEncoder objesi '{le_filename}' dosyasından yüklendi.")

    predicted_class_name = loaded_le.inverse_transform([predicted_class_index])[0]

    return {
        "predicted_class": predicted_class_name,
        "probability": float(predicted_probability)
    }
