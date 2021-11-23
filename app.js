const express = require('express');
const app = express();
const path = require('path');
const multer  = require('multer')
const cors = require('cors')
app.use(cors())
const upload = multer({ dest: '../uploads/' })
const svgjson = require('svgjson');
const root = '/modules';
const svgjsonRoot = '/svgjson';
const PORT = process.env.PORT || 8001;

app.use((req, res, next) => {
  console.log(`${req.method} : ${req._parsedUrl.path}`);
  next();
})

app.get(`${root}${svgjsonRoot}/`, (req, res) => {
  res.sendFile(path.join(__dirname, './index.html'));
});

app.post(`${root}${svgjsonRoot}/convert`, upload.single('file'), async (req, res) => {
  if(req.file) svgjson({input: path.join(__dirname, `./${req.file.path}`)})
      .then(response => res.send(response))
      .catch(error => {
        console.log(error.stack?error.stack:error);
        res.status(400).send(error.stack?error.stack:error)
      })
  else svgjson({input: req.body.code})
      .then(response => res.send(response))
      .catch(error => {
        console.log(error.stack?error.stack:error);
        res.status(400).send(error.stack?error.stack:error)
      })
})



app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));