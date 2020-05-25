<?php
$results = array('op' => 'none','level' => 0, 'level_data' => '');

if (isset($_POST['play'])) {
    $results['op'] = 'play';
    $results['level'] = $_POST['play'];
} elseif (isset($_POST['edit'])) {
    $results['op'] = 'edit';
    $results['level'] = $_POST['edit'];
}

if ($results['op'] !== 'none') {
    include("connect.php");
    $query = "SELECT level_info from levels where id = $results[level]";
    if($db) $qr = mysqli_query($db, $query);
    if($qr) $results['level_data'] = $qr->fetch_assoc()['level_info'];
}

echo json_encode($results);