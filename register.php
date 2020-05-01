<?php include('actions/do_register.php') ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Register</title>
    <link rel="stylesheet" type="text/css" href="css/navbar.css">

</head>
<body>
    <div class="topnav">
        <a class="active">Register</a>
        <a href="login.php">Login</a>
    </div>
    <br>

<form method="post" action="register.php">
    <?php include('page_complements/errors.php') ?>
    <!--TODO remove default values-->
    <label for="username">Username:</label><br>
    <input type="text" id="username" name="username" value="John"><br>

    <label for="email">E-mail:</label><br>
    <input type="text" id="email" name="email" value="JohnDoe@mail.com"><br>

    <label for="password">Password:</label><br>
    <input type="password" id="password" name="password" value="Doe"><br>

    <label for="cpassword">Confirm password:</label><br>
    <input type="password" id="cpassword" name="cpassword" value="Doe"><br><br>

    <input type="submit" name="reg_user" value="Submit">
</form>

</body>
</html>