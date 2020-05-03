<?php
function create_table_scores($result){
    $cnt = 0;
    while ($row = $result->fetch_assoc()) {
        $cnt++;
        echo "<tr>";
        echo "<td>" . $row['name'] . "</td>";
        echo "<td>" . $row['creator'] . "</td>";
        echo "<td>" . $row['player'] . "</td>";
        echo "<td>" . $row['completion_time'] . "</td>";
        echo "<td>" . $row['collected_coins'] . "</td>";
        echo "<td>" . $row['enemies_killed'] . "</td>";
        echo "</tr>";
    }
    return $cnt;
}

$db = mysqli_connect('localhost', 'root', '', 'registration');
$query = "select name, levels.user_name as creator, score.user_name as player, completion_time, collected_coins, enemies_killed  from levels, score where levels.id = score.level_id";

//choose search query
if (isset($_GET['search'])) {
    $_SESSION['score_page'] = 0;
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
$query = $query . " AND LOWER($param) like '%" . strtolower($search) . "%'";

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
$query = $query . " ORDER BY $sort";

//choose page
if (isset($_GET['page'])) {
    if($_GET['page'] == "Next"){
        $page = $_SESSION['score_page'] + 1;
    }elseif($_GET['page'] == "Previous"){
        $page = max($_SESSION['score_page'] - 1, 0);
    }elseif($_GET['page'] == "First"){
        $page = 0;
    }
    $_SESSION['score_page'] = $page;
} elseif (isset($_SESSION['score_page'])) {
    $page = $_SESSION['score_page'];
} else {
    $_SESSION['score_page'] = 0;
    $page = 0;
}

$page = $page*10;
$query_page = $query . " LIMIT 10 OFFSET $page";
$result = mysqli_query($db, $query_page);
if($result){
    if(!create_table_scores($result) && $page > 0){
        $page = $page - 10;
        $query_page = $query . " LIMIT 10 OFFSET $page";
        $_SESSION['score_page'] = $page / 10;
        $result = mysqli_query($db, $query_page);
        if ($result) {
            create_table_scores($result);
        }
    }
}


