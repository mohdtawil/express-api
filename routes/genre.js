const connection = require('../database/sqlConnections');

var express = require('express'),
    router = express.Router();


    
    router.get("/genres" , (req , res) => {

        var getAllGenres = "SELECT * FROM genre;"
        connection.query(getAllGenres , (err , result) => {
           if(err) {
               console.log(err.sqlMessage)
               res.redirect('back')
           }  else {
                res.render('genre/show-all' , {genres: result});
           }
        })
        
    })
    router.get("/api/genres" , (req , res) => {

        var getAllGenres = "SELECT * FROM genre;"
        connection.query(getAllGenres , (err , result) => {
           if(err) {
               res.json(err.sqlMessage)
           }  else {
               res.json(result);
           }
        })
        
    })

    router.delete("/remove/genre/:id" , (req , res) => {
        var deleteGenre = "DELETE FROM genre WHERE id = '"+ req.params.id +"'";
        connection.query(deleteGenre , (err , result) => {
           if(err) {
               console.log(err.sqlMessage)
               res.redirect('back')
           }  else {
                res.redirect('/genres');
           }
        })
        
    })

    router.delete("/api/remove/genre/:id" , (req , res) => {
        var deleteGenre = "DELETE FROM genre WHERE id = '"+ req.params.id +"'";
        connection.query(deleteGenre , (err , result) => {
           if(err) {
               res.json(err.sqlMessage)
              
           }  else {
            res.json('removed successfully');
           }
        })
        
    })


    router.get("/edit/genre/:id" , (req , res) => {
        var getGenre = "SELECT * FROM genre WHERE id = '" + req.params.id + "'";
        connection.query(getGenre , (err , result) => {
           if(err) {
                console.log(err.sqlMessage)
                res.redirect('back')
           }  else {
                console.log(result);
                res.render('genre/edit' , {genre: result[0]});
              
           }
        })
        
    })


    router.put("/edit/genre/:id" , (req , res) => {
        var updateGenre = "UPDATE genre SET name = '" + req.body.name + "' WHERE id = '" + req.params.id + "'";
       console.log(updateGenre);
        connection.query(updateGenre , (err , result) => {
           if(err) {
               console.log(err.sqlMessage)
            //    res.redirect('back')
           }  else {
                res.redirect('/genres');
           }
        })
        
    })

    router.put("/api/edit/genre/:id" , (req , res) => {
        var updateGenre = "UPDATE genre SET name = '" + req.body.name + "' , WHERE id = '" + req.params.id + "'";
       console.log(updateGenre);
        connection.query(updateGenre , (err , result) => {
           if(err) {
                res.json(err.sqlMessage)
           }  else {
                res.json('Edit genre successfully');
           }
        })
        
    })




 router.get('/add/genre' , (req , res) => {
     res.render('genre/add');
 })

 router.post('/add/genre' , (req , res) => {
     
    
    var addNewbGenre = "INSERT INTO genre (name) VALUES ('" + req.body.name + "');";
    
    connection.query(addNewbGenre, function (err, result) {
      if (err) {
          console.log(err.sqlMessage)
          res.redirect('back');
      }
      console.log("Add new Genre successfully!!");
      res.redirect('/genres')
    });
 })

 router.post('/api/add/genre' , (req , res) => {
     
    
    var addNewbGenre = "INSERT INTO genre (name) VALUES ('" + req.body.name + "');";
    
    connection.query(addNewbGenre, function (err, result) {
      if (err) {
          res.json(err.sqlMessage)
      }
      res.json("Add new genre successfully!!");
    });
 })

module.exports = router;