<?php
function create_table_levels($result){
    $cnt = 0;
    while ($row = $result->fetch_assoc()) {
        $cnt++;
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
    return $cnt;
}


$db = mysqli_connect('localhost', 'root', '', 'registration');
$query = "SELECT name, levels.user_name, SUM(IF(vote = 1, 1, 0)) as upvotes, SUM(IF(vote = -1, 1, 0)) AS downvotes, id FROM levels LEFT JOIN votes ON levels.id = votes.level_id";


//choose search query
if (isset($_GET['search'])) {
    $_SESSION['level_page'] = 0;
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

$query = $query . " WHERE LOWER($param) like '%" . strtolower($search) . "%' AND levels.id = votes.level_id GROUP BY name, levels.user_name";


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
$query = $query . " ORDER BY $sort";

//choose page
if (isset($_GET['page'])) {
    if($_GET['page'] == "Next"){
        $page = $_SESSION['level_page'] + 1;
    }elseif($_GET['page'] == "Previous"){
        $page = max($_SESSION['level_page'] - 1, 0);
    }elseif($_GET['page'] == "First"){
        $page = 0;
    }elseif($_GET['page'] == "Last"){
        $count_query = "SELECT COUNT(*) as cnt from ($query) as aux";
        $result = mysqli_query($db, $count_query);
        if($result){
            $row = $result->fetch_assoc();
            $page = floor(intval($row['cnt'])/10);
        }else{
            $page = 0;
        }
    }
    $_SESSION['level_page'] = $page;
} elseif (isset($_SESSION['level_page'])) {
    $page = $_SESSION['level_page'];
} else {
    $_SESSION['level_page'] = 0;
    $page = 0;
}

$page = $page*10;
$query_page = $query . " LIMIT 10 OFFSET $page";
$result = mysqli_query($db, $query_page);
if($result){
    if(!create_table_levels($result) && $page > 0){
        $page = $page - 10;
        $query_page = $query . " LIMIT 10 OFFSET $page";
        $_SESSION['level_page'] = $page / 10;
        $result = mysqli_query($db, $query_page);
        if ($result) {
            create_table_levels($result);
        }
    }
}

