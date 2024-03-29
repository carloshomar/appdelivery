import cv2
import dlib
import numpy as np


def extract_face_features(image_path):
    # Inicializa o detector de faces do dlib
    detector = dlib.get_frontal_face_detector()
    predictor = dlib.shape_predictor(
        "shape_predictor_68_face_landmarks.dat"
    )  # Baixe este arquivo

    # Carrega a imagem
    image = cv2.imread(image_path)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Detecta as faces na imagem
    faces = detector(gray)

    if len(faces) == 0:
        print("Nenhuma face detectada na imagem:", image_path)
        return None

    # Assume que há apenas uma face na imagem
    face = faces[0]

    # Calcula os pontos de referência faciais
    landmarks = predictor(gray, face)
    landmarks = np.array([[p.x, p.y] for p in landmarks.parts()])

    return landmarks.flatten()


def compare_images(image1_path, image2_path):
    # Extrai as características faciais de cada imagem
    features1 = extract_face_features(image1_path)
    features2 = extract_face_features(image2_path)

    if features1 is None or features2 is None:
        return "Não foi possível comparar as imagens, uma ou ambas não contêm rosto(s)."

    # Calcula a distância euclidiana entre os vetores de características
    distance = np.linalg.norm(features1 - features2)

    # Define um limite de similaridade
    threshold = 100  # Ajuste conforme necessário

    # Verifica se a distância está abaixo do limite
    if distance < threshold:
        print(distance)
        return "As imagens são da mesma pessoa."
    else:
        print(distance)
        return "As imagens não são da mesma pessoa."


# Exemplo de uso
image1_path = "pessoa1.png"
image2_path = "pessoa2.png"

result = compare_images(image1_path, image2_path)
print(result)
