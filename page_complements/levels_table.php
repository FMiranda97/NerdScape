<?php
//TODO sort filters by upvotes, downvotes, difference
//TODO search filters like "%name%"

$db = mysqli_connect('localhost', 'root', '', 'registration');
$whole_table_query = "SELECT name, user_name, upvotes, downvotes, id from levels LIMIT 10";
$result = mysqli_query($db, $whole_table_query);
while($row = $result->fetch_assoc()){
    echo "<tr>";
    echo "<td>" . $row['name'] . "</td>";
    echo "<td>" . $row['user_name'] . "</td>";
    echo "<td>" . $row['upvotes'] . "</td>";
    echo "<td>" . $row['downvotes'] . "</td>";
    echo "<td>" . "<button type='submit' name = 'play' value = '" . $row['id'] . "'>Play</button>";
    if(!strcmp($_SESSION['username'],$row['user_name']))
        echo "<button type='submit' name = 'edit' value = '". $row['id'] ."'>Edit</button>";
    echo "<td>";
    echo "</tr>";
}