const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
let validuser = users.filter(user => user.username === username && user.password === password);
if(validuser.length > 0){
    return true;
}
else return false;

}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  let {username, password} = req.body;

  if(!username && !password){
      return res.status(404).json({message: "Error Loging in"});
  }
  if(authenticatedUser(username, password)){
      let accessToken = jwt.sign({
          data: username 
      }, 'access', {expiresIn: 60*60});

      req.session.authorization = {
          accessToken, username
      }
      return res.status(200).json({'message': 'Customer successfully loged in'});
  }
  else{
      return res.status(208).json({'message': 'Invalid login. Check username and password'})
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    let isbn = req.params.isbn;
    let review = req.query.review
    if(books[isbn]){
    const existingReviews = books[isbn].reviews;
    const newReviewId = req.user.data;
        existingReviews[newReviewId] = review

    return res.status(200).json({'message': "The review for the book "+ isbn + " has been Added/updated."});
    }
    else return res.status(208).json({'message': "Book not found with isbn" + isbn});
  //Write your code here
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    let isbn = req.params.isbn;
    let review = req.query.review
    if(books[isbn]){
    const existingReviews = books[isbn].reviews;
    delete existingReviews[req.user.data];
    return res.status(200).json({'message': "Review for the  isbn"+ isbn + " Posted by user "+ req.user.data +" deleted."});
    }
    else return res.status(208).json({'message': "Book not found with isbn" + isbn});
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
