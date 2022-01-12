const express = require('express');
const app = express();
const path = require('path');
const multer  = require('multer')
const cors = require('cors')
app.use(cors())
const upload = multer({ dest: '../uploads/' })
// const svgjson = require('svgjson');
const svgjson = require('../svgJson/index');
const svgjsonRoot = '/svgjson';
const PORT = process.env.PORT || 8001;

app.use((req, res, next) => {
  console.log(`${req.method} : ${req._parsedUrl.path}`);
  next();
})
app.get(`${svgjsonRoot}/`, (req, res) => {
  res.sendFile(path.join(__dirname, './index.html'));
});

app.post(`${svgjsonRoot}/convert`, upload.single('file'), async (req, res) => {

  const otherInputs = {};
  if(req.body.outputFormat) otherInputs['outputFormat'] = req.body.outputFormat;
  if(req.body.unify) otherInputs['unifySvg'] = req.body.unify.indexOf('true') ? true : false;

  if(req.file) 
    svgjson.convert({input: path.join(__dirname, `./${req.file.path}`), ...otherInputs})
    .then(response => res.send(response))
    .catch(error => {
      console.error(error.stack?error.stack:error);
      res.status(400).send(error.stack?error.stack:error)
    });
  else 
    svgjson.convert({input: req.body.code, ...otherInputs})
    .then(response => res.send(response))
    .catch(error => {
      console.error(error.stack?error.stack:error);
      res.status(400).send(error.stack?error.stack:error)
    });
})



app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));