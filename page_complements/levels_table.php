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
    echo "<td>" . "<input type='submit' name = 'play_" . $row['id'] . "' value = Play>";
    if(!strcmp($_SESSION['username'],$row['user_name']))
        echo "<input type='submit' name = 'edit_" . $row['id'] . "' value = Edit>";
    echo "<td>";
    echo "</tr>";
}