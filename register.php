<?php include('actions/do_register.php') ?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Register</title>

    <link rel="stylesheet" type="text/css" href="css/navbar.css">
    <link rel="stylesheet" type="text/css" href="css/common.css">

</head>

<body>
    <nav class="topnav">
        <a class="active">Register</a>
        <a href="login.php">Login</a>
    </nav>
    <br>

    <form method="post" action="register.php" class="register">
        <?php include('page_complements/errors.php') ?>
        <label for="username">Username:</label><br>
        <input type="text" id="username" name="username" value=""><br>

        <label for="email">E-mail:</label><br>
        <input type="text" id="email" name="email" value=""><br>

        <label for="password">Password:</label><br>
        <input type="password" id="password" name="password" value=""><br>

        <label for="cpassword">Confirm password:</label><br>
        <input type="password" id="cpassword" name="cpassword" value=""><br><br>

        <input type="submit" name="reg_user" value="Submit">
    </form>

</body>

</html>