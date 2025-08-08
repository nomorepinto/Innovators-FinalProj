const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
const path = require('path');

const https = require("https");

const options = {
  method: "POST",
  hostname: "us1.pdfgeneratorapi.com",
  path: "/api/v4/documents/generate",
  headers: {
    Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJlY2JmYzYxN2FlMGY3MWU0MDg4NzcxMzIzNjNkMGIzZTRkZGI3MTIzNTQwNjc2MDU0YTBlZjk1NmE0YmIwYWI5Iiwic3ViIjoiam9obmJlbmVkaWN0dmlkYUBnbWFpbC5jb20iLCJleHAiOjE3NTQ2MTc4MzN9.s7hr1cKQd9oQvPKbyzdka5gFdPNTAaQS2-0tsUxZhZo",
    "Content-Type": "application/json",
  },
};

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Multer setup for PDF and image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ 
    storage, 
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg'];
        if (allowedTypes.includes(file.mimetype)) cb(null, true);
        else cb(new Error('Only PDF, PNG, or JPEG files are allowed!'));
    }
});

// POST: Upload file, respond with filename
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded or wrong file type.' });
    res.json({ message: 'File uploaded successfully!', filename: req.file.filename });
});

// GET: Process file and return JSON from Rev21Labs
app.get('/result/:filename', async (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'uploads', filename);

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'File not found.' });
    }

    try {
        const formData = new FormData();
        formData.append('file', fs.createReadStream(filePath), filename);

        const response = await axios.post( //MOST IMPORTANT OBJECT
            'https://ai-tools.rev21labs.com/api/v1/vision/document-scan',
            formData,
            {
                headers: {
                    ...formData.getHeaders(),
                    'x-api-key': process.env.REV21APIKEY
                }
            }
        );

        console.log(response.data); // Log in Node terminal
        console.log(response.data.data["First Name"]);
        res.json({ message: 'File processed successfully!', result: response.data });
        // Save Rev21Labs response to uploads folder
    const clientJsonPath = path.join(__dirname, '..', 'client', 'certificate_response.json');
    fs.writeFileSync(clientJsonPath, JSON.stringify(response.data, null, 2));
    console.log("✅ Rev21Labs response saved to:", clientJsonPath);
        
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

        const firstName = response.data.data["First Name"];
        const middleName = response.data.data["Middle Name"];
        const lastName = response.data.data["Last Name"];
        const fullName = `${firstName} ${middleName} ${lastName}`;
        const sex = response.data.data["Sex"];
        const dateOfBirth = response.data.data["Date of Birth"];
        const nationality = response.data.data["Nationality"];
        const address = response.data.data["Address"];

        const data = {
        lastName,
        firstName,
        middleName,
        nationality,
        fullName,
        sex,
        dateOfBirth,
        address,
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
    

    } catch (err) {
        console.error('Rev21Labs error:', err.response?.data || err.message);
        res.status(500).json({ error: 'Failed to process file.', details: err.response?.data || err.message });
    }
});

//start of pdf api thing







app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});