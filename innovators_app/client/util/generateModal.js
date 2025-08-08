function generateModal(jsonData) {
  const d = jsonData.data || {};

  const modalHTML = `
    <div class="modal-content">
      <span id="closeModalBtn" class="close">&times;</span>
      <h3>BSME Registration Form</h3>
      <form id="bsmeForm">
        <div class="form-grid">
          <input type="text" id="lastName" placeholder="Last Name" value="" required>
          <input type="text" id="firstName" placeholder="First Name" value="" required>
          <input type="text" id="middleName" placeholder="Middle Name" value="">
          <input type="text" id="fullName" placeholder="Full Name" value="">
          <input type="text" id="nationality" placeholder="Nationality" value="">
          <select id="sex" required>
            <option value="" selected>Sex</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <input type="date" id="dateOfBirth" value="" required>
          <input type="text" id="address" placeholder="Home Address" value="">
          <input type="text" id="businessName" placeholder="Business Name" required>
          <input type="text" id="businessAddress" placeholder="Business Address">
          <input type="text" id="businessBarangay" placeholder="Business Barangay">
          <input type="text" id="businessZipCode" placeholder="Business Zip Code">
          <input type="text" id="officeContactNumber" placeholder="Office Contact No.">
          <input type="email" id="officeEmail" placeholder="Office Email">
        </div>
        <button type="button" onclick="generateJSON()">Generate JSON</button>
        <button type="button" onclick="autofillAndLock()">Autofill & Lock</button>
      </form>
    </div>
  `;

  document.querySelector('.js-modal-permit').innerHTML = modalHTML;
}