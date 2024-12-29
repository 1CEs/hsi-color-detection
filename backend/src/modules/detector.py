from converter import cvt2hsi
import matplotlib.pyplot as plt
import numpy as np
import cv2

def detect_color_objects(hsi_image, lower_bound, upper_bound):
    # Create a binary mask for the range
    mask = cv2.inRange(hsi_image, np.array(lower_bound, dtype='float32'), np.array(upper_bound, dtype='float32'))
    
    # Highlight the detected regions on the original image
    result = hsi_image.copy()
    result[mask > 0] = [1, 1, 1]  # Highlight detected regions (optional visual step)

    return mask, result

# Example usage
image_path = './backend/image/pngegg.png'
image = cv2.imread(image_path)
hsi_image = cvt2hsi(image)

# Define HSI range for object detection
# Adjust these values based on the color you want to detect
lower_bound = (0, 1.0, 64 / 255)
upper_bound = (40 / 360, 1.0, 85 / 255)

# Detect objects within the specified color range
mask, highlighted_hsi = detect_color_objects(hsi_image, lower_bound, upper_bound)

# Convert mask to uint8 for visualization
mask_uint8 = (mask * 255).astype('uint8')

# Visualize the results
plt.figure(figsize=(15, 5))
plt.subplot(1, 3, 1)
plt.title("Original Image")
plt.imshow(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
plt.axis('off')

plt.subplot(1, 3, 2)
plt.title("Mask")
plt.imshow(mask_uint8, cmap='gray')
plt.axis('off')

plt.subplot(1, 3, 3)
plt.title("Highlighted Regions")
plt.imshow(highlighted_hsi[..., 2], cmap='gray')  # Visualizing Intensity for simplicity
plt.axis('off')

plt.tight_layout()
plt.show()
