<?php
include('actions/check_login.php');
include('actions/do_logout.php')
?>

<!DOCTYPE html>

<html lang="en">
<head>
	<title>NerdScape: Level Designer</title>

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>

    <meta charset="utf-8">
	<script type="text/javascript" src="js/engines/Engine.js" defer></script>
	<script type="text/javascript" src="js/engines/levelDesigner.js" defer></script>
	<script type="text/javascript" src="js/components/Component.js" defer></script>
	<script type="text/javascript" src="js/enemies/Enemy.js" defer></script>
	<script type="text/javascript" src="js/enemies/Sniper.js" defer></script>
	<script type="text/javascript" src="js/enemies/Repeater.js" defer></script>
	<script type="text/javascript" src="js/enemies/Randomizer.js" defer></script>
	<script type="text/javascript" src="js/enemies/Projectile.js" defer></script>
	<script type="text/javascript" src="js/components/Player.js" defer></script>
	<script type="text/javascript" src="js/components/Flag.js" defer></script>
	<script type="text/javascript" src="js/components/Portal.js" defer></script>
	<script type="text/javascript" src="js/components/Coin.js" defer></script>
	<script type="text/javascript" src="js/engines/Level.js" defer></script>
	<script type="text/javascript" src="js/engines/Editor.js" defer></script>
	<script type="text/javascript" src="js/enemies/Movement.js" defer></script>
	<script type="text/javascript" src="js/components/Chest.js" defer></script>

	<link rel="stylesheet" type="text/css" href="css/levelDesigner.css">
	<link rel="stylesheet" type="text/css" href="css/navbar.css">

</head>


<body>
	<div class="topnav">
		<a href="NerdScape.php">Main Game</a>
		<a class="active" href="levelDesigner.php">Level Designer</a>
        <a href="LevelExplorer.php">Level Explorer</a>
		<a href="#scoreboard">Scoreboards</a>
		<a href="#about">About</a>
		<a class="logout" href="?logout='1'">Log out</a>
	</div>
	<br>

	<canvas id="canvas" width="800" height="450" style="display: block; margin: auto; background: #dddddd"></canvas>
	<div id="selectors">
		<button id="preview">Preview Movement</button>
		<div id="backgroundContainer"><p>Backgrounds</p></div>
		<div id="staticContainer"><p>Static elements</p></div>
		<div id="enemyContainer"><p>Enemies</p></div>
		<div id="uniqueContainer"><p>Unique elements</p></div>

		<div>

			<form id = "createLevelbtn" method="post">
				<label>Level name:
					<input type="text" name="name" value="my level">
				</label>
				<input type="submit" value="Upload">
			</form>

			Instructions <br>
			<label>
				1 - Select an element to pop on canvas. You may only select 1 player and 1 flag.<br>
				2 - Drag elements to desired positions with left mouse.<br>
				3 - While dragging used wasd or arrow keys to redimension your element.<br>
				4 - Right click portals to select their destination. <br>
				5 - Number on bottom left of portal is his ID. Number on bottom right of portal is his destination
				ID.<br>
				6 - Right click coins to edit their value. Value is shown in red below coin.<br>
				7 - Right click flag to edit the level winning reward. Reward is shown in red below flag. <br>
				8 - Portal ID's, coin values and level rewards will not be drawn on the actual game. <br>
				9 - Right click enemies to edit their movement and actions.<br>
				10 - Download your game to a text file with a name of your choosing.<br>
				11 - Copy and paste the contents of that file and press upload to reload the previously downloaded
				level.<br>
				12 - When a level is ready go to method generatePreset from Level class, create a case and paste the
				string there according to the default example.
			</label>
		</div>
	</div>

	<div id="Editor">
		<p>Editor</p>
		<button id="remove">Remove Element</button>
		<br><br>
		<label>x =
			<textarea id="x"></textarea>
		</label>
		<label>y =
			<textarea id="y"></textarea>
		</label>
		<label>w =
			<textarea id="w"></textarea>
		</label>
		<label>h =

			<textarea id="h"></textarea>
		</label>
		<label id = "angle_container">angle º =
			<textarea id="angle"></textarea>
		</label>
		<br>
		<div id = "enemyEditor">
			<button id="insertMovement">Insert Movement</button>
			<button id="previewMovement">Preview Movement</button>
			<br>
			<label class="a">SpeedX SpeedY AccelerationX AccelerationY Duration(ms) ActionFrequency</label>
			<div id="movements"></div>
		</div>
		<div id = "portalEditor">
			<label>destination id =
				<textarea id="dest_id"></textarea>
			</label>
		</div>
		<div id = "flagEditor">
			<label>level reward =
				<textarea id="reward"></textarea>
			</label>
		</div>
		<div id = "coinEditor">
			<label>coin value =
				<textarea id="value"></textarea>
			</label>
		</div>
	</div>
</body>
</html>