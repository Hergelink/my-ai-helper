const path = require('path');
const express = require('express');
const dotenv = require('dotenv').config();
const port = process.env.PORT || 4000;

const app = express();

// Enable body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));



// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

app.use('/openai', require('./routes/openaiRoutes'));

app.get('/', function (req, res) {
    res.sendFile('index.html')
})

app.get('/faq', function (req, res) {
    res.sendFile('faq.html')
})

app.get('/ai-helper', function (req, res) {
    res.sendFile(path.join(__dirname, './public/ai-helper.html'))
})


//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function(req, res){
    res.status(404).send('🤖: 404 - Bep-Bop-Bip - Page Not Found!');
  });


app.listen(port, () => console.log(`Server started on port ${port}`));