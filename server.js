const path = require('path');
const express = require('express');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use( '/node_modules', express.static(path.join(__dirname, 'node_modules')) ); // Permet au client de faire des requêtes pour aller chercher les node_modules sur http://localhost:1337/node_modules
app.use( express.static(path.join(__dirname, 'public')) ); // Sert par défaut le dossier /public sur http://localhost:1337

var listOfUsers = [];
var listOfPosts = [];
var idPost = 0;

io.on('connection', function(socket){
    console.log('a user connected');

    var myUser = {
        id : null,
        pseudo : null
    };

    var myPost = {
        url: null,
        text: null,
        date: null,
        id: null,
        userId : null
    };

    socket.on('setUser', function(userPseudo){
        myUser.pseudo = userPseudo;
        myUser.id = socket.id;
        console.log(myUser.id);
        socket.emit('getUserId', myUser.id);
        socket.emit('getAllPosts', listOfPosts);
    });


    socket.on('publishPost', function(url, text){

        myPost.url = url;
        myPost.text = text;
        myPost.date = new Date();
        myPost.id = idPost;
        myPost.userId = socket.id;
        idPost++;

        listOfPosts.push(myPost);

        //socket.broadcast.emit('newPosts', myPost);
        io.emit('newPosts', myPost);
    });

    socket.on('postToDelete', function(postId){

        var i = 0;
        var total = listOfPosts.length - 1;

        while ()


        io.emit('deletedPost', postId);
    });


    socket.on('disconnect', function(){
        console.log('user disconnected');
    });



});


const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Le serveur écoute sur le port ${port}`));