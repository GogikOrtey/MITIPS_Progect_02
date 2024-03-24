<?php
$servername = "gogortv0.beget.tech";
$username = "gogortv0_db_pl_2";
$password = "Nnd&4M%m";
$dbname = "gogortv0_db_pl_2";

// Создаем соединение
$conn = new mysqli($servername, $username, $password, $dbname);

// Проверяем соединение
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

$sql = $_POST['sql_query']; // Получаем SQL запрос из POST запроса
$result = $conn->query($sql);

if ($result->num_rows > 0) {
  // Выводим данные каждой строки
  while($row = $result->fetch_assoc()) {
    echo "id: " . $row["id"]. " - Name: " . $row["name"]. "<br>";
  }
} else {
  echo "0 results";
}
$conn->close();
?>