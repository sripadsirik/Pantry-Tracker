// src/components/CaptureImage.jsx
import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import { Button } from '@mui/material';
import { storage } from '../firebase';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';

function CaptureImage({ onCapture }) {
  const webcamRef = useRef(null);
  const [imageData, setImageData] = useState(null);

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImageData(imageSrc);
  };

  const uploadImage = async () => {
    if (imageData) {
      try {
        const storageRef = ref(storage, `images/${Date.now()}.jpg`);
        await uploadString(storageRef, imageData, 'data_url');
        const url = await getDownloadURL(storageRef);
        onCapture(url, "other");  // Default classification to "other"
        setImageData(null);
      } catch (error) {
        console.error("Error uploading image: ", error);
        onCapture(null, "other");
      }
    }
  };

  return (
    <div>
      {imageData ? (
        <>
          <img src={imageData} alt="Captured" style={{ width: '100%' }} />
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
