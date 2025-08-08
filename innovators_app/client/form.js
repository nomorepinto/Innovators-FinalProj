// Form handling and modal logic

fetch('certificate_response.json')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log("Loaded JSON data:", data);

    // Example: use the JSON to populate something in HTML
    const container = document.getElementById('json-output');
    container.textContent = JSON.stringify(data, null, 2);
  })
  .catch(error => {
    console.error("Failed to load JSON:", error);
  });


async function autofillCertificateForm() {
    try {
        const response = await fetch('certificate_response.json');
        if (!response.ok) throw new Error('Failed to load certificate data');
        const cert = await response.json();
        const data = cert.data || {};

        // Map JSON fields to form input IDs
        const mapping = {
            'Last Name': 'lastName',
            'First Name': 'firstName',
            'Middle Name': 'middleName',
            'Nationality': 'nationality',
            'Sex': 'sex',
            'Date of Birth': 'dateOfBirth',
            'Address': 'address'
        };

        // Set values for mapped fields
        Object.entries(mapping).forEach(([jsonKey, inputId]) => {
            const el = document.getElementById(inputId);
            if (el) {
                if (inputId === 'sex') {
                    el.value = data['Sex'] === 'M' ? 'Male' : (data['Sex'] === 'F' ? 'Female' : '');
                } else if (inputId === 'dateOfBirth') {
                    el.value = data['Date of Birth'] ? data['Date of Birth'].replace(/\//g, '-') : '';
                } else {
                    el.value = data[jsonKey] || '';
                }
            }
        });

        // Full Name
        const fullNameEl = document.getElementById('fullName');
        if (fullNameEl) {
            fullNameEl.value = `${data['First Name'] || ''} ${data['Middle Name'] || ''} ${data['Last Name'] || ''}`.trim();
        }

        // Lock the fields after populating
        ['lastName', 'firstName', 'middleName', 'fullName', 'nationality', 'sex', 'dateOfBirth', 'address'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.readOnly = true;
                if (element.tagName.toLowerCase() === 'select') {
                    element.disabled = true;
                }
            }
        });
    } catch (error) {
        console.error('Error autofilling certificate form:', error);
    }
}

// Function to load certificate data
async function loadCertificateData() {
    try {
        const response = await fetch('certificate_response.json');
        if (!response.ok) throw new Error('Failed to load certificate data');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error loading certificate data:', error);
        return null;
    }
}

function setupFileUpload(inputId, previewId) {
    const input = document.getElementById(inputId);
    if (!input) return; // Prevent error if inputId does not exist
    const preview = document.getElementById(previewId);
    const formItem = input.closest('.form-item');
    const checkbox = formItem ? formItem.querySelector('input[type="checkbox"]') : null;
    input.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            if (checkbox) checkbox.checked = true;
            if (preview) {
                preview.innerHTML = `
                    <div class="file-preview">
                        <i class="fas fa-file-alt"></i>
                        <div>
                            <div><strong>${file.name}</strong></div>
                            <div>${(file.size/1024/1024).toFixed(2)} MB</div>
                        </div>
                    </div>
                `;
            }
        }
    });
}

// Initialize all file uploads
// setupFileUpload('certificateUpload', 'certificatePreview');
// setupFileUpload('validIdUpload', 'validIdPreview');
// setupFileUpload('addressProofUpload', 'addressProofPreview');
// setupFileUpload('dtiCertUpload', 'dtiCertPreview');
// setupFileUpload('mayorsPermitUpload', 'mayorsPermitPreview');
setupFileUpload('addressProofUpload', 'addressProofPreview');
setupFileUpload('doc1Upload', 'doc1Preview');
setupFileUpload('doc2Upload', 'doc2Preview');
setupFileUpload('doc3Upload', 'doc3Preview');
setupFileUpload('doc4Upload', 'doc4Preview');

// Drag and drop functionality
document.querySelectorAll('.upload-area').forEach(area => {
    area.addEventListener('dragover', (e) => {
        e.preventDefault();
        area.style.borderColor = '#3498db';
        area.style.backgroundColor = '#e8f4fd';
    });

    area.addEventListener('dragleave', () => {
        area.style.borderColor = '#ccc';
        area.style.backgroundColor = '#fafafa';
    });

    area.addEventListener('drop', (e) => {
        e.preventDefault();
        area.style.borderColor = '#ccc';
        area.style.backgroundColor = '#fafafa';
        
        const fileInput = area.nextElementSibling;
        if (fileInput && fileInput.type === 'file') {
            fileInput.files = e.dataTransfer.files;
            const event = new Event('change');
            fileInput.dispatchEvent(event);
        }
    });
});

// Checkbox toggle styling
document.querySelectorAll('.checkbox-label').forEach(label => {
    label.addEventListener('click', function() {
        const checkbox = this.previousElementSibling;
        checkbox.checked = !checkbox.checked;
    });
});

function generateModal(data) {
    if (!data) {
        console.error('No data provided to generateModal');
        return;
    }
    
    console.log('Populating form with data:', data);
    
    // Simple direct assignments matching the JSON structure
    document.getElementById('lastName').value = data['Last Name'] || '';
    document.getElementById('firstName').value = data['First Name'] || '';
    document.getElementById('middleName').value = data['Middle Name'] || '';
    document.getElementById('fullName').value = `${data['First Name']} ${data['Middle Name']} ${data['Last Name']}`;
    document.getElementById('nationality').value = data['Nationality'] || '';
    document.getElementById('sex').value = data['Sex'] === 'M' ? 'Male' : 'Female';
    document.getElementById('dateOfBirth').value = formatDate(data['Date of Birth']) || '';
    document.getElementById('address').value = data['Address'] || '';

    // Lock the fields after populating
    ['lastName', 'firstName', 'middleName', 'fullName', 'nationality', 'sex', 'dateOfBirth', 'address'].forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.readOnly = true;
            if (element.tagName.toLowerCase() === 'select') {
                element.disabled = true;
            }
        }
    });
    
    console.log('Form fields populated and locked');
}

// Helper function to format date from YYYY/MM/DD to YYYY-MM-DD (HTML date input format)
function formatDate(dateString) {
    if (!dateString) return '';
    return dateString.replace(/\//g, '-');
}



function generateJSON() {
  const form = document.getElementById("bsmeForm");
  const outputBox = document.getElementById("outputBox");

  const data = {
    lastName:  form.lastName.value,
    firstName: form.firstName.value,
    middleName: form.middleName.value,
    nationality: form.nationality.value,
    fullName: form.fullName.value,
    sex: form.sex.value,
    dateOfBirth: form.dateOfBirth.value,
    address: form.address.value,
    "Business Name": form.businessName.value,
    "Business Address": form.businessAddress.value,
    "Business Barangay": form.businessBarangay.value,
    "Office Contact Number": form.officeContactNumber.value,
    "Business Zip Code": form.businessZipCode.value,
    x: 'x',
    "Office Email": form.officeEmail.value,
  };

  let response = JSON.stringify(data, null, 2)
  console.log(response);
  closeModal();
}

// Modal and Autofill logic
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.querySelector('.js-modal-permit');
    const openModalBtn = document.getElementById('openModalBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');

    if (openModalBtn) {
        openModalBtn.addEventListener('click', async () => {
            if (modal) {
                const certificateData = await loadCertificateData();
                if (certificateData && certificateData.data) {
                    generateModal(certificateData.data);
                    modal.classList.add('visible');
                } else {
                    console.error('Failed to load certificate data');
                }
            }
        });
    }

    if (closeModalBtn && modal) {
        closeModalBtn.addEventListener('click', () => {
            modal.classList.remove('visible');
        });
    }

    // Add CSS for modal visibility if not already present
    if (!document.querySelector('#modal-styles')) {
        const style = document.createElement('style');
        style.id = 'modal-styles';
        style.textContent = `
            .js-modal-permit { display: none; }
            .js-modal-permit.visible { display: block; }
        `;
        document.head.appendChild(style);
    }
});




function closeModal() {
    const modalEl = document.querySelector('.js-modal');
    if (modalEl) modalEl.classList.remove('visible');
}