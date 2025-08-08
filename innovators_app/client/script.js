document.getElementById('fileInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const uploadedFileDiv = document.getElementById('uploadedFile');
        uploadedFileDiv.innerHTML = `
            <div class="alert alert-success">
                <strong>${file.name}</strong> (${(file.size/1024/1024).toFixed(2)} MB) selected
            </div>
        `;
    }
});

// Handle drag and drop
const uploadArea = document.querySelector('.upload-area');
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#0d6efd';
    uploadArea.style.backgroundColor = '#f0f7ff';
});
uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.borderColor = '#ccc';
    uploadArea.style.backgroundColor = '';
});
uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#ccc';
    uploadArea.style.backgroundColor = '';
    const file = e.dataTransfer.files[0];
    if (file) {
        document.getElementById('fileInput').files = e.dataTransfer.files;
        const uploadedFileDiv = document.getElementById('uploadedFile');
        uploadedFileDiv.innerHTML = `
            <div class="alert alert-success">
                <strong>${file.name}</strong> (${(file.size/1024/1024).toFixed(2)} MB) selected
            </div>
        `;
    }
});

document.getElementById('submit-btn').addEventListener('click', async function() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    if (!file || !['application/pdf', 'image/png', 'image/jpeg'].includes(file.type)) {
        console.error('Please upload a PDF, PNG, or JPEG file.');
        return;
    }
    const formData = new FormData();
    formData.append('file', file);

    try {
        // Step 1: Upload the file
        const uploadResponse = await fetch('http://localhost:5000/upload', {
            method: 'POST',
            body: formData
        });
        const uploadResult = await uploadResponse.json();
        if (!uploadResponse.ok) {
            console.error('Upload error:', uploadResult.error || 'Upload failed.');
            return;
        }
        const filename = uploadResult.filename;

        // Step 2: Request processing from server
        const resultResponse = await fetch(`http://localhost:5000/result/${filename}`);
        const resultData = await resultResponse.json();
        if (resultResponse.ok) {
            console.log(resultData.result); // Log the JSON returned from Rev21Labs API
        } else {
            alert('Processing error: ' + (resultData.error || 'Processing failed.'));
        }
    } catch (err) {
        console.error('Fetch error:', err);
    }
});


