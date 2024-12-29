import base64
import cv2
import numpy as np
import matplotlib.pyplot as plt
from converter import cvt2hsi
import re

def decode_base64_image(base64_string):
    try:
        # Decode the base64 string into bytes
        image_bytes = base64.b64decode(base64_string)
        # Convert bytes to a NumPy array
        np_array = np.frombuffer(image_bytes, np.uint8)
        # Decode the NumPy array to an image using OpenCV
        image = cv2.imdecode(np_array, cv2.IMREAD_COLOR)
        return image
    except Exception as e:
        print(f"Failed to decode base64 string: {e}")
        return None

def detect_color_objects(hsi_image, lower_bound, upper_bound):
    mask = cv2.inRange(hsi_image, np.array(lower_bound, dtype='float32'), np.array(upper_bound, dtype='float32'))
    result = hsi_image.copy()
    result[mask > 0] = [1, 1, 1]  # Highlight detected regions (optional)
    return mask, result

# Load base64 string from file
with open("./backend/src/modules/image.txt", "r") as f:
    base64_image = f.read().strip()

# Validate and process base64 string
if ',' in base64_image:
    base64_image = base64_image.split(',')[1]  # Remove metadata if present

if not re.match(r'^[A-Za-z0-9+/]*={0,2}$', base64_image):
    print("Invalid base64 string format")
    exit()

image = decode_base64_image(base64_image)

if image is None:
    print("Decoding base64 failed. Exiting.")
    exit()

# Convert the image to HSI
hsi_image = cvt2hsi(image)

# Define HSI range for object detection
lower_bound = (0 / 360 , 0.5, 60 / 255)
upper_bound = (30 / 360, 1.0, 90 / 255)

# Detect objects within the specified color range
mask, highlighted_hsi = detect_color_objects(hsi_image, lower_bound, upper_bound)

# Convert mask to uint8 for visualization
mask_uint8 = (mask * 255).astype('uint8')
print(mask_uint8)

# Choose a color to highlight (red in BGR format)
highlight_color = [0, 0, 255]

# Create a copy of the original image
highlighted_image = image.copy()

# Apply the highlight color to the original image where mask is non-zero
highlighted_image[mask > 0] = highlight_color

# **Alternative Approach**: Blend the highlight color with the original image (uncomment to use)
# alpha = 0.6  # Adjust the value between 0 (fully transparent) and 1 (fully opaque)
# overlay = np.full(image.shape, highlight_color, dtype=np.uint8)
# cv2.addWeighted(overlay, alpha, highlighted_image, 1 - alpha, 0, dst=highlighted_image, mask=mask_uint8)

# Visualize the results
plt.figure(figsize=(20, 5))

plt.subplot(1, 4, 1)
plt.title("Original Image")
plt.imshow(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
plt.axis('off')

plt.subplot(1, 4, 2)
plt.title("Mask")
plt.imshow(mask_uint8)
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