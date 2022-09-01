# Nerdscape
##  Single player game with leaderboards
This is a simple JavaScript game in a PHP website. You play as a nerd who feeds on RedBull and tries his best to avoid any light while rushing towards his PC. This also includes a leaderboards page and a level designer where you can create your own level, decide on the location of structures and the movimentations that monsters should take around the map.

It was written in pure PHP + JavaScript with a MySQL database and has been dockerized so you can easily preview it. If you have Docker and git installed you can easily run this website locally by cloning the repository and activating the docker-compose file. To do that open a terminal and run the following commands:
 - git clone https://github.com/FMiranda97/NerdScape.git
 - docker compose up -d

It may take a minute to load up the database, even after Docker says it's up and running, please be patient. Once it's ready you can view the website at http://localhost/NerdScape.php.

### Is this a masterpiece of gaming?
No, I am no artist.

### Is this a masterpiece of coding?
Also, no. This was the first time I did anything web related. The fact that you need to access /Nerdscape.php or /registration.php is ugly, routes do not validate data, etc...

### Then why are you showcasing this?
I'm still pretty proud of this. The game was fairly complex and programmed in very little time starting from a background of zero JavaScript and web knowledge and I still managed to architect the code in a way that made extending the game fairly easily. And, coming back almost 3 years later, I was still capable of comprehending and quickly editing the code to fix some game breaking bugs.
