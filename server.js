const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors()); // Vercel fi Render akka walqunnamaan godha

// 1. Bakka Nagaheen (Receipt) Itti Olfe'amu (Uploads Folder)
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, 'FGT-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Array yeroo gabaabaaf data keessa kaayan (Database bilisaa malee qorachuuf)
let users = [];
let registrations = [];

// 2. API Galmee (Sign Up Backend)
app.post('/api/signup', (req, res) => {
  const { fullName, emailOrPhone, password } = req.body;
  
  if (!fullName || !emailOrPhone || !password) {
    return res.status(400).json({ success: false, message: "Maaloo kutaalee hunda guutaa!" });
  }

  const newUser = { id: users.length + 1, fullName, emailOrPhone, password };
  users.push(newUser);
  console.log("Miseensi haaraan galmaa'eera:", newUser);
  
  res.status(201).json({ success: true, message: "Milkaa'inaan galmooftaniittu! Amma dandeessu." });
});

// 3. API Unka Leenjii (Registration Form Backend)
app.post('/api/register-training', (req, res) => {
  const { trainingType, deliveryMethod, planSelected } = req.body;
  
  const newReg = { id: registrations.length + 1, trainingType, deliveryMethod, planSelected, date: new Date() };
  registrations.push(newReg);
  console.log("Galmeen Leenjii Haaraa:", newReg);

  res.status(200).json({ success: true, message: "Unki galmee keessan fudhatameera!" });
});

// 4. API Nagahee Fe'uu (Upload Receipt Backend)
app.post('/api/upload-receipt', upload.single('receipt'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "Maaloo failii nagahee filadhaa!" });
  }
  
  console.log("Nagaheen olfe'ameera, maqaan failii:", req.file.filename);
  res.status(200).json({ success: true, message: "Nagaheen keessan milkaa'inaan ergameera!" });
});

// Server Hojjechiisuuf
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server FGT Port ${PORT} irratti hojjechaa jira.`));
