const { json } = require('body-parser');
const connection = require('../database/sqlConnections');
const { v4: uuidv4 } = require('uuid');
const {join} = require('path')
var express = require('express'),
    router = express.Router();

    var multer  = require('multer');
    var storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, './uploads')
      },
      filename: function (req, file, cb) {
         var imageType = file.mimetype.split('/');
         var imagePath = uuidv4() + '.' + imageType[1];
         cb(null, imagePath)
      }
  })
  var upload = multer({ storage: storage })
  const fs = require('fs');

    
    router.get("/boxes" , (req , res) => {

      
        var getAllBoxes = `
        SELECT box.boxid, box.picture, box.title, GROUP_CONCAT(genre.name) AS genres_names, GROUP_CONCAT(genre.id) AS genres_ides, box.description, box.author_id,  author.name AS author_name
        FROM box
        JOIN box_genres on (box.boxid=box_genres.box_id)
        JOIN author on (box.author_id=author.authorid)
        JOIN genre on (genre.id=box_genres.genre_id)
        GROUP BY box.boxid;
        `
        connection.query(getAllBoxes , (err , result) => {
           if(err) {
            //    console.log(err.sqlMessage)
               res.redirect('back')
           }  else {
                res.render('box/show-all' , {boxes: result});
           }
        })
        
    })
    router.get("/api/boxes" , (req , res) => {
        var getAllBoxes = `
        SELECT box.boxid, box.picture, box.title, GROUP_CONCAT(genre.name) AS genres_names, GROUP_CONCAT(genre.id) AS genres_ides, box.description, box.author_id,  author.name AS author_name
        FROM box
        JOIN box_genres on (box.boxid=box_genres.box_id)
        JOIN author on (box.author_id=author.authorid)
        JOIN genre on (genre.id=box_genres.genre_id)
        GROUP BY box.boxid;
        `
        connection.query(getAllBoxes , (err , result) => {
           if(err) {
            res.json(err.sqlMessage)
           }  else {
               res.json(result);
           }
        })
        
    })

    router.delete("/remove/box/:id" , (req , res) => {
        var deleteFromBox_Gernres = "DELETE FROM box_genres WHERE box_id = '"+ req.params.id +"'";
        connection.query(deleteFromBox_Gernres , (err , result) => {
           if(err) {
            //    console.log(err.sqlMessage)
               res.redirect('back')
           }  else {

           
             // ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
            // var path = join(process.cwd(), 'uploads', 'qrcode_zoom.us.png');
            // fs.unlinkSync(path)
            connection.query('SELECT * FROM box WHERE boxid = ' + req.params.id , async (err , boxDataResult) => {
               if(err) {
                //    console.log(err.sqlMessage)
                   res.redirect('back')
               }  else {
                  var updateBox;
                  
                  var path = join(process.cwd(), 'uploads', boxDataResult[0].picture);
                  fs.unlinkSync(path);


                  var deleteBox = "DELETE FROM box WHERE boxid = '"+ req.params.id +"'";
                  connection.query(deleteBox , (err , result) => {
                     if(err) {
                     //    console.log(err.sqlMessage)
                        res.redirect('back')
                     }  else {
                        res.redirect('/boxes');
                     }
                  })
               }
            }); 
            
            
           }
        })
        
    })
    router.delete("/api/remove/box/:id" , (req , res) => {
      var deleteFromBox_Gernres = "DELETE FROM box_genres WHERE box_id = '"+ req.params.id +"'";
      connection.query(deleteFromBox_Gernres , (err , result) => {
         if(err) {
          res.json(err.sqlMessage)
             //res.redirect('back')
         }  else {

            connection.query('SELECT * FROM box WHERE boxid = ' + req.params.id , async (err , boxDataResult) => {
               if(err) {
                //    console.log(err.sqlMessage)
                   res.redirect('back')
               }  else {
                  var updateBox;
                  
                  var path = join(process.cwd(), 'uploads', boxDataResult[0].picture);
                  fs.unlinkSync(path);


                  var deleteBox = "DELETE FROM box WHERE boxid = '"+ req.params.id +"'";
                  connection.query(deleteBox , (err , result) => {
                     if(err) {
                        res.json(err.sqlMessage)
                        //res.redirect('back')
                     }  else {
                        res.json('delete successfully');
                     }
                  })

                  }
               }); 
      
          
         }
      })
        
    })


    router.get("/edit/box/:id" , (req , res) => {
        var getBox = `
        SELECT box.boxid, box.title, GROUP_CONCAT(genre.name) AS genres_names, GROUP_CONCAT(genre.id) AS genres_ides, box.description, box.author_id,  author.name AS author_name
        FROM box
        
        JOIN box_genres on (box.boxid=box_genres.box_id)
        JOIN author on (box.author_id=author.authorid)
        JOIN genre on (genre.id=box_genres.genre_id)
        where box.boxid = ` + req.params.id +  `
        GROUP BY box.boxid;`
        connection.query(getBox , (err , box_result) => {
           if(err) {
                // console.log(err.sqlMessage)
                res.redirect('back')
           }  else {
            var getAllAuthors = "SELECT * FROM author;"
            connection.query(getAllAuthors , (err , author_result) => {
               if(err) {
                //    console.log(err.sqlMessage)
                   res.redirect('back')
               }  else {
                  connection.query('SELECT * FROM genre;' , (err , genreResult) => {
                     if(err) {
                        console.log(err);
                        res.redirect('back')
                     } else {
                        res.render('box/edit' , {authors: author_result , box: box_result[0], genres: genreResult});
        
                     }
                  })
            
                    
               }
            });
               
              
           }
        })
        
    })


    router.put("/edit/box/:id" ,upload.single('box-picture'), (req , res) => {
      
      connection.query('SELECT * FROM box WHERE boxid = ' + req.params.id , async (err , boxDataResult) => {
         if(err) {
          //    console.log(err.sqlMessage)
             res.redirect('back')
         }  else {
            var updateBox;
            if(req.file) {
               var path = join(process.cwd(), 'uploads', boxDataResult[0].picture);
               fs.unlinkSync(path)
               
               updateBox = await "UPDATE box SET  title = '" + req.body.title + "' , author_id = '" + req.body.author_id + "' , picture = '" + req.file.filename + "' , description = '" + req.body.description +"' WHERE boxid = '" + req.params.id + "'";
            } else {
               updateBox = await "UPDATE box SET  title = '" + req.body.title + "' , author_id = '" + req.body.author_id + "' , description = '" + req.body.description +"' WHERE boxid = '" + req.params.id + "'";
            }


            connection.query(updateBox , (err , boxResult) => {
               if(err) {
                //    console.log(err.sqlMessage)
                   res.redirect('back')
               }  else {
                  var deletedGenres = "DELETE FROM box_genres WHERE box_id = '" + req.params.id + "'"
                connection.query(deletedGenres , (genreErr , genreDeletedResult) => {
                   if(genreErr) {
                      console.log(genreErr);
                      res.redirect('back');
                   } else {
                      var genres;
                      if(typeof req.body.genre_id == 'string') {
                         genres = [req.body.genre_id];
                      } else {
                         genres = req.body.genre_id;
                      }
                      
                      
                      var boxid = req.params.id;
                      var addGenresQuerys = "";
                      genres.forEach(genre => {
                         addGenresQuerys = "INSERT INTO box_genres (box_id, genre_id) VALUES ( " + boxid + " ," + genre + ") ";
                         console.log(addGenresQuerys);
                         connection.query(addGenresQuerys , (genreErr , genreResult) => {
                            if(genreErr) {
                               console.log(genreErr);
                               res.redirect('back');
                            } else {
                               console.log("Add new genres successfully!!");
                            }
                         })
                         
                      }); 
                      res.redirect('/boxes')
                   }
                })
    
    
                
                  
             }
            })
         }
      });
       
        
    })
    router.put("/api/edit/box/:id" , upload.single('box-picture'),  (req , res) => {

      connection.query('SELECT * FROM box WHERE boxid = ' + req.params.id , async (err , boxDataResult) => {
         if(err) {
             res.json(err.sqlMessage)
             
         }  else {
            var updateBox;
            if(req.file) {
               var path = join(process.cwd(), 'uploads', boxDataResult[0].picture);
               fs.unlinkSync(path)
               
               updateBox = await "UPDATE box SET  title = '" + req.body.title + "' , author_id = '" + req.body.author_id + "' , picture = '" + req.file.filename + "' , description = '" + req.body.description +"' WHERE boxid = '" + req.params.id + "'";
            } else {
               updateBox = await "UPDATE box SET  title = '" + req.body.title + "' , author_id = '" + req.body.author_id + "' , description = '" + req.body.description +"' WHERE boxid = '" + req.params.id + "'";
            }


            connection.query(updateBox , (err , boxResult) => {
               if(err) {
                  res.json(err.sqlMessage)
                  
               }  else {
                  var deletedGenres = "DELETE FROM box_genres WHERE box_id = '" + req.params.id + "'"
                connection.query(deletedGenres , (genreErr , genreDeletedResult) => {
                   if(genreErr) {
                     res.json(genreErr);
                     
                   } else {
                      var genres;
                      if(typeof req.body.genre_id == 'string') {
                         genres = [req.body.genre_id];
                      } else {
                         genres = req.body.genre_id;
                      }
                      
                      
                      var boxid = req.params.id;
                      var addGenresQuerys = "";
                      genres.forEach(genre => {
                         addGenresQuerys = "INSERT INTO box_genres (box_id, genre_id) VALUES ( " + boxid + " ," + genre + ") ";
                         console.log(addGenresQuerys);
                         connection.query(addGenresQuerys , (genreErr , genreResult) => {
                            if(genreErr) {
                              res.json(genreErr);
                               
                            } else {
                               console.log("Add new genres successfully!!");
                            }
                         })
                         
                      }); 
                      res.json('Update successfully')
                   }
                })
    
    
                
                  
             }
            })
         }
      });
    })




 router.get('/add/box' , (req , res) => {
    var getAllAuthors = "SELECT * FROM author;"
    connection.query(getAllAuthors , (err , auhtorsResult) => {
       if(err) {
        //    console.log(err.sqlMessage)
           res.redirect('back')
       }  else {
          connection.query('SELECT * FROM genre;' , (err , genreResult) => {
             if(err) {
                console.log(err);
                res.redirect('back')
             } else {
               res.render('box/add' , {authors: auhtorsResult, genres: genreResult});

             }
          })
       }
    });
 })

 router.post('/add/box' , upload.single('box-picture'), (req , res) => {
     
    //console.log(typeof req.body.genre_id);
    console.log(req.file);
    console.log(req.file.filename); 
    
    var addNewbBox = "INSERT INTO box (title , description, picture , author_id) VALUES ('" + req.body.title + "' , '" + req.body.description + "' , '" + req.file.filename + "' , '" + req.body.author_id + "')";
      
    connection.query(addNewbBox, function (boxErr, boxResult) {
      if (boxErr) {
        //   console.log(err.sqlMessage)
          res.redirect('back');
      }
      console.log("Add new box successfully!!");
      var genres;
      if(typeof req.body.genre_id == undefined) {
         res.redirect('back')
      }
      if(typeof req.body.genre_id == 'string') {
         genres = [req.body.genre_id];
      } else {
         genres = req.body.genre_id;
      }
       
      var boxid = boxResult.insertId;
      var addGenresQuerys = "";
      genres.forEach(genre => {
         addGenresQuerys = "INSERT INTO box_genres (box_id, genre_id) VALUES ( " + boxid + " ," + genre + ") ";
         console.log(addGenresQuerys);
         connection.query(addGenresQuerys , (genreErr , genreResult) => {
            if(genreErr) {
               console.log(genreErr);
               res.redirect('back');
            } else {
               console.log("Add new genres successfully!!");
            }
         })
      }); 
      
      res.redirect('/boxes')
      
      
      

      
    });
    
 })

 router.post('/api/add/box' ,upload.single('box-picture'), (req , res) => {
   //console.log(typeof req.body.genre_id);
   console.log(req.file);
   //console.log(req.file.filename); 
   console.log("req.body.title: " + req.body.title);
   console.log("req.body.description: " + req.body.description);
   console.log("req.body.filename: " + req.file.filename);
   console.log("req.body.author_id: " + req.body.author_id);
   console.log("req.body.genre_id: " + req.body.genre_id);
   var addNewbBox = "INSERT INTO box (title , description, picture, author_id) VALUES ('" + req.body.title + "' , '" + req.body.description + "' , '" + req.file.filename + "' , '" + req.body.author_id + "')";
      
   connection.query(addNewbBox,  function (boxErr, boxResult) {
     if (boxErr) {
         res.json(boxErr)
         // res.redirect('back');
     }
  
     var genres;
     if(typeof req.body.genre_id == undefined) {
         res.json('err')
     }
     else if(typeof req.body.genre_id == 'string') {
        genres = [req.body.genre_id];
     } else {
        genres = req.body.genre_id;
     }
      
     var boxid =  boxResult.insertId;
     var addGenresQuerys = "";
     genres.forEach(genre => {
        addGenresQuerys = "INSERT INTO box_genres (box_id, genre_id) VALUES ( " + boxid + " ," + genre + ") ";
      
        connection.query(addGenresQuerys , (genreErr , genreResult) => {
           if(genreErr) {


              res.json(genreErr);
           } else {
              console.log("Add new genres successfully!!");
             
           }
        })
     }); 
     
     
     //res.json('Add new');
     
     
     

     
   });
 })

module.exports = router;