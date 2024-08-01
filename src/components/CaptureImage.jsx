// src/components/CaptureImage.jsx
import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import { Button, Typography, Box } from '@mui/material';
import { storage } from '../firebase';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import * as mobilenet from '@tensorflow-models/mobilenet';
import '@tensorflow/tfjs';
import classificationMapping from '../utils/classificationMapping';

function CaptureImage({ onCapture }) {
  const webcamRef = useRef(null);
  const [imageData, setImageData] = useState(null);
  const [classification, setClassification] = useState('');

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImageData(imageSrc);
  };

  const classifyImage = async (imageElement) => {
    const model = await mobilenet.load();
    const predictions = await model.classify(imageElement);
    console.log('Predictions:', predictions); // Debug log
    if (predictions.length > 0) {
      const category = classificationMapping(predictions[0].className);
      console.log('Mapped Category:', category); // Debug log
      setClassification(category);
    }
  };

  const uploadImage = async () => {
    if (imageData && classification) {
      try {
        const storageRef = ref(storage, `${classification}/${Date.now()}.jpg`);
        await uploadString(storageRef, imageData, 'data_url');
        const url = await getDownloadURL(storageRef);
        onCapture(url, classification);
        setImageData(null);
        setClassification('');
      } catch (error) {
        console.error("Error uploading image: ", error);
        onCapture(null, '');
      }
    }
  };

  return (
    <div>
      {imageData ? (
        <>
          <img
            src={imageData}
            alt="Captured"
            style={{ width: '100%' }}
            ref={(img) => {
              if (img) {
                classifyImage(img);
              }
            }}
          />
          <Typography variant="body2" color="textSecondary">
            Classification: {classification}
          </Typography>
          <Button onClick={uploadImage} variant="contained" color="primary">Upload Image</Button>
        </>
      ) : (
        <>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width="100%"
          />
          <Button onClick={capture} variant="contained" color="primary">Capture Image</Button>
        </>
      )}
    </div>
  );
}

export default CaptureImage;
