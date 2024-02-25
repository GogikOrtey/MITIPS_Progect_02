<?php
// Параметры подключения к базе данных
$servername = "localhost";
$username = "gogortv0_plants1";
$password = "&0k&wCnZ";
$dbname = "gogortv0_plants1";
 
// Создание подключения
$conn = new mysqli($servername, $username, $password, $dbname);
 
// Проверка подключения
if ($conn->connect_error) {
    die("Ошибка подключения: " . $conn->connect_error);
}
 
echo "Подключение к базе данных успешно установлено";
?>