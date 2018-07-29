var express = require('express');

var routes = function(Book){
      var bookRouter = express.Router();
      var bookController = require('../controller/bookController')(Book)

    bookRouter.route('/')
        // .post(function(req,res){
        //     var book = new Book(req.body);
        //     console.log(book);
        //     book.save();
        //     res.status(201).send(book);
    
        // })
        .post(bookController.post)
        // .get(function(req,res){
        //     var query = {};
        //     //Will only accept the Genre as the Query parameter
        //     //like http://localhost:8000/api/books?genre=akkas
        //     //like http://localhost:8000/api/books?akkas
        //     if(req.query.genre)
        //     {
        //         query.genre = req.query.genre;
        //     }
        //     Book.find(query, function(err,books){
        //         if(err)
        //             res.status(500).send(err);
        //         else
        //             res.json(books);
        //     });
        // });
        .get(bookController.get);


    bookRouter.use('/:bookId',function(req, res, next){

        Book.findById(req.params.bookId, function(err,book){
            if(err){
                res.status(500).send(err);
            }
            else if(book){
                req.book = book;
                next();
            }
            else{
                res.status(400).send('no book found');   
            }
        });        
    })
    
    bookRouter.route('/:bookId')
        .get(function(req,res){

            var returnBook = req.book.toJSON();

            returnBook.links = {};
            var newLink = 'http://' + req.headers.host + '/api/books/?genre=' + returnBook.genre;
            returnBook.links.FilterByThisGenre = newLink.replace(' ', '%20');
            res.json(returnBook);

        })
        .put(function(req,res){
                req.book.title = req.body.title;
                req.book.author = req.body.author
                req.book.genre = req.body.genre
                req.book.read = req.body.read
                req.book.save(function(err){
                if(err){
                    res.status(500).send(err);
                }else{
                    res.json(req.book);
                }
            });
        })
        .patch(function(req,res){
            if(req.body._id)
                delete req.body._id
            for(var p in req.body){
                req.book[p] = req.body[p]
            }
            req.book.save(function(err){
                if(err){
                    res.status(500).send(err);
                }else{
                    res.json(req.book);
                }
            });
        })
        .delete(function(req, res){
            req.book.remove(function(err){
                if(err){
                    res.status(500).send(err);
                }else{
                    res.status(204).send('removed');
                }
            })
        })
    return bookRouter;
};


module.exports = routes;