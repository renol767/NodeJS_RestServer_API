const express = require("express");
const MongoClient = require('mongodb').MongoClient;

const app = express();

app.use(express.json());
var database;

// Buat Port untuk Koneksi untuk MongoDB
app.listen(8080, () => {
    MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true }, (error, results) => {
        if (error) throw error
        database = results.db('dbbook');
        console.log('Connection Successfull');
    });
})

// GET Method
app.get('/api/books', (req, resp) => {
    database.collection('books').find({}).toArray((err, results) => {
        if (err) throw err
        resp.send(results);
    });
});

// GET Method using Params
app.get('/api/books/:id', (req, resp) => {
    database.collection('books').find({id: parseInt(req.params.id)}).toArray((err, results) => {
        if (err) throw err
        resp.send(results);
    });
});

// POST Method
app.post('/api/books/addBook', (req, resp) => {
    let res = database.collection('books').find({}).sort({ id: -1 }).limit(1);
    res.forEach(obj => {
        if (obj) {
            let book = {
                id: obj.id + 1,
                title: req.body.title
            }
            database.collection('books').insertOne(book, (err, results) => {
                if (err) resp.status(500).send(err);
                resp.send('Added Successfully');
            })
        }
    });
});

// PUT Method
app.put('/api/books/:id', (req, resp) => {
    let query = { id: parseInt(req.params.id) };
    let book = {
        id: parseInt(req.params.id),
        title: req.body.title
    }
    let dataSet = {
        $set: book
    }
    database.collection('books').updateOne(query, dataSet, (err, results) => {
        if (err) throw err
        resp.send(book);
    });
});

// DELETE Method
app.delete('/api/books/:id', (req, resp) => {
    database.collection('books').deleteOne({ id: parseInt(req.params.id) }, (err, results) => {
        if (err) throw err
        resp.send('Books is Deleted');
    });
});

