<?php include('actions/do_login.php') ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Register</title>
    <link rel="stylesheet" type="text/css" href="css/navbar.css">

</head>
<body>
    <div class="topnav">
        <a href="register.php">Register</a>
        <a class="active">Login</a>
    </div>
    <br>

<form method="post" action="login.php">
    <?php include('page_complements/errors.php') ?>
    <!--TODO remove default values-->
    <label for="username">Username or e-mail:</label><br>
    <input type="text" id="username" name="username" value="John"><br>

    <label for="password">Password:</label><br>
    <input type="password" id="password" name="password" value="Doe"><br><br>

    <input type="submit" name="login_user" value="Login">
</form>

</body>
</html>