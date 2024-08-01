import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import { Button, Typography, Box, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { storage } from '../firebase';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import * as mobilenet from '@tensorflow-models/mobilenet';
import '@tensorflow/tfjs';
import classificationMapping from '../utils/classificationMapping';

function CaptureImage({ onCapture }) {
  const webcamRef = useRef(null);
  const [imageData, setImageData] = useState(null);
  const [classification, setClassification] = useState('');
  const [manualClassification, setManualClassification] = useState('');

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
    const finalClassification = manualClassification || classification;
    if (imageData && finalClassification) {
      try {
        const storageRef = ref(storage, `${finalClassification}/${Date.now()}.jpg`);
        await uploadString(storageRef, imageData, 'data_url');
        const url = await getDownloadURL(storageRef);
        onCapture(url, finalClassification);
        setImageData(null);
        setClassification('');
        setManualClassification('');
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
          <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
            <InputLabel>Manual Classification</InputLabel>
            <Select
              value={manualClassification}
              onChange={(e) => setManualClassification(e.target.value)}
              label="Manual Classification"
            >
              <MenuItem value="fruit">Fruit</MenuItem>
              <MenuItem value="vegetable">Vegetable</MenuItem>
              <MenuItem value="grain">Grain</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>
          <Button onClick={uploadImage} variant="contained" color="primary" sx={{ mt: 2 }}>Upload Image</Button>
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
