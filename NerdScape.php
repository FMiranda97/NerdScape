<?php

//$_SESSION['username'] = "TEST USER"; //TODO remove this line

include('actions/check_login.php');
include('actions/do_logout.php')
?>

<!DOCTYPE html>
<html lang="en">
<head>
	<title>NerdScape</title>

	<meta charset="utf-8">
	<link rel="stylesheet" type="text/css" href="css/navbar.css">

	<!--	components-->
	<script type="text/javascript" src="js/components/Component.js" defer></script>
	<script type="text/javascript" src="js/components/Flag.js" defer></script>
	<script type="text/javascript" src="js/components/Portal.js" defer></script>
	<script type="text/javascript" src="js/components/Coin.js" defer></script>
	<script type="text/javascript" src="js/components/Chest.js" defer></script>

	<!--	enemies-->
	<script type="text/javascript" src="js/enemies/Enemy.js" defer></script>
	<script type="text/javascript" src="js/enemies/Sniper.js" defer></script>
	<script type="text/javascript" src="js/enemies/Repeater.js" defer></script>
	<script type="text/javascript" src="js/enemies/Randomizer.js" defer></script>
	<script type="text/javascript" src="js/enemies/Projectile.js" defer></script>
	<script type="text/javascript" src="js/enemies/Movement.js" defer></script>

	<!--	player-->
	<script type="text/javascript" src="js/components/Player.js" defer></script>
	<script type="text/javascript" src="js/components/Sword.js" defer></script>

	<!--	menus-->
	<script type="text/javascript" src="js/menus/MenuComponent.js" defer></script>
	<script type="text/javascript" src="js/menus/MainMenu.js" defer></script>
	<script type="text/javascript" src="js/menus/LevelStartMenu.js" defer></script>
	<script type="text/javascript" src="js/menus/LevelOverMenu.js" defer></script>
	<script type="text/javascript" src="js/menus/LevelSelectionMenu.js" defer></script>
	<script type="text/javascript" src="js/menus/OptionsMenu.js" defer></script>
	<script type="text/javascript" src="js/menus/ShopMenu.js" defer></script>
	<script type="text/javascript" src="js/menus/ShopSkill.js" defer></script>

	<!--	engines-->
	<script type="text/javascript" src="js/engines/Engine.js" defer></script>
	<script type="text/javascript" src="js/engines/NerdScape.js" defer></script>
	<script type="text/javascript" src="js/engines/User.js" defer></script>
	<script type="text/javascript" src="js/engines/Level.js" defer></script>
	<script type="text/javascript" src="js/engines/Editor.js" defer></script>
</head>


<body>
	<div class="topnav">
		<a class="active">Main Game</a>
		<a href="levelDesigner.php">Level Designer</a>
		<a href="#scoreboard">Scoreboards</a>
		<a href="#about">About</a>
		<a class="logout" href="?logout='1'">Log out</a>
	</div>
	<br>
	<canvas id="canvas" width="800" height="450" style="display: block; margin: auto; background: #dddddd"></canvas>
	<audio id = "music" autoplay loop>
		<source src="resources/sounds/tricana.mp3">
	</audio>
</body>
</html>