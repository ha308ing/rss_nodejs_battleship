# Battleship game with Websocket backend

## How to run

1. `npm i`
2. `npm run start:dev` to start in dev mode
3. `npm run start` to build and run prod mode


## Game description
1. We should have inmemory DB with player data (login and password) storage
2. Player can create game room or connect to the game room after login
3. Player room data (players, game board, ships positions) storages in the server
3. Game starts after 2 players are connected to the room and sent ships positions to the server
4. Server sends move order
5. Players should shoot in their's turn
6. Server send back shot result
7. If player hits or kills the ship, player should make one more shoot
8. Player wins if he have killed all enemies ships

## Websocket commands sequence

```
  Player1               Server                  Player2
    reg         -->
                <--        reg
                <--    update_room
                <--   update_winners
 create_room    -->
                <--    update_room
                                      <--         reg
                           reg        -->
                <--    update_room    -->
                <--   update_winners  -->
                                      <--    add_user_to_room
                <--    update_room    -->
                <--    create_game    -->
   add_ships    -->
                                      <--       add_ships
                <--     start_game    -->
                <--        turn       -->
 attack (miss)  -->
                <--       attack      -->
                <--        turn       -->
                                      <--     randomAttack (shoot)
                <--       attack      -->
                <--        turn       -->
                                      <--     randomAttack (kill) - send state for all cells around killed ship
                <--       attack      -->
                <--        turn       -->
                <--       attack      -->
                <--        turn       -->
                <--       attack      -->
                <--        turn       -->
                <--       attack      -->
                <--        turn       -->
                           ...
                                      <--     randomAttack (miss)
                <--       attack      -->
                <--        turn       -->
 attack (miss)  -->
                <--       attack      -->
                <--        turn       -->
                           ...
                <--      finish       -->
                <--   update_winners  -->
```
