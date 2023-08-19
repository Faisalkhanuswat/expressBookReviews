const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    let { username, password } = req.body;
    if (username && password) {
        let isExist = users.filter((user => user.username === username));

        if (isExist.length > 0) {
            return res.status(404).json({ message: "User already exists!" });
        }
        else {
            users.push({ username, password });
            return res.status(200).json({ message: "Customer successfuly registerd. Now you can login." });
        }
    }
    //Write your code here
    return res.status(300).json({ message: "Yet to be implemented" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    //Write your code here

    let myPromise = new Promise((resolve, reject) => {
        if (Object.keys(books).length > 0) {
            resolve(books)
        } else {
            reject(new Error("Books shop is Empty!"));
        }
    })

    myPromise.then(fetchedBooks => {
        return res.status(200).json(fetchedBooks);
    }).catch(e => {
        return res.status(300).json({ message: e.message });
    })

    //   if(Object.keys(books).length > 0){
    //       return res.status(200).send(JSON.stringify(books, null, 4));
    //   }
    //   return res.status(300).json({message: "Book Shop is Empty!"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {

    //Write your code here
    let isbn = req.params.isbn;
    new Promise((resolve, reject) => {
        if (books[isbn]) {
            resolve(books[isbn]);
        }
        else {
            reject(new Error("Book not found with isbn " + isbn));
        }
    }).then(fetchedBook => {
        return res.status(200).json(fetchedBook);
    }).catch(e => {
        return res.status(300).json({ message: e.message });
    })

    //   if(books[isbn]) res.send(books[isbn]);
    //   else  res.json({message: "Book not found with isbn " + isbn});
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    //Write your code here
    let author = req.params.author;
    let booksByAuthor = [];
    for (let isbn in books) {
        if (books.hasOwnProperty(isbn)) {
            let book = books[isbn];
            if (book.author === author) booksByAuthor.push({ isbn, title: book.title, reviews: book.reviews });
        }
    }

    new Promise((resolve, reject) => {
        if (booksByAuthor.length > 0) {
            let response = {
                booksbyauthor: booksByAuthor
            }
            resolve(response);
        }
        else {
            reject(new Error("No books in shop by " + author));
        }
    }).then(fetchedBook => {
        return res.status(200).json(fetchedBook);
    }).catch(e => {
        return res.status(300).json({ message: e.message });
    })
    //   if(booksByAuthor.length > 0){
    //       let response = {
    //           booksbyauthor: booksByAuthor
    //       }
    //       res.send(JSON.stringify(response, null, 4));
    //   }
    //   else  res.json({message: "No books in shop by " + author});
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    //Write your code here
    let title = req.params.title;
    let booksByTitle = [];
    for (let isbn in books) {
        if (books.hasOwnProperty(isbn)) {
            let book = books[isbn];
            if (book.title === title) booksByTitle.push({ isbn, author: book.author, reviews: book.reviews });
        }
    }
    new Promise((resolve, reject) => {
        if (booksByTitle.length > 0) {
            let response = {
                booksbytitler: booksByTitle
            }
            resolve(response);
        }
        else {
            reject(new Error("No books in shop by " + title));
        }
    }).then(fetchedBook => {
        return res.status(200).json(fetchedBook);
    }).catch(e => {
        return res.status(300).json({ message: e.message });
    })
    // if (booksByTitle.length > 0) {
    //     let response = {
    //         booksbytitler: booksByTitle
    //     }
    //     res.send(JSON.stringify(response, null, 4));
    // }
    // else res.json({ message: "No books in shop by " + title });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    //Write your code here
    let isbn = req.params.isbn;

    if (books[isbn]) return res.send(books[isbn].reviews);
    else return res.json({ message: "No book in shop with " + isbn })
});

module.exports.general = public_users;
