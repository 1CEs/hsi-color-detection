import numpy as np

def cvt2hsi(image):
    if image is None:
        raise ValueError("Input image is None. Check the file path or file format.")

    image = image.astype('float32') / 255
    R, G, B = image[..., 0], image[..., 1], image[..., 2]

    I = (R + G + B) / 3
    
    min_rgb = np.minimum(np.minimum(R, G), B)
    S = 1 - (3 / (R + G + B + 1e-6)) * min_rgb
    
    numerator = (R - G) + (R - B)
    denominator = 2 * np.sqrt((R - G)**2 + (R - B) * (G - B)) + 1e-6
    theta = np.arccos(numerator / denominator)
    
    H = np.where(B > G, 2 * np.pi - theta, theta)
    H = H / (2 * np.pi)
    
    hsi_image = np.stack((H, S, I), axis=-1)
    return hsi_image