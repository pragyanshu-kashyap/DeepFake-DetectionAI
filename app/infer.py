import torch
import cv2
import numpy as np
import torchvision.transforms as transforms
import torchvision.models as models
import torch.nn as nn
import torch.nn.functional as F
import base64
from io import BytesIO
from PIL import Image
import os
import requests
import sys

def download_model(url, save_path):
    """Download the model file from the given URL"""
    try:
        if not os.path.exists(os.path.dirname(save_path)):
            os.makedirs(os.path.dirname(save_path))
            
        if not os.path.exists(save_path):
            print(f"Downloading model to {save_path}...")
            response = requests.get(url, stream=True)
            response.raise_for_status()
            
            with open(save_path, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    if chunk:
                        f.write(chunk)
            print("Model downloaded successfully!")
        else:
            print("Model file already exists!")
    except Exception as e:
        print(f"Error downloading model: {e}")
        sys.exit(1)

# Define the Model class if not already defined
class Model(nn.Module):
    def __init__(self, num_classes, latent_dim=2048, lstm_layers=1, hidden_dim=2048, bidirectional=False):
        super(Model, self).__init__()
        model = models.resnext50_32x4d(weights='DEFAULT')
        self.model = nn.Sequential(*list(model.children())[:-2])
        self.lstm = nn.LSTM(latent_dim, hidden_dim, lstm_layers, bidirectional)
        self.relu = nn.LeakyReLU()
        self.dp = nn.Dropout(0.4)
        self.linear1 = nn.Linear(2048, num_classes)
        self.avgpool = nn.AdaptiveAvgPool2d(1)

    def forward(self, x):
        batch_size, seq_length, c, h, w = x.shape
        x = x.view(batch_size * seq_length, c, h, w)
        fmap = self.model(x)
        x = self.avgpool(fmap)
        x = x.view(batch_size, seq_length, 2048)
        x_lstm, _ = self.lstm(x, None)
        return fmap, self.dp(self.linear1(torch.mean(x_lstm, dim=1)))

def load_model(model_path):
    # Check if we need to download the model
    model_url = os.getenv('MODEL_URL')
    if model_url:
        download_model(model_url, model_path)
    
    # Initialize model
    model = Model(num_classes=2)
    if torch.cuda.is_available():
        model = model.cuda()
        state_dict = torch.load(model_path)
    else:
        state_dict = torch.load(model_path, map_location=torch.device('cpu'))
    
    model.load_state_dict(state_dict, strict=False)
    model.eval()
    return model

def preprocess_frame(frame):
    transform = transforms.Compose([
        transforms.ToTensor(),
        transforms.Resize((224, 224)),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])
    frame = transform(frame)

    return frame

def process_video(video_path, model, seq_length=40):
    cap = cv2.VideoCapture(video_path)
    frames = []
    i=1
    img_str = None

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        #convert it to rgb
        frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        # Save a single frame before converting it to a tensor
        if i==40:
            ##SAVE A single FRAME
            # To return the frame as a base64-encoded string for HTML display
            image_pil = Image.fromarray(frame)  # Convert back to BGR for saving
            buffer = BytesIO()
            ##image_pil.save('static/upload/out.jpg', format="JPEG")
            image_pil.save(buffer, format="JPEG")
            img_str = base64.b64encode(buffer.getvalue()).decode("utf-8")
            #img_str = base64.b64encode(buffer.getvalue()).decode("utf-8")
            
        i=i+1
        # Convert the frame to tensor
        frame_tensor = preprocess_frame(frame)
        frames.append(frame_tensor)


        if len(frames) == seq_length:
            break

    cap.release()

    if len(frames) < seq_length:
        padding = [torch.zeros_like(frames[0]) for _ in range(seq_length - len(frames))]
        frames.extend(padding)

    frames = torch.stack(frames).unsqueeze(0).cuda()  # Shape: (1, seq_length, 3, 224, 224)

    with torch.no_grad():
        _, logits = model(frames)
        probabilities = F.softmax(logits, dim=1)
        confidence, prediction = torch.max(probabilities, 1)
        res = prediction.item() == 0
        confidence_score = confidence.item()
        print(confidence_score*100)

    return res, img_str,int(confidence_score*100)  # Return both the prediction result and the base64-encoded image string


def process_image(image_path, model, seq_length=40):
    img_str = None
    frame = Image.open(image_path).convert('RGB')
    img_str = base64.b64encode(open(image_path, "rb").read()).decode('utf-8')

    # Convert the image to a tensor
    frame_tensor = preprocess_frame(frame)

    # Simulate a sequence of identical frames (because the model expects a sequence)
    frames = [frame_tensor] * seq_length
    frames = torch.stack(frames).unsqueeze(0).cuda()  # Shape: (1, seq_length, 3, 224, 224)

    with torch.no_grad():
        _, logits = model(frames)
        probabilities = F.softmax(logits, dim=1)
        confidence, prediction = torch.max(probabilities, 1)
        res = prediction.item() == 0
        confidence_score = confidence.item()
        print(confidence_score * 100)

    return res, img_str, int(confidence_score * 100)



def pipeline(file_path, model_path):
    model = load_model(model_path)
    ext = os.path.splitext(file_path)[-1].lower()

    if ext in ['.mp4', '.avi', '.mov']:
        res, img_str, confidence_score = process_video(file_path, model)
    elif ext in ['.jpg', '.jpeg', '.png']:
        res, img_str, confidence_score = process_image(file_path, model)
    else:
        raise ValueError("Unsupported file format")

    if res:
        print(f"Prediction: REAL with confidence {confidence_score}%")
    else:
        print(f"Prediction: FAKE with confidence {confidence_score}%")
    return res, img_str, confidence_score

'''
# Main script
model_path = 'best.pt'

video_path_fake = 'arnold.mp4'# deepfake elon sample
video_path_real = 'thisiselon.mp4'# real elon sample


model = load_model(model_path)
is_real = process_video(video_path_fake, model)

if is_real:
    print("Prediction: REAL")
else:
    print("Prediction: FAKE")
'''