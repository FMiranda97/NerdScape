<?php
$db = mysqli_connect('localhost', 'root', '', 'registration');
$whole_table_query = "select name, levels.user_name as creator, score.user_name as player, completion_time, collected_coins, enemies_killed  from levels, score where levels.id = score.level_id";
if (isset($_GET['search'])) {
    $param = $_GET['param'];
    if($param == "Name"){
        $param = 'name';
    }elseif($param == "Creator"){
        $param = 'levels.user_name';
    }elseif($param == "Player"){
        $param = 'player';
    }
    $whole_table_query = $whole_table_query . " AND LOWER($param) like '%" . strtolower($_GET['search']) . "%'";
    $_SESSION['last_query'] = $whole_table_query;
}

if (isset($_GET['sort'])) {
    if (isset($_SESSION['last_query']))
        $whole_table_query = $_SESSION['last_query'];
    if ($_GET['sort'] == 'name') {
        $whole_table_query = $whole_table_query . " ORDER BY name";
    } elseif ($_GET['sort'] == 'creator') {
        $whole_table_query = $whole_table_query . " ORDER BY creator";
    } elseif ($_GET['sort'] == 'player') {
        $whole_table_query = $whole_table_query . " ORDER BY player";
    } elseif ($_GET['sort'] == 'time') {
        $whole_table_query = $whole_table_query . " ORDER BY completion_time";
    } elseif ($_GET['sort'] == 'money') {
        $whole_table_query = $whole_table_query . " ORDER BY collected_coins DESC";
    } elseif ($_GET['sort'] == 'kills') {
        $whole_table_query = $whole_table_query . " ORDER BY enemies_killed DESC";
    }
}
$whole_table_query = $whole_table_query . " LIMIT 10";
$result = mysqli_query($db, $whole_table_query);
if($result){
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

