const connection = require('../database/sqlConnections');

var express = require('express'),
    router = express.Router();


    
    router.get("/authors" , (req , res) => {

        var getAllAuthors = "SELECT * FROM author;"
        connection.query(getAllAuthors , (err , result) => {
           if(err) {
               console.log(err.sqlMessage)
               res.redirect('back')
           }  else {
                res.render('author/show-all' , {authors: result});
           }
        })
        
    })
    router.get("/api/authors" , (req , res) => {

        var getAllAuthors = "SELECT * FROM author;"
        connection.query(getAllAuthors , (err , result) => {
           if(err) {
               res.json(err.sqlMessage)
               
           }  else {
               res.json(result);
           }
        })
        
    })

    router.delete("/remove/author/:id" , (req , res) => {
        var deleteAuthor = "DELETE FROM author WHERE authorid = '"+ req.params.id +"'";
        connection.query(deleteAuthor , (err , result) => {
           if(err) {
               console.log(err.sqlMessage)
               res.redirect('back')
           }  else {
                res.redirect('/authors');
           }
        })
        
    })

    router.delete("/api/remove/author/:id" , (req , res) => {
        var deleteAuthor = "DELETE FROM author WHERE authorid = '"+ req.params.id +"'";
        connection.query(deleteAuthor , (err , result) => {
           if(err) {
               res.json(err.sqlMessage)
              
           }  else {
            res.json('removed successfully');
           }
        })
        
    })


    router.get("/edit/author/:id" , (req , res) => {
        var getAuthor = "SELECT * FROM author WHERE authorid = '" + req.params.id + "'";
        connection.query(getAuthor , (err , result) => {
           if(err) {
                console.log(err.sqlMessage)
                res.redirect('back')
           }  else {
                console.log(result);
                res.render('author/edit' , {author: result[0]});
              
           }
        })
        
    })


    router.put("/edit/author/:id" , (req , res) => {
        var updateAuthor = "UPDATE author SET name = '" + req.body.name + "' , email = '" + req.body.email + "' , WHERE authorid = '" + req.params.id + "'";
       console.log(updateAuthor);
        connection.query(updateAuthor , (err , result) => {
           if(err) {
               console.log(err.sqlMessage)
               res.redirect('back')
           }  else {
                res.redirect('/authors');
           }
        })
        
    })

    router.put("/api/edit/author/:id" , (req , res) => {
        var updateAuthor = "UPDATE author SET name = '" + req.body.name + "' , email = '" + req.body.email + "' , WHERE authorid = '" + req.params.id + "'";
       console.log(updateAuthor);
        connection.query(updateAuthor , (err , result) => {
           if(err) {
                res.json(err.sqlMessage)
           }  else {
                res.json('Edit author successfully');
           }
        })
        
    })




 router.get('/add/author' , (req , res) => {
     res.render('author/add');
 })

 router.post('/add/author' , (req , res) => {
     
    
    var addNewbAuthor = "INSERT INTO author (name, email) VALUES ('" + req.body.name + "' , '" + req.body.email + "');";
    
    connection.query(addNewbAuthor, function (err, result) {
      if (err) {
          console.log(err.sqlMessage)
          res.redirect('back');
      }
      console.log("Add new Author successfully!!");
      res.redirect('/authors')
    });
 })

 router.post('/api/add/author' , (req , res) => {
     
    
    var addNewbAuthor = "INSERT INTO author (name, email) VALUES ('" + req.body.name + "' , '" + req.body.email + "');";
    
    connection.query(addNewbAuthor, function (err, result) {
      if (err) {
          res.json(err.sqlMessage)
      }
      res.json("Add new Author successfully!!");
    });
 })

module.exports = router;