chrome.runtime.onMessage.addListener((request, _ , sendResponse) => {
    if (request.action === "makeRequest") {
                console.log(request.imageData)
                // Convert base64 image data to Blob
                const byteCharacters = atob(request.imageData.split(',')[1]);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: 'image/png' });

                // Create a File object
                const imageFile = new File([blob], 'captured_image.png', { type: 'image/png' });
                // Now you can save or process the captured image file as needed
                const formData = new FormData();
                formData.append('image', imageFile);
                console.log(imageFile)

        chrome.storage.local.get(["tabLock"], async (result) => {
            // Handle tabLock result here
            const resp = await fetch('http://localhost:5000/test', {
                method: 'POST',
                headers: {
                    Authorization: `${result.tabLock}`
                },
                body:formData,
            
            });
            const data = await resp.json();
            sendResponse(data);
        });
        return true;
    }
  });