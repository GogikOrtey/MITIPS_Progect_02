<?php
header('Access-Control-Allow-Origin: *');

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

function checkSqlQuery($sql, $conn) {
    $keywords = ['ADD','ALTER','BACKUP','CONSTRAINT','CREATE','DATABASE','DEFAULT','DELETE','DROP', 'EXEC','FOREIGN KEY','INSERT INTO','INSERT INTO SELECT','PROCEDURE','TRUNCATE','UPDATE','VALUES','VIEW'];
    //$keywords = ['VIEW'];

    foreach ($keywords as $keyword) {
        if (stripos($sql, $keyword) !== false) {
            return "Неверный запрос: ";// . $keyword;
        }
    }

    // Экранирование специальных символов в строке для использования в SQL-выражении
    //$sql = mysqli_real_escape_string($conn, $sql);

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
    return json_encode($data);
    //echo json_encode($data); // преобразуем массив в JSON
}

$sql = $_POST['sql']; // Получение SQL-запроса из POST-запроса

echo checkSqlQuery($sql, $conn);

$conn->close();
?>