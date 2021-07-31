const express = require("express");
const MongoClient = require('mongodb').MongoClient;

const app = express();
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

app.use(express.json());
var database;

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Node JS API Project using MongoDB',
            version: '1.0.0'
        },
        servers: [
            {
                url: 'http://localhost:8080/'
            }
        ]
    },
    apis: ['./index.js']
};

const swaggerSpec = swaggerJSDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Buat Port untuk Koneksi untuk MongoDB
app.listen(8080, () => {
    MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true }, (error, results) => {
        if (error) throw error
        database = results.db('dbbook');
        console.log('Connection Successfull');
    });
})

// Definisikan Schema
/**
 * @swagger
 * components:
 *      schemas:
 *          Book:
 *              type: object
 *              properties:
 *                  id:
 *                      type: integer
 *                  title:
 *                      type: string
 */

// Swagger for Get Method 'localhost:8080/'
/**
 * @swagger
 * /:
 *  get:
 *      summary: This api is used to check if get method is working or not
 *      description: This api is used to check if get method is working or not
 *      responses:
 *          200:
 *              description: To Test get Method. If Response Body Welcome to my API using MongoDB, the get method works 
 */

app.get('/', (req, resp) => {
    resp.send('Welcome to my API using MongoDB')
})

// Swagger for GET Method 'localhost:8080/api/books'
/**
 * @swagger
 * /api/books:
 *  get:
 *      summary: To get all books from MongoDB
 *      description: This api is used to fetch data from MongoDB
 *      responses:
 *          200:
 *              description: To Test get Method. this api is used to fetch data from MongoDB
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schemas/Book'
 */

// GET Method
app.get('/api/books', (req, resp) => {
    database.collection('books').find({}).toArray((err, results) => {
        if (err) throw err
        resp.send(results);
    });
});

// Swagger for GET Method 'localhost:8080/api/books/:id'
/**
 * @swagger
 * /api/books/{id}:
 *  get:
 *      summary: To get all books from MongoDB
 *      description: This api is used to fetch data from MongoDB
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: Numeric ID required
 *          schema:
 *              type: integer
 *      responses:
 *          200:
 *              description: To Test get Method. this api is used to fetch data from MongoDB
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schemas/Book'
 */

// GET Method using Params
app.get('/api/books/:id', (req, resp) => {
    database.collection('books').find({id: parseInt(req.params.id)}).toArray((err, results) => {
        if (err) throw err
        resp.send(results);
    });
});

// Swagger for POST Method 'localhost:8080/api/books/addBook'
/**
 * @swagger
 * /api/books/addBook:
 *  post:
 *      summary: used to insert data to MongoDB
 *      description: This api is used to insert data to MongoDB
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schemas/Book'
 *      responses:
 *          200:
 *              description: Added Successfully
 */

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

// Swagger for PUT Method 'localhost:8080/api/books/:id'
/**
 * @swagger
 * /api/books/{id}:
 *  put:
 *      summary: used to update data to MongoDB
 *      description: This api is used to update data to MongoDB
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: Numeric ID required
 *          schema:
 *              type: integer
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schemas/Book'
 *      responses:
 *          200:
 *              description: Updated Successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schemas/Book'
 */

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

// Swagger for DELETE Method 'localhost:8080/api/books/:id'
/**
 * @swagger
 * /api/books/{id}:
 *  delete:
 *      summary: To delete book from MongoDB
 *      description: This api is used to delete data from MongoDB
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: Numeric ID required
 *          schema:
 *              type: integer
 *      responses:
 *          200:
 *              description: data is Deleted
 */

// DELETE Method
app.delete('/api/books/:id', (req, resp) => {
    database.collection('books').deleteOne({ id: parseInt(req.params.id) }, (err, results) => {
        if (err) throw err
        resp.send('Books is Deleted');
    });
});

