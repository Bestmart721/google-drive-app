const express = require('express');
const { google } = require('googleapis');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
require('dotenv').config();

const app = express();
const upload = multer({ dest: 'uploads/' });

const credentials = require('./client_secret_467903588298-het3b6tu7lgo2i9svc2hr12jnn4f19jv.apps.googleusercontent.com.json');
const { client_id, client_secret, redirect_uris } = credentials.web;

const oAuth2Client = new google.auth.OAuth2(
  client_id, client_secret, 'http://localhost:3000/oauth2callback'
);

let drive;

// Setup view
app.set('view engine', 'ejs');

// Routes
app.get('/', async (req, res) => {
  if (!drive) {
    const url = oAuth2Client.generateAuthUrl({ scope: ['https://www.googleapis.com/auth/drive'] });
    return res.redirect(url);
  }

  const files = await drive.files.list({
    fields: 'files(id, name, mimeType, modifiedTime)',
  });

  res.render('index', { files: files.data.files });
});

app.get('/oauth2callback', async (req, res) => {
  const { tokens } = await oAuth2Client.getToken(req.query.code);
  oAuth2Client.setCredentials(tokens);
  drive = google.drive({ version: 'v3', auth: oAuth2Client });
  res.redirect('/');
});

// Upload
app.post('/upload', upload.single('file'), async (req, res) => {
  const fileMetadata = { name: req.file.originalname };
  const media = {
    mimeType: req.file.mimetype,
    body: fs.createReadStream(req.file.path),
  };

  await drive.files.create({ resource: fileMetadata, media });
  fs.unlinkSync(req.file.path);
  res.redirect('/');
});

// Download
app.get('/download/:id', async (req, res) => {
  const dest = fs.createWriteStream(`./downloads/${req.params.id}.download`);
  const result = await drive.files.get({ fileId: req.params.id, alt: 'media' }, { responseType: 'stream' });
  result.data.pipe(dest);
  dest.on('finish', () => res.download(dest.path));
});

// Delete
app.get('/delete/:id', async (req, res) => {
  await drive.files.delete({ fileId: req.params.id });
  res.redirect('/');
});

app.listen(process.env.PORT, () => console.log(`Server running on http://localhost:${process.env.PORT}`));
