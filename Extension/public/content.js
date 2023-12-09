chrome.storage.local.get(["urls"], (result) => {
  const index = result.urls.findIndex(
    (url) => window.location.hostname === url
  );
  if (index > -1) {
    // const original = document.body.innerHTML;
    // Check if the browser supports getUserMedia
    // document.body.innerHTML = "<h1>Loading...</h1>";
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      // Request access to the user's camera
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          // Create a video element to display the camera stream
          const video = document.createElement("video");
          video.srcObject = stream;
          document.body.appendChild(video);

          // Wait for the video to load and play
          video.onloadedmetadata = () => {
            video.play();

            // Capture a frame from the video stream
            const canvas = document.createElement("canvas");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas
              .getContext("2d")
              .drawImage(video, 0, 0, canvas.width, canvas.height);

            // Get the image data from the canvas
            const imageData = canvas.toDataURL("image/png");

            chrome.runtime.sendMessage(
              { action: "makeRequest", imageData },
              (response) => {
                // Handle the response if needed
                if (chrome.runtime.lastError) {
                  console.error(chrome.runtime.lastError);
                  return;
                }

                if (response && !response.result) {
                  document.body.innerHTML = "<h1>Access Denied</h1>";
                  document.body.style.backgroundColor = "red";
                  document.body.style.textAlign = "center";
                  
                  document.getElementsByTagName("h1")[0].style.fontSize = "5em";
                  document.getElementsByTagName("h1")[0].style.marginTop = "5em";
                  document.getElementsByTagName("h1")[0].style.padding = "0.5em";
                  document.getElementsByTagName("h1")[0].style.color = "white";
                }
              }
            );

            // Stop the camera stream
            stream.getTracks().forEach((track) => track.stop());

            // Optionally, remove the video element from the DOM
            document.body.removeChild(video);
          };
        })
        .catch((error) => {
          console.error("Error accessing camera:", error);
        });
    } else {
      console.error("getUserMedia is not supported in this browser");
    }
  } else {
    console.log("Not restricted");
  }
});
