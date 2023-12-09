import { useState, useRef } from "react";

import { PiRecordFill } from "react-icons/pi";
import { IoTrashBinSharp } from "react-icons/io5";

import { useVideoStore } from "../../store/videoStore";


const VideoRecord = () => {
  
  const setVideo = useVideoStore((state) => state.setVideo);
  const removeVideo = useVideoStore((state) => state.removeVideo);
  
  const liveVideo = useRef<HTMLVideoElement>(null);
  
  const [isCameraAllowed, setIsCameraAllowed] = useState<boolean>(false);
  const [recordedVideoURL, setRecordedVideoURL] = useState<string>("");
  const [remainTime, setRemainTime] = useState<number>(30);

  const [toggleLiveVideo, setToggleLiveVideo] = useState<boolean>(false);
  const [toggleRecordedVideo, setToggleRecordedVideo] =
    useState<boolean>(false);

  function startRecord() {
    setToggleLiveVideo(true);

    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(function (stream) {
        const video = liveVideo.current;
        const parts: Blob[] = [];
        if (video) {
          video.srcObject = stream;
          video.onloadedmetadata = function () {
            video.play();
          };
        }

        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start(1000);
        mediaRecorder.ondataavailable = function (e) {
          parts.push(e.data);
        };

        mediaRecorder.onstop = function () {
          const blob = new Blob(parts, { type: "video/webm" });
          const videoURL = URL.createObjectURL(blob);
          setVideo(blob);
          setRecordedVideoURL(videoURL);
          if (stream) {
            stream.getTracks().forEach((track) => track.stop());
          }
        };

        const id = setInterval(() => {
          setRemainTime((prev) => prev - 1);
        }, 1000);

        setTimeout(() => {
          mediaRecorder.stop();
          stopLiveVideo();
          clearInterval(id);
          setRemainTime(30);
        }, 30000);
      })
      .catch(function () {
        setIsCameraAllowed(true);
        setToggleLiveVideo(false);
      });
  }

  const stopLiveVideo = () => {
    setToggleLiveVideo(false);
    setToggleRecordedVideo(true);
  };

  const deleteVideo = () => {
    setToggleRecordedVideo(false);
    setRecordedVideoURL("");
    removeVideo();
  };

  return (
    <>
      <button
        type="button"
        disabled={toggleLiveVideo}
        className={`flex items-center justify-center p-2 font-bold text-white mb-2 disabled:cursor-not-allowed disabled:bg-gray-400  rounded w-36 ${
          toggleRecordedVideo ? "bg-red-500" : "bg-gray-700"
        }`}
        onClick={() => {
          toggleRecordedVideo ? deleteVideo() : startRecord();
        }}
      >
        {toggleRecordedVideo ? (
          <>
            <IoTrashBinSharp className="mr-2 text-white" /> delete{" "}
          </>
        ) : (
          <>
            {" "}
            start record
            <PiRecordFill className="ml-2 text-red-500" />{" "}
          </>
        )}
      </button>

      {isCameraAllowed ? (
        <p className="text-red-500">
          No Camera detected check site permissions or your device camera
        </p>
      ) : (
        <>
          {toggleLiveVideo && (
            <div className="w-full">
              <p className="font-bold text-black ">
                {" "}
                remain time {remainTime}
              </p>
              <video
                id="video"
                className="w-64 mx-auto border-2 border-green-500 rounded "
                autoPlay
                ref={liveVideo}
              ></video>
            </div>
          )}
          {toggleRecordedVideo && (
            <div className="w-full">
              <video
                className="w-64 mx-auto border-2 border-gray-500 rounded "
                id="recorded"
                src={recordedVideoURL}
                controls
              ></video>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default VideoRecord;
