from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict
import base64
import cv2
import numpy as np
from src.modules.converter import cvt2hsi
import matplotlib.pyplot as plt

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hello, World!"}

class UploadModel(BaseModel):
    upper: Dict[str, float]
    lower: Dict[str, float]
    image: str  # Base64-encoded string
    oc: list

def detect_color_objects(hsi_image, lower_bound, upper_bound):
    mask = cv2.inRange(hsi_image, np.array(lower_bound, dtype="float32"), np.array(upper_bound, dtype="float32"))
    highlighted_hsi = hsi_image.copy()
    highlighted_hsi[mask > 0] = [1, 1, 1]  # Placeholder processing
    return mask, highlighted_hsi

def overlay_mask_on_image(original_image, mask, highlight_color=(255, 255, 255)):
    highlighted_image = original_image.copy()

    highlighted_image[mask > 0] = highlight_color
    plt.figure(figsize=(20, 5))
    plt.subplot(1, 4, 1)
    plt.title("Original Image")
    plt.imshow(cv2.cvtColor(highlighted_image, cv2.COLOR_BGR2RGB))
    plt.axis('off')
    return highlighted_image

def image_to_base64(image):
    _, buf = cv2.imencode('.png', image)
    return base64.b64encode(buf).decode('utf-8')

# Function to redraw the mask
def redraw_mask(mask):
    # Create a blank RGB image with the same dimensions as the mask
    new_image = np.zeros((mask.shape[0], mask.shape[1], 3), dtype=np.uint8)
    # Fill the detected areas with white (255, 255, 255)
    new_image[mask > 0] = [255, 255, 255]
    return new_image

@app.post("/process/")
async def process_image(data: UploadModel):
    try:
        # Decode the Base64 image
        if ',' in data.image:
            encoded_data = data.image.split(',')[1]
        else:
            encoded_data = data.image

        nparr = np.frombuffer(base64.b64decode(encoded_data), np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if image is None:
            raise ValueError("Invalid image data")

        # Convert the image to HSI
        hsi_image = cvt2hsi(image)

        # Prepare HSI bounds from the request
        lower_bound = (
            data.lower["h"] / 360,
            data.lower["s"],
            data.lower["i"] / 255
        )
        upper_bound = (
            data.upper["h"] / 360,
            data.upper["s"],
            data.upper["i"] / 255
        )

        # Detect objects and get the mask
        mask, highlighted_hsi = detect_color_objects(hsi_image, lower_bound, upper_bound)

        # Redraw the mask into a new image
        redrawn_mask = redraw_mask(mask)

        # Convert redrawn mask to Base64
        redrawn_mask_base64 = image_to_base64(redrawn_mask)

        # Convert other images to Base64
        highlighted_hsi_base64 = image_to_base64((highlighted_hsi[..., 2] * 255).astype(np.uint8))
        highlighted_image_base64 = image_to_base64(overlay_mask_on_image(
                    image, mask, highlight_color=(
                        data.oc[2], data.oc[1], data.oc[0]
                        )))
        return {
            "message": "Image processed successfully",
            "images": {
                "mask": f"data:image/png;base64,{redrawn_mask_base64}",
                "gray_image": f"data:image/png;base64,{highlighted_hsi_base64}",
                "overlay_image": f"data:image/png;base64,{highlighted_image_base64}",
            }
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error: {str(e)}")
