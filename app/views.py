from flask import render_template,request
import os
import cv2
from app.infer import pipeline

UPLOAD_FOLDER ='static/upload'

def index():
    msg=""
    img_str = None
    conf_score=0

    if request.method == 'POST':
        f = request.files['file_name']
        if f:
              # Create a temporary file object in memory
            model_path = "model/best.pt"
            # Save the file to a BytesIO object instead of disk
            file_content = f.read()
            temp_file = os.path.join(UPLOAD_FOLDER, "temp_" + f.filename)
            with open(temp_file, 'wb') as temp:
                temp.write(file_content)
            
            try:
                res, img_str, conf_score = pipeline(temp_file, model_path)
            finally:
                # Clean up - delete the temporary file
                if os.path.exists(temp_file):
                    os.remove(temp_file)
            if res:
                msg="REAL VIDEO"
            else:
                msg='GENERATED VIDEO'
    return render_template('index.html',message=msg,image_data=img_str,confidence_score=conf_score)



'''
def app():
    return render_template('app.html')

def genderapp():
    return render_template('gender.html')'''