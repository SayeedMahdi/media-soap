import React, { useEffect, useRef } from 'react';

const VideoChat = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    const constraints = { audio: true, video: true };

    const startVideoChat = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        videoRef.current.srcObject = stream;
      } catch (error) {
        console.error('Error accessing camera and audio:', error);
      }
    };

    startVideoChat();
  }, []);

  return <video ref={videoRef} autoPlay />;
};

export default VideoChat;
