chrome.storage.local.get(["urls"], (result) => {
  const index = result.urls.findIndex(
    (url) => window.location.hostname === url
  );
  if (index > -1) {
    // Check if the browser supports getUserMedia
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
                console.log(response)
                if (response && !response.result) {
                 renderError("")
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
          renderError("Check Your Camera")
          console.error("Error accessing camera:", error);
        });
    } else {
             renderError("Check Your Camera")
    }
  } else {
    console.log("Not restricted");
  }
});


function renderError(str){
  document.body.innerHTML = `<h1>Access Denied ${str}</h1>`;
  document.body.style.backgroundColor = "red";
  document.body.style.textAlign = "center";
  document.getElementsByTagName("h1")[0].style.fontSize = "5em";
  document.getElementsByTagName("h1")[0].style.marginTop = "5em";
  document.getElementsByTagName("h1")[0].style.padding = "0.5em";
  document.getElementsByTagName("h1")[0].style.color = "white";
}