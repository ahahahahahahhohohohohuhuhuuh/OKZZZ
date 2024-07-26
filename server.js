const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

let contacts = [];
let id = 1;

app.get('/api/contacts', (req, res) => {
    res.json(contacts);
});

app.post('/api/contacts', (req, res) => {
    const contact = { id: id++, ...req.body };
    contacts.push(contact);
    res.status(201).json(contact);
});

app.put('/api/contacts/:id', (req, res) => {
    const { id } = req.params;
    const { name, phone, email } = req.body;
    const contact = contacts.find(contact => contact.id == id);
    if (contact) {
        contact.name = name;
        contact.phone = phone;
        contact.email = email;
        res.status(200).json(contact);
    } else {
        res.status(404).send('Contact not found');
    }
});

app.delete('/api/contacts/:id', (req, res) => {
    const { id } = req.params;
    contacts = contacts.filter(contact => contact.id != id);
    res.status(204).send();
});

// Send all other requests to the frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
