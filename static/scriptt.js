document.addEventListener('DOMContentLoaded', function () {
    const textOptions = document.getElementById('text-options');
    const textUrlButton = document.getElementById('text-url-button');
    const textFileButton = document.getElementById('text-file-button');
    const textUrlForm = document.getElementById('text-url-form');
    const textFileForm = document.getElementById('text-file-form');
    const textUploadForm = document.getElementById('text-upload-form');
    const textManuscriptContainer = document.getElementById('text-manuscript-container');
    const textManuscript = document.getElementById('text-manuscript');
    const textManuscriptTop = document.querySelector('.manuscript-top');
    const textManuscriptBottom = document.querySelector('.manuscript-bottom');
    const textSummaryText = document.getElementById('text-summary-text');
    const textBackButton = document.getElementById('text-backButton');
    const textResultDiv = document.getElementById('text-result');
    const voiceUploadForm = document.getElementById('voice-upload-form');
    const voiceResultDiv = document.getElementById('voice-summary-text');
    const gif = document.getElementById('gif');

    function showGif() {
        gif.style.display = 'block';
    }

    function hideGif() {
        gif.style.display = 'none';
    }

    if (textUrlButton) {
        textUrlButton.addEventListener('click', function () {
            textOptions.style.display = 'none';
            textUrlForm.style.display = 'block';
            textBackButton.style.display = 'block';
        });
    }

    if (textFileButton) {
        textFileButton.addEventListener('click', function () {
            textOptions.style.display = 'none';
            textFileForm.style.display = 'block';
            textBackButton.style.display = 'block';
        });
    }

    if (textBackButton) {
        textBackButton.addEventListener('click', function () {
            textSummaryText.innerHTML = '';
            textManuscriptContainer.style.visibility = 'hidden';
            textManuscript.classList.remove('open');
            textManuscriptTop.classList.remove('move-up', 'visible');
            textManuscriptBottom.classList.remove('move-down', 'visible');
            textUrlForm.style.display = 'none';
            textFileForm.style.display = 'none';
            textBackButton.style.display = 'none';
            textOptions.style.display = 'block';
            textResultDiv.innerHTML = '';
            window.history.back();
        });
    }

    if (textUrlForm) {
        textUrlForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const formData = new FormData(event.target);
            textManuscriptTop.classList.add('visible');
            textManuscriptBottom.classList.add('visible');
            fetch('/upload-url', { method: 'POST', body: formData })
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        textResultDiv.innerHTML = `<p style="color: red;">Error: ${data.error}</p>`;
                    } else {
                        textSummaryText.innerHTML = data.Summary;
                        textManuscriptContainer.style.visibility = 'visible';
                        textUrlForm.style.display = 'none';
                        textManuscript.classList.add('open');
                        textManuscriptTop.classList.add('move-up');
                        textManuscriptBottom.classList.add('move-down');
                    }
                })
                .catch(error => {
                    textResultDiv.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
                    console.error('Error:', error);
                });
        });
    }

    if (textFileForm) {
        textFileForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const formData = new FormData(event.target);
            textManuscriptTop.classList.add('visible');
            textManuscriptBottom.classList.add('visible');
            fetch('/upload', { method: 'POST', body: formData })
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        textResultDiv.innerHTML = `<p style="color: red;">Error: ${data.error}</p>`;
                    } else {
                        textSummaryText.innerHTML = data.Summary;
                        textManuscriptContainer.style.visibility = 'visible';
                        textFileForm.style.display = 'none';
                        textManuscript.classList.add('open');
                        textManuscriptTop.classList.add('move-up');
                        textManuscriptBottom.classList.add('move-down');
                    }
                })
                .catch(error => {
                    textResultDiv.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
                    console.error('Error:', error);
                });
        });
    }

    if (textUploadForm) {
        textUploadForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const formData = new FormData(event.target);
            textManuscriptTop.classList.add('visible');
            textManuscriptBottom.classList.add('visible');
            fetch('/upload', { method: 'POST', body: formData })
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        textResultDiv.innerHTML = `<p style="color: red;">Error: ${data.error}</p>`;
                    } else {
                        textSummaryText.innerHTML = data.Summary;
                        textManuscriptContainer.style.visibility = 'visible';
                        textUploadForm.style.display = 'none';
                        textManuscript.classList.add('open');
                        textManuscriptTop.classList.add('move-up');
                        textManuscriptBottom.classList.add('move-down');
                    }
                })
                .catch(error => {
                    textResultDiv.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
                    console.error('Error:', error);
                });
        });
    }

    // Adding event listener for the Clear button for Voice Summarization
    const clearButton = document.getElementById('clear');
    if (clearButton) {
        clearButton.addEventListener('click', function () {
            // Clear the summarized text
            voiceResultDiv.innerHTML = '';

            // Reset the form
            voiceUploadForm.reset();

            // Hide the GIF
            hideGif();
        });
    }

    // Voice upload form submission
    if (voiceUploadForm) {
        voiceUploadForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const formData = new FormData(event.target);
            showGif();
            fetch('/upload', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                hideGif();
                if (data.error) {
                    voiceResultDiv.innerHTML = `<p style="color: red;">Error: ${data.error}</p>`;
                } else {
                    voiceResultDiv.innerHTML = data.Summary;
                }
            })
            .catch(error => {
                hideGif();
                voiceResultDiv.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
                console.error('Error:', error);
            });
        });
    }
});




