const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
    
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
      });
      if(validusers.length > 0){
        return true;
      } else {
        return false;
      }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
  
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
  
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //Check username of logged in user
    current = req.session.authorization['username'];

    let newReview = [];
    newReview[current] =  req.body.review;

    isbn = req.params.isbn;
    
    // find all reviews of book, if poster is unique, add else update
    for (var key in books) {
        var obj = books[key];
        if(obj["isbn"] == isbn) {
         obj['reviews'][current] = req.body.review;
            
         res.send(JSON.stringify(obj,null,4));          
        }
     }

    return;
  
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    //Check username of logged in user
    current = req.session.authorization['username'];

    isbn = req.params.isbn;
    
    // find all reviews of book, if poster is unique, add else update
    for (var key in books) {
        var obj = books[key];
        if(obj["isbn"] == isbn) {
         delete obj['reviews'][current];
         res.send(JSON.stringify(obj,null,4));          
        }
     }

    return;
  
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.authenticatedUser = authenticatedUser;
