<?php
$db = mysqli_connect('localhost', 'root', '', 'registration');
$whole_table_query = "SELECT name, levels.user_name, SUM(IF(vote = 1, 1, 0)) as upvotes, SUM(IF(vote = -1, 1, 0)) AS downvotes, id FROM levels LEFT JOIN votes ON levels.id = votes.level_id";
if (isset($_GET['search'])) {
    $whole_table_query = $whole_table_query . " WHERE LOWER(name) like '%" . strtolower($_GET['search']) . "%' AND levels.id = votes.level_id GROUP BY name, levels.user_name";
    $_SESSION['last_query'] = $whole_table_query;
} else {
    $whole_table_query = $whole_table_query . " GROUP BY name, levels.user_name";
}

if (isset($_GET['sort'])) {
    if (isset($_SESSION['last_query']))
        $whole_table_query = $_SESSION['last_query'];
    if ($_GET['sort'] == 'name') {
        $whole_table_query = $whole_table_query . " ORDER BY name";
    } elseif ($_GET['sort'] == 'creator') {
        $whole_table_query = $whole_table_query . " ORDER BY user_name";
    } elseif ($_GET['sort'] == 'up') {
        $whole_table_query = $whole_table_query . " ORDER BY upvotes DESC";
    } elseif ($_GET['sort'] == 'down') {
        $whole_table_query = $whole_table_query . " ORDER BY downvotes DESC";
    }
}
$whole_table_query = $whole_table_query . " LIMIT 10";
$result = mysqli_query($db, $whole_table_query);
while ($row = $result->fetch_assoc()) {
    echo "<tr>";
    echo "<td>" . $row['name'] . "</td>";
    echo "<td>" . $row['user_name'] . "</td>";
    echo "<td><a href='?up=" . $row['id'] . "'>" . $row['upvotes'] . "</a></td>";
    echo "<td><a href='?down=" . $row['id'] . "'>" . $row['downvotes'] . "</a></td>";
    echo "<td>" . "<button type='submit' name = 'play' value = '$row[id]'>Play</button>";
    if (!strcmp($_SESSION['username'], $row['user_name']))
        echo "<button type='submit' name = 'edit' value = '" . $row['id'] . "'>Edit</button>";
    echo "</td>";
    echo "</tr>";
}
