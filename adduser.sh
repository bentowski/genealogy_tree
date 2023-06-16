# #!/bin/sh

curl -X POST http://82.165.70.203:3000/user/create -H "Content-Type: application/json" -d '{"auth_id":"666","username":"gmiel","email":"graviermiel@free.fr","game_won": 5,
        "game_lost": 5,
        "total_games": 10}'
curl -X POST http://82.165.70.203:3000/user/create -H "Content-Type: application/json" -d '{"auth_id":"777","username":"sviager","email":"sorryviager@42.fr", "game_won": 15,
        "game_lost": 45,
        "total_games": 60}'
curl -X POST http://82.165.70.203:3000/user/create -H "Content-Type: application/json" -d '{"auth_id":"888","username":"emacro","email":"emmentalmacro@elysee.fr", "game_won": 25,
        "game_lost": 5,
        "total_games": 30}'
curl -X POST http://82.165.70.203:3000/user/create -H "Content-Type: application/json" -d '{"auth_id":"999","username":"mlepeigne","email":"maritimelepeigne@faf.fr", "game_won": 25,
        "game_lost": 15,
        "total_games": 40}'
