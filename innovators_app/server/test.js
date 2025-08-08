const https = require("https");
const fs = require("fs");

const options = {
  method: "POST",
  hostname: "us1.pdfgeneratorapi.com",
  path: "/api/v4/documents/generate",
  headers: {
    Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiI3MzI1ODRhMzVkY2U2M2FkY2RmMTM1OTZhNmVlY2EyMWQ0MDQyMmMxMzNiZmUxNDhlOWRhMjZjMmQzMGJhNjZkIiwic3ViIjoiam9obmJlbmVkaWN0dmlkYUBnbWFpbC5jb20iLCJleHAiOjE3NTQ1OTQwODV9.8d_dN8Xjo0_zqJoJ9C3fuvsvaWtmGXMVLEfGsKJbAsU",
    "Content-Type": "application/json",
  },
};

const req = https.request(options, function (res) {
  const chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function () {
    const body = Buffer.concat(chunks).toString();

    try {
      const json = JSON.parse(body);
      const pdfUrl = json.response;

      console.log("PDF generated at:", pdfUrl);

      // Now download the file
      const file = fs.createWriteStream("samples/certificate.pdf");
      https.get(pdfUrl, (fileRes) => {
        fileRes.pipe(file);
        file.on("finish", () => {
          file.close();
          console.log("✅ PDF saved to: certificate.pdf");
        });
      }).on("error", (err) => {
        console.error("❌ Error downloading PDF:", err.message);
      });
    } catch (e) {
      console.error("❌ Failed to parse response:", e);
      console.error("Raw response:", body);
    }
  });
});

const firstName = "Burat";
const middleName = "Burat";
const lastName = "Ocenar";
const fullName = `${firstName} ${middleName} ${lastName}`;
const sex = "Male";
const dateOfBirth = "2006/01/22";
const nationality = "PH";
const data = {
  lastName,
  firstName,
  middleName,
  nationality,
  fullName,
  sex,
  dateOfBirth,
  address: "123 Mabini St., Pasig City, Metro Manila",
  "Business Name": "Ocenar Tech Solutions",
  "Business Address": "Unit 4B, 8th Ave., Pasig City, Metro Manila",
  "Business Barangay": "Barangay San Antonio",
  "Office Contact Number": "(02) 8123-4567",
  "Business Zip Code": "1605",
  x: "x",
  "Office Email": "contact@ocenartech.com"
};

req.write(
  JSON.stringify({
    template: {
      id: "1479146",
      data: data
    },
    format: "pdf",
    output: "url",
    name: "Certificate Example"
  })
);


req.end();
