import base64
import cv2
import numpy as np
import matplotlib.pyplot as plt
import re

# Correct HSI conversion function
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

def decode_base64_image(base64_string):
    try:
        image_bytes = base64.b64decode(base64_string)
        np_array = np.frombuffer(image_bytes, np.uint8)
        image = cv2.imdecode(np_array, cv2.IMREAD_COLOR)
        return image
    except Exception as e:
        print(f"Failed to decode base64 string: {e}")
        return None

def detect_color_objects(hsi_image, lower_bound, upper_bound):
    mask = cv2.inRange(hsi_image, np.array(lower_bound, dtype='float32'), np.array(upper_bound, dtype='float32'))
    result = hsi_image.copy()
    result[mask > 0] = [1, 1, 1]
    return mask, result

with open("./backend/src/modules/image.txt", "r") as f:
    base64_image = f.read().strip()

if ',' in base64_image:
    base64_image = base64_image.split(',')[1]

if not re.match(r'^[A-Za-z0-9+/]*={0,2}$', base64_image):
    print("Invalid base64 string format")
    exit()

image = decode_base64_image(base64_image)

if image is None:
    print("Decoding base64 failed. Exiting.")
    exit()

hsi_image = cvt2hsi(image)

lower_bound = (58 / 360, 0.4, 0.4)
upper_bound = (81 / 360, 1.0, 1.0)

mask, highlighted_hsi = detect_color_objects(hsi_image, lower_bound, upper_bound)
mask_uint8 = (mask * 255).astype('uint8')
highlight_color = [0, 0, 255]
highlighted_image = image.copy()
highlighted_image[mask > 0] = highlight_color

plt.figure(figsize=(20, 5))

plt.subplot(1, 4, 1)
plt.title("Original Image")
plt.imshow(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
plt.axis('off')

plt.subplot(1, 4, 2)
plt.title("Mask")
plt.imshow(mask_uint8, cmap="gray")
plt.axis('off')

plt.subplot(1, 4, 3)
plt.title("Highlighted HSI Regions")
plt.imshow(highlighted_hsi[..., 2], cmap="gray")
plt.axis('off')

plt.subplot(1, 4, 4)
plt.title("Image with Highlighted Areas")
plt.imshow(cv2.cvtColor(highlighted_image, cv2.COLOR_BGR2RGB))
plt.axis('off')

plt.tight_layout()
plt.show()