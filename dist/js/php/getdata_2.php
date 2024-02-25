<?php
$servername = "gogortv0.beget.tech";
$username = "gogortv0_plants1";
$password = "5*CdHns2"; 
$dbname = "gogortv0_plants1";

// Создание соединения
$conn = new mysqli($servername, $username, $password, $dbname);

// Проверка соединения
if ($conn->connect_error) {
  die("Ошибка подключения: " . $conn->connect_error);
}

$sql = "SELECT * FROM PlantColors";
$result = $conn->query($sql);

$data = array(); // создаем массив

if ($result->num_rows > 0) {
  // выводим данные каждой строки
  while($row = $result->fetch_assoc()) {
    $data[] = $row; // добавляем каждую строку в массив
  }
} else {
  echo "0 results";
}
echo json_encode($data); // преобразуем массив в JSON

$conn->close();
?>
