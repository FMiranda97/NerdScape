<?php
// Check if image file is a actual image or fake image
if (isset($_POST["upload"])) {
    $errors = array();
    $target_dir = "uploads/";
    $target_file = $target_dir . $_SESSION['username'] . "_" . basename($_FILES["file"]["name"]);
    $uploadOk = 1;
    $imageFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));
    $check = getimagesize($_FILES["file"]["tmp_name"]);
    if (!isset($_POST["sprite_type"])) {
        array_push($errors, "Sprite type undefined.");
        $uploadOk = 0;
    }
    if ($check == false) {
        array_push($errors, "File is not an image.");
        $uploadOk = 0;
    }
    if (file_exists($target_file)) {
        array_push($errors, "You have a file with this name. Choose a different filename.");
        $uploadOk = 0;
    }
    if ($_FILES["file"]["size"] > 500000) {
        array_push($errors, "Your file is too large.");
        $uploadOk = 0;
    }
    if ($imageFileType != "png") {
        array_push($errors, "Only PNG files are allowed.");
        $uploadOk = 0;
    }
    if ($uploadOk == 1) {
        $db = mysqli_connect("localhost", "root", '', "registration");
        $db->begin_transaction();
        $sprite_type = mysqli_real_escape_string($db, $_POST['sprite_type']);
        $username = mysqli_real_escape_string($db, $_SESSION['username']);
        $image_name = mysqli_real_escape_string($db, $target_file);
        $query = "INSERT INTO sprite(type, user_name, image_name) values('$sprite_type', '$username', '$image_name')";
        $result = mysqli_query($db, $query);
        if ($result && move_uploaded_file($_FILES["file"]["tmp_name"], $target_file)) {
            $db->commit();
        }else{
            $db->rollback();
            echo "<div class = 'error'>Upload Failed</div>";
        }
    } else {
        echo "<div class = 'error'>";
        foreach ($errors as $error) {
            echo "$error<br>";
        }
        echo "</div>";
    }
}
