<?php
$db = mysqli_connect('localhost', 'root', '', 'registration');
$whole_table_query = "select name, levels.user_name as creator, score.user_name as player, completion_time, collected_coins, enemies_killed  from levels, score where levels.id = score.level_id";

//choose search query
if (isset($_GET['search'])) {
    $_SESSION['last_score_search'] = $_GET['search'];
    $search = $_GET['search'];
} elseif (isset($_SESSION['last_score_search'])) {
    $search = $_SESSION['last_score_search'];
} else {
    $search = "";
    $_SESSION['last_score_search'] = "";
}

//choose query parameter
if (isset($_GET['param'])) {
    if ($_GET['param'] == "Name") {
        $param = 'name';
    } elseif ($_GET['param'] == "Creator") {
        $param = 'levels.user_name';
    } elseif ($_GET['param'] == "Player") {
        $param = 'score.user_name';
    }
    $_SESSION['last_score_param'] = $param;
} elseif (isset($_SESSION['last_score_param'])) {
    $param = $_SESSION['last_score_param'];
} else {
    $param = "name";
    $_SESSION['last_score_param'] = $param;
}

$whole_table_query = $whole_table_query . " AND LOWER($param) like '%" . strtolower($search) . "%'";

//choose sort parameter
if (isset($_GET['sort'])) {
    if ($_GET['sort'] == 'name') {
        $sort = "name";
    } elseif ($_GET['sort'] == 'creator') {
        $sort = "creator";
    } elseif ($_GET['sort'] == 'player') {
        $sort = "player";
    } elseif ($_GET['sort'] == 'time') {
        $sort = "completion_time";
    } elseif ($_GET['sort'] == 'money') {
        $sort = "collected_coins DESC";
    } elseif ($_GET['sort'] == 'kills') {
        $sort = "enemies_killed DESC";
    }
    $_SESSION['last_score_sort'] = $sort;
} elseif (isset($_SESSION['last_score_sort'])) {
    $sort = $_SESSION['last_score_sort'];
} else {
    $sort = "name";
    $_SESSION['last_score_sort'] = $sort;
}

$whole_table_query = $whole_table_query . " ORDER BY $sort";

$whole_table_query = $whole_table_query . " LIMIT 10";
$result = mysqli_query($db, $whole_table_query);
if ($result) {
    while ($row = $result->fetch_assoc()) {
        echo "<tr>";
        echo "<td>" . $row['name'] . "</td>";
        echo "<td>" . $row['creator'] . "</td>";
        echo "<td>" . $row['player'] . "</td>";
        echo "<td>" . $row['completion_time'] . "</td>";
        echo "<td>" . $row['collected_coins'] . "</td>";
        echo "<td>" . $row['enemies_killed'] . "</td>";
        echo "</tr>";
    }
}

