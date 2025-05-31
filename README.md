🕵️‍♂️ DEEPFAKE RECOGNITION
📖 Overview
DEEPFAKE RECOGNITION is designed to identify deepfake videos using LSTM (Long Short-Term Memory) and ResNet (Residual Networks). This project aims to offer an accurate and reliable method for detecting manipulated media. 🎥🔍

🚀 Features
Deepfake Detection: Utilizes advanced LSTM and ResNet models for video analysis. 🤖
High Accuracy: Effective in distinguishing between real and synthetic content. ✅
User-Friendly: Easy-to-use interface for video processing and result display. 🌟
📥 Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/bhagabanpaul62/DEEPFAKE-RECOGNITION.git
   cd DEEPFAKE-RECOGNITION
   ```

2. Set up a virtual environment:

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Download the model:
   Due to file size limitations, the model file (`best.pt`) is not included in the repository. You can download it from:

   - Google Drive: [Download best.pt](https://drive.google.com/drive/folders/your-folder-id) (link to be updated)
   - Or contact the repository owner at bhagabanpauloffcial@gmail.com for direct access

   After downloading, place the `best.pt` file in the `model/` directory.

🛠️ Usage
Run the detection system with:

```bash
python detect_deepfake.py --video <path_to_video>
```

Replace <path_to_video> with the path to your video file.

⚙️ Configuration
Customize model settings in config.json. For more details, see docs/configuration.md.

🤝 Contributing
To contribute:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Commit your changes: `git commit -am 'Add new feature'`
5. Push your branch: `git push origin feature/your-feature`
6. Create a pull request

Note: When contributing, please do not commit the model file (`best.pt`). Instead, update the download link in the README if needed.

📝 License
This project is licensed under the MIT License. See the LICENSE file for details.

📬 Contact
For questions or feedback, email:- bhagabanpauloffcial@gmail.com or pragyanshukashyap30092001@gmail.com 📧

🙏 Acknowledgements

- Libraries: PyTorch, OpenCV, and other tools used in this project. 🙌
- Datasets: Sourced from Kaggle Deepfake Detection Challenge. 📚
