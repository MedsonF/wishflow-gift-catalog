// backend/upload.js (exemplo)
const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const upload = multer({ dest: path.join(__dirname, '../img') }); // pasta img na raiz

app.post('/upload', upload.single('image'), (req, res) => {
  res.json({ filename: req.file.filename, path: `/img/${req.file.filename}` });
});

app.use('/img', express.static(path.join(__dirname, '../img')));

app.listen(4000, () => console.log('Backend rodando na porta 4000'));
