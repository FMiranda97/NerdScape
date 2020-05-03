<?php
$db = mysqli_connect('localhost', 'root', '', 'registration');
$whole_table_query = "SELECT name, levels.user_name, SUM(IF(vote = 1, 1, 0)) as upvotes, SUM(IF(vote = -1, 1, 0)) AS downvotes, id FROM levels LEFT JOIN votes ON levels.id = votes.level_id";


//choose search query
if (isset($_GET['search'])) {
    $_SESSION['last_level_search'] = $_GET['search'];
    $search = $_GET['search'];
} elseif (isset($_SESSION['last_level_search'])) {
    $search = $_SESSION['last_level_search'];
} else {
    $search = "";
    $_SESSION['last_level_search'] = "";
}

//choose query parameter
if (isset($_GET['param'])) {
    if ($_GET['param'] == "Name") {
        $param = 'name';
    } elseif ($_GET['param'] == "Creator") {
        $param = 'levels.user_name';
    }
    $_SESSION['last_level_param'] = $param;
} elseif (isset($_SESSION['last_level_param'])) {
    $param = $_SESSION['last_level_param'];
} else {
    $param = "name";
    $_SESSION['last_level_param'] = $param;
}

$whole_table_query = $whole_table_query . " WHERE LOWER($param) like '%" . strtolower($search) . "%' AND levels.id = votes.level_id GROUP BY name, levels.user_name";


if (isset($_GET['sort'])) {
    if ($_GET['sort'] == 'name') {
        $sort = "name";
    } elseif ($_GET['sort'] == 'creator') {
        $sort = "user_name";
    } elseif ($_GET['sort'] == 'up') {
        $sort = "upvotes DESC";
    } elseif ($_GET['sort'] == 'down') {
        $sort = "downvotes DESC";
    }
    $_SESSION['last_level_sort'] = $sort;
}elseif (isset($_SESSION['last_level_sort'])) {
    $sort = $_SESSION['last_level_sort'];
} else {
    $sort = "name";
    $_SESSION['last_level_sort'] = $sort;
}
$whole_table_query = $whole_table_query . " ORDER BY $sort";

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
