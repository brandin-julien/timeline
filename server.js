const path = require('path');
const express = require('express');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use( '/node_modules', express.static(path.join(__dirname, 'node_modules')) );app.use( express.static(path.join(__dirname, 'public')) );

var listOfPosts = [];
var idPost = 0;
var lastId = 0;

io.on('connection', function(socket){
    console.log('a user connected');

    var myUser = {
        id : null,
        pseudo : null
    };

    var myPost = {
        url: null,
        text: null,
        author: null,
        date: null,
        id: null,
        userId : null
    };

    socket.on('setUser', function(userPseudo){
        myUser.pseudo = userPseudo;
        myUser.id = socket.id;
        socket.emit('getUserId', myUser.id);
        socket.emit('getAllPosts', listOfPosts);
    });


    socket.on('publishPost', function(url, text, author){

        myPost.url = url;
        myPost.text = text;
        myPost.author = author;
        myPost.date = new Date().toLocaleString();
        myPost.id = idPost;
        myPost.userId = socket.id;
        lastId = idPost;
        idPost++;

        listOfPosts.push(myPost);

        io.emit('newPosts', myPost);
    });

    socket.on('postToDelete', function(postId){

        var i = 0;

        var tmpArray = [];

        while (i <= listOfPosts.length - 1){
            console.log(listOfPosts[i]);
            if(listOfPosts[i].id !== postId){
                tmpArray.push(listOfPosts[i]);
            }
            i++;
        }

        listOfPosts = tmpArray;

        io.emit('deletedPost', postId);
    });


    socket.on('disconnect', function(){
        console.log('user disconnected');
    });



});


const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Le serveur écoute sur le port ${port}`));