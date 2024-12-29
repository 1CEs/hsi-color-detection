# HSI Color Detection Project

## Overview  
This project is an HSI (Hue, Saturation, Intensity) color detection system. It allows users to analyze images or live streams to detect specific colors based on the HSI color model. The system consists of a **React TypeScript frontend** and a **FastAPI + OpenCV backend**.

---

## Features  
### Frontend (React with TypeScript)
- **User Interface**: An intuitive and interactive UI for uploading images or connecting to video streams.
- **Real-time Visualization**: Displays color detection results dynamically.
- **Customization**: Options to adjust HSI thresholds to fine-tune the detection process.

### Backend (FastAPI + OpenCV)
- **Image Processing**: Uses OpenCV to process images and detect colors within specified HSI ranges.
- **API Endpoints**: FastAPI provides efficient RESTful endpoints for:
  - Uploading images.
  - Configuring detection parameters dynamically.
- **Scalability**: Designed to handle real-time operations efficiently.

---

## Technology Stack  
### Frontend
- **Framework**: React
- **Language**: TypeScript

### Backend
- **Framework**: FastAPI
- **Libraries**: OpenCV for image processing.
- **Language**: Python

---

## How It Works  
1. **User Input**: Upload an image or stream a video from the frontend.  
2. **HSI Conversion**: Backend converts the input to HSI color space using OpenCV.  
3. **Color Detection**: Backend processes the HSI data to detect colors within user-defined thresholds.  
4. **Result Display**: The frontend displays the processed output in real-time.

---

## Installation and Setup  

### Prerequisites
- Bun.js (for frontend)
- Python 3.8+ (for backend)

### Steps
1. Clone the repository:  
   ```bash
   git clone <repository-url>
   cd <repository-folder>
