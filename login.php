<?php include('actions/do_login.php') ?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Register</title>
    <link rel="stylesheet" type="text/css" href="css/navbar.css">

</head>

<body>
    <nav class="topnav">
        <a href="register.php">Register</a>
        <a class="active">Login</a>
    </nav>
    <br>

    <form method="post" action="login.php">
        <?php include('page_complements/errors.php') ?>
        <label for="username">Username or e-mail:</label><br>
        <input type="text" id="username" name="username" value=""><br>

        <label for="password">Password:</label><br>
        <input type="password" id="password" name="password" value=""><br><br>

        <input type="submit" name="login_user" value="Login">
    </form>

</body>

</html>