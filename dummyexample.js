const express = require("express");

const app = express();

app.use(express.json());

// Data Dummy
const books = [
    {
        id: 1,
        title: 'Java Programming',
    },
    {
        id: 2,
        title: 'C# Programming'
    },
    {
        id: 3,
        title: 'NodeJS Programming'
    }
]

// app.get('/', (req, resp) => {
//     resp.send('Welcome to my API');
// });

// Get API using Data Dummy
app.get('/api/example', (req, resp) => {
    resp.send(books);
});

// Get API using Data Dummy and Parameters
app.get('/api/example/:id', (req, resp) => {
    const book = books.find(a => a.id === parseInt(req.params.id));
    if (!book) resp.status(404).send('Books not found');
    resp.send(book);
});

// Post Request
app.post('/api/example/addBook', (req, resp) => {
    const book = {
        id: books.length + 1,
        title: req.body.title
    }
    books.push(book);
    resp.send(book);
});

// Put Request
app.put('/api/example/:id', (req, resp) => {
    const book = books.find(a => a.id === parseInt(req.params.id));
    if (!book) resp.status(404).send('Books not found');

    book.title = req.body.title;

    resp.send(book);
});

// Delete Request
app.delete('/api/example/:id', (req, resp) => {
    const book = books.find(a => a.id === parseInt(req.params.id));
    if (!book) resp.status(404).send('Books not found');

    const index = books.indexOf(book);
    books.splice(index, 1);
    resp.send(book);
});

app.listen(8080);