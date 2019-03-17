const express = require('express')
const app = express();
const path = require('path');
var Datastore = require('nedb')
  , db = new Datastore({ 
    filename: './rooms.db', 
    autoload: true 
  });

//middlewares
app.use(express.static(path.resolve(__dirname, './frontend/dist')));
// app.use(express.static('public'))

// Always redirect to Vue SPA:
app.get('*', function (request, response) {
    response.sendFile(path.resolve(__dirname, './frontend/dist/index.html'));
});
  

//Listen on port 3000
server = app.listen(process.env.PORT || 3000)

// pinturillo constants
const MAX_PLAYERS = 10;

//socket.io instantiation
const io = require("socket.io")(server) 

//listen on every connection
io.on('connection', (socket) => {
    console.log('New player connected')

    socket.on('unsubscribe', function(room_id) { 
        
        db.update({_id: room_id}, { $set: { room_password: 'abc' } }, { multi: true }, function (err, numReplaced) {
            console.log(numReplaced)
            // numReplaced = 3
            // Field 'system' on Mars, Earth, Jupiter now has value 'solar system'
          });
        
        socket.leave(room_id); 
    })

    socket.on('create_room', (data) => {
        // Create private room in db:
        // data structure:
        let newRoom = {
            room_number: 2334,
            room_password: data.password,
            players:[
                {username: data.creator_player, score: 0},

            ],
            currentWord: 'hola',
            currentPainter: 'username',
            nextPainter:'username'
        }
        db.insert(newRoom, function (err, newDoc) {   // Callback is optional
            if(err){
                console.log(err)
            }
            console.log(newDoc)
          });
        // Make room creator join room
        socket.broadcast.emit('join_private_room', {message : data.message, username : data.username});
    })
    socket.on('join_private_room', (data) =>{
        //todo: join private room
        
    });

    socket.on('join_public_room', async (data) =>{

        //join public room, only takes username
        var joiner = data.player;
        await db.find({room_type: 'public', num_players: { $lt: MAX_PLAYERS}}, function (err, docs) {
            if(err){
                console.log(err)
            }else{
                if(docs.length > 0){
                    let randpick = Math.floor(Math.random() * Math.floor(docs.length));
                    let room = docs[randpick];
                    let new_joiner_name = joiner;
                    // if player has same name as other player in room, make it name1, name12, etc until it's unique,
                    // just like pinturillo2 does.
                    for(let i = 0; i < room.players.length; i++)
                    {
                        if(room.players[i].player == joiner){
                            new_joiner_name = '' + new_joiner_name + room._id;
                        }
                    }

                    socket.join(room._id);
                    io.in(room._id).emit('joined_room', {
                        id: room._id,
                        original_joiner_name: joiner,
                        new_joiner_name: new_joiner_name,
                        players: [...room.players, {username: new_joiner_name, score: 0}]
                    })
                }else{
                    // create room and join creator in
                    let newRoom = {
                    room_type: 'public',
                    room_language: "Español",
                    num_players: 1,
                    players:[
                    {username: joiner, score: 0},
                    ],
                    currentWord: 'hola',
                    currentPainter: 'username',
                    nextPainter:'username'
                    }
                    
                    db.insert(newRoom, function (err, newRoom) {
                        if(err){
                        console.log(err)
                        }else{
                            socket.join(newRoom._id);
                            io.in(newRoom._id).emit('joined_room', {
                                id: newRoom._id,
                                original_joiner_name: joiner,
                                new_joiner_name: joiner,
                                players:  newRoom.players,
                            })
                        }
                    });
                }

            }

        });
        
    });

    // emit countdown time event (3-2-1) before painter starts drawing.

    socket.on('leave_room', (data) =>{
        //if 0 players, remove room from db
        socket.broadcast.emit('leave_room', data);
    }) 

    
    socket.on('player_guessed', (data) =>{
        // todo: Unidirectional score change coming from server. Clients cannot emit a score change.
        // todo: when client receive player_guessed, play animation and then wait 5 seconds.
        socket.broadcast.emit('player_guessed', data);
    }) 

    //drawing
    socket.on('drawing', (data) => socket.broadcast.emit('drawing', data));  

    //chat messages 
    socket.on('new_message', (data) => {
        
        //broadcast the new message to others if it doesn't match word.
        io.sockets.emit('new_message', {message : data.message, username : data.username});
    })
})

