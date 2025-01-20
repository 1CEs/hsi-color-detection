import numpy as np
import cv2

def cvt2hsi(image):
    image = image.astype('float32') / 255.0
    B, G, R = cv2.split(image)
    num = 0.5 * ((R - G) + (R - B))
    den = np.sqrt((R - G)**2 + (R - B)*(G - B)) + 1e-7
    theta = np.arccos(num / den)
    H = np.where(B <= G, theta, 2 * np.pi - theta)
    H = H / (2 * np.pi)  # Normalize to [0,1]
    min_rgb = np.minimum(np.minimum(R, G), B)
    S = 1 - (3 * min_rgb / (R + G + B + 1e-7))
    I = (R + G + B) / 3
    hsi_image = cv2.merge((H, S, I))
    return hsi_image