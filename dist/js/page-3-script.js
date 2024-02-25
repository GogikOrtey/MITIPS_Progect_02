
// ------------------------------------------------------------------- //
// 	            Ждём, пока DOM-модель полностью загрузится:	           //                                              
// ------------------------------------------------------------------- // 

document.addEventListener('DOMContentLoaded', function() { 
    let header = document.querySelector('header');
    let width = window.innerWidth;
    if (width < 650) {
        header.style.backgroundImage = "url('css/img/Header_Photo/B (1)_small.jpg')";
        header.style.backgroundSize = "cover";
    }

    document.querySelector('.load-more').style.display = 'none';
    document.querySelector('.go-back-to-main').style.display = 'none';
    document.querySelector('#main-2').style.display = 'none';
    document.querySelector('#main-1').style.display = 'none';
    document.querySelector('.please-wait').style.display = 'flex';
    //UpdateDevelomMode();

    // Скрывет все блоки с классом "block-qu", в начале
    const elements = document.querySelectorAll('.block-qu');

    elements.forEach(element => {
      element.style.display = 'none';
    });

    document.querySelector('.load-more').addEventListener('click', function() {
        LoadMoreFn();
    });

    function LoadMoreFn() {
        limitter = 24;
        showCards(data_Plants);      
        document.querySelector('#main-2').style.display = 'flex';  
    }

    let GoToMainPage = document.querySelector('.go-back-to-main');
    
    GoToMainPage.addEventListener('click', function() {
        window.location.href = 'index.html';
    });

    let GoToMainPage2 = document.querySelector('#main-1 ');
    
    GoToMainPage2.addEventListener('click', function() {
        window.location.href = 'index.html';
    });

    let span = document.querySelector('.please-wait span');
    let colors = ['darkgray', 'lightgray'];
    let i = 0;
    
    setInterval(function() {
      span.style.color = colors[i % colors.length];
      i++;
    }, 500);

    // Также скрывает все особые блоки и кнопки, в начале
    // document.getElementsByClassName('butt-final')[0].style.display = 'none';
    // document.getElementsByClassName('block-request')[0].style.display = 'none';
    // document.querySelector('.butt-final-2').style.display = 'none';
    // document.querySelector('.reauest-2-only-color').style.display = 'none';

    // document.querySelector('.loadd').style.display = 'none';
    // document.querySelector('.result-cards').style.display = 'none';
    // document.querySelector('.zero-reauest').style.display = 'none';

    // ------------------------------------------------------------------- //
    // 	             Обработчик событий для кнопки старта:	               //                                              
    // ------------------------------------------------------------------- // 

    // document.querySelector('.load-req').addEventListener('click', function() {
    //     AllReq();
    // });

    AllReq();

    // ------------------------------------------------------------------- //
    // 	                Случайный цвет для кнопок ответа:	               //
    // ------------------------------------------------------------------- // 

    // Случайный цвет (зелёный/жёлтый/красный), в зависимости от класса кнопки:

    var buttons = document.querySelectorAll('.good-button, .gerat-button, .bad-batton');

    function getRandomColor(minHue, maxHue) {
        var hue = Math.floor(Math.random() * (maxHue - minHue + 1)) + minHue;
        return 'hsl(' + hue + ', 100%, 50%)';
    }

    buttons.forEach(function(button) {
        var color;

        // Устанавливаю случайные цвета для кнопок ответов, в зависимости от их классов:
        if (button.classList.contains('good-button')) {
            color = getRandomColor(120, 60);    // От зелёного до жёлтого
        } else if (button.classList.contains('gerat-button')) {
            color = getRandomColor(60, 30);     // От жёлтого до ораньжевого
        } else if (button.classList.contains('bad-batton')) {
            color = getRandomColor(30, 0);      // От ораньжевого до красного
        }
        button.style.backgroundColor = color;
    });



    // ------------------------------------------------------------------- //
    // 	      Обрабатываю нажатие на кнопку "Показать результаты":	       //                                              
    // ------------------------------------------------------------------- // 

    //FinalButtonProc();

    // ------------------------------------------------------------------- //
    // 	        Обрабатываю нажатие на кнопку "Пройти ещё раз"             //
    // ------------------------------------------------------------------- // 

    // Перезагружаю страницу, если нажата кнопка "Пройти ещё раз"
    //ReloadPageButtonProc();

    // --------------------------------------------------------------------- //
    // Подгружаю новые карточки, если пользователь долистал до низа страницы //
    // --------------------------------------------------------------------- // 

    window.onscroll = function() {
        var offset = window.pageYOffset + window.innerHeight;
        var height = document.body.offsetHeight;

        let downOffsetSet = 150;
    
        if(window.innerWidth < 650) { downOffsetSet = 500; } else { downOffsetSet = 150; }

        if (offset >= height - downOffsetSet) {
            console.log('Вы достигли 150 пикселей от низа страницы или ниже');
            
            
            //AddClickEventFromCards(); // Добавляю на все карточки код, который по нажанию показывет модальные окна, с переходом на страницу поиска в Яндексе

            if(boolIsFinalLoad !== true) {
                if(isOwerDownLoad <= 0) {
                    isOwerDownLoad = 5;
                    LoadMoreFn();
                }
            }

            //RemoveAllModals(); // Сначала удаляю все модельные окна с карточек
        }
    };
    
    //RemoveAllModals(); // Сначала удаляю все модельные окна с карточек
    // Т.к. это вызывает проблемы, когда мои карточки автоматически загружаются
    //AddClickEventFromCards(); // Добавляю на все карточки код, который по нажанию показывет модальные окна, с переходом на страницу поиска в Яндексе
});

function AddClickEventFromCards() {
    // ------------------------------------------------------------------- //
    // 	          Всплывающее окно "Узнать о растении больше"              //
    // ------------------------------------------------------------------- // 

    document.querySelectorAll('.card').forEach((card) => {
        card.addEventListener('click', function() {
            let existingModal = document.querySelector('.modal');
            if (existingModal) {
                document.body.removeChild(existingModal);
            }

            let plantName = this.querySelector('span').innerText;
            let modal = document.createElement('div');
            modal.class = 'new-window-1';
            modal.className = 'new-window-1';
            modal.style.position = 'fixed';
            modal.style.top = '0';
            modal.style.left = '0';
            modal.style.width = '100%';
            modal.style.height = '100%';
            modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
            modal.style.display = 'flex';
            modal.style.justifyContent = 'center';
            modal.style.alignItems = 'center';
            modal.style.zIndex = '1000';
            modal.innerHTML = `
                <div style="background-color: white; padding: 20px; border-radius: 10px; position: relative;">
                    <button style="position: absolute; top: 5px; right: 5px; background-color: orange; border: none; border-radius: 5px; width: 30px; height: 30px;">X</button>
                    <p>Хочешь узнать о растении больше?</p>
                    <button style=" border: none; border-radius: 15px; height: 50px; font-size: 20px; width: 100%; margin: auto; display: block; :hover { background-color: yellow; }" onclick="window.open('https://yandex.ru/search/?text=растение%20${plantName}', '_blank')">Перейти в Яндекс</button>
                </div>
            `;
            modal.querySelector('button').addEventListener('click', function() {
                document.body.removeChild(modal);
            });
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    document.body.removeChild(modal);
                }
            });
            document.body.appendChild(modal);
        });
    });
}

// function RemoveAllModals() {
//     document.querySelectorAll('.card').forEach((card) => {
//         let clone = card.cloneNode(true);
//         card.parentNode.replaceChild(clone, card);
//     });
// }

function RemoveAllModals() {
    document.querySelectorAll('.card').forEach((card) => {
        let clone = card.cloneNode(true);
        card.parentNode.replaceChild(clone, card);

        // Находим все изображения в клонированной карточке
        clone.querySelectorAll('img').forEach((img) => {
            img.onerror = function() {
                // Обработка ошибки
                // Создаем массив с именами файлов изображений
                let imageNames = Array.from({length: 13}, (_, i) => `img/plant-image/P_${String(i+1).padStart(2, '0')}.png`);

                // Перемешиваем массив
                imageNames.sort(() => Math.random() - 0.5);

                img.src = imageNames[0];

                console.log('Ошибка при загрузке изображения. Заменили его на изображение ' + imageNames[0]);
            };
        });
    });
}


let isOwerDownLoad = 0;

setInterval(function() {
    if(isOwerDownLoad > 0) isOwerDownLoad--;
}, 10);

function AllReq() {
    console.log("Отправляем на сервер запрос: " + strRequare);
    SQL_RQ_FromSwever(strRequare);
}


// ------------------------------------------ //
// 	          Создание SQL-запроса:           //
// ------------------------------------------ // 

strRequare = "SELECT * FROM MainTable";
//strRequare = "SELECT plant_name FROM MainTable";

// Запрос на сортировку в нужном порядке:
str_SortMainReq = ''; 

// Не использую сортировку в SQL-запросе, т.к. я всё равно перемешиваю все навания, когда получаю их

str_SortMainReq = `
ORDER BY 
    is_famous DESC
`;
// str_SortMainReq = `
// ORDER BY 
//     is_famous DESC,  
//     CASE plant_color_description 
//         WHEN 'разноцветный' THEN 1 
//         WHEN 'белый' THEN 2 
//         WHEN 'жёлтый' THEN 3 
//         WHEN 'голубой' THEN 4 
//         WHEN 'серебристый' THEN 5 
//         WHEN 'бордовый' THEN 6 
//         WHEN 'красный' THEN 7 
//         WHEN 'оранжевый' THEN 8 
//         WHEN 'пёстрый' THEN 9 
//         WHEN 'пурпурный' THEN 10 
//         WHEN 'розовый' THEN 11 
//         WHEN 'синий' THEN 12 
//         WHEN 'фиолетовый' THEN 13
//         WHEN 'Зелёный с белой каймой' THEN 14
//         WHEN 'Зелёный с белыми или розовыми разводами' THEN 15
//         WHEN 'Зелёный с красными прицветниками' THEN 16
//         WHEN 'Зелёный с пятнами' THEN 17
//         WHEN 'Зелёный с разноцветными прожилками' THEN 18
//         WHEN 'Зелёный с серебристым оттенком' THEN 19
//         ELSE 20
//     END
// `;

strRequare += str_SortMainReq;

// ------------------------------------------------------------------- //
// 	   Запрос к серверу, и выполнение SQL-кода, через php скрипт:      //
// ------------------------------------------------------------------- // 

var sql_2 = ""; // Запрос, который мы посылаем к БД чезе подкючение к php скрипту

// Пример запроса:
// var sql_2 = "SELECT plant_name FROM MainTable WHERE plant_type_description = 'Уличное' AND (allelopathy_description = 'Нейтральная' OR allelopathy_description = 'Положительная') AND (care_instructions >= 6)";

let isEmptyBDAnswer = false;    // Мы получили непустой ответ от БД?
let isGreenZeroRequest = false; // Если в нашем 1м запросе уже был указан зелёный цвет (тогда мы не посылаем 2й запрос, а выводим, что нет результатов)

// Запрос к БД растений:
function SQL_RQ_FromSwever(sql_2) {
    // Используем асинхронную функцию для запроса-ответа к серверу
    $.ajax({

        // Подключаемся к php файлу на сервере
        type: "POST",
        url: "https://gogortey.ru/res/getdata_2.php",
        
        // Отправляем туда наш SQL-запрос
        data: { sql: sql_2 },

        // Когда получим ответ:
        success: function(data_inp) {

            // Если сервер вернул пустой ответ:
            if(data_inp == "0 results[]") {                

                console.log("Пустой ответ");
                isEmptyBDAnswer = false;            

                if(allCountOfRequ >= 2) {
                    isGreenZeroRequest = true;
                    ZeroReauest_Show();
                }
                if(colors['green'] == false) {
                    Requ_2_OnlyGettingColor();
                } else {
                    isGreenZeroRequest = true;
                    ZeroReauest_Show();
                }
                
            // Если в нашем SQL-запросе появились лишние функции, типа DELETE или CREATE (была попытка SQL-инъекции)
            } else if(data_inp.startsWith("Неверный запрос")) {                 

                console.log(data_inp);
                isEmptyBDAnswer = false;
                docWrite_01(data_inp);
                
                ZeroReauest_Show();

            // Если мы получили нужный ответ от БД:
            } else {                

                allCountOfRequ = 3; // Устанавливаем, что бы 2й запрос точно не прошёл
                isEmptyBDAnswer = true;

                var data = JSON.parse(data_inp);

                JSON_Parser_OnConsole(data);    // Сначала выводим полученный из БД ответ, в консоль
                JSON_Parser_OnHTMLPage(data);   // Затем, обрабатываем, для вывода на страницу, в карточках

                return(data);
            }
            //console.log(data);
        }
    });

    // Вывод полученного ответа от БД в консоль
    function JSON_Parser_OnConsole(data) {
        for (var i = 0; i < data.length; i++) {
            //console.log(data[i]); // Выводим каждую строку в консоль
        }
    }

    // Обработка полученного ответа от БД, для вывода в карточки
    function JSON_Parser_OnHTMLPage(data) {
        var plantNames = ""; 

        plantNames = OnPageWeu_02(data);

        if(plantNames == "Пустой ответ" || isGreenZeroRequest === true || data.length == 0) {
            // Показываем карточку "Мы не смогли подобрать для вас растения"

            ZeroReauest_Show(); 
        } else {
            data_Plants = data;
            showCards(data);
        }  
    }    
}

data_Plants = [];

// Перебираем данные из массива в строку
function OnPageWeu_02(data) {
    let plantNames = "";

    //console.log("Обрабатываем такую строку:" + data);
    
    if (isEmptyBDAnswer) {
        for (let i = 0; i < data.length; i++) {
            plantNames += data[i].plant_name;
            if (i < data.length - 1) { 
                // Если это не последнее растение, добавляем запятую и пробел
                plantNames += ", ";
            }
        }
    } else {
        plantNames = "Пустой ответ";
    }

    //console.log("На выходе получили такую:" + plantNames);

    return plantNames;
}

// ------------------------------------------ //
// 	         Отображение карточек:            //
// ------------------------------------------ // 

let loadedCards = 0;
let limitter = 18;
let boolIsFinalLoad = false;

function showCards(data) {
    let container = document.querySelector('.card-holder');

    for(let i = loadedCards; i < loadedCards + limitter && i < data.length; i++) {
        let item = data[i];

        if(item.plant_name != "Бересклет") {
            let card = document.createElement('div');
            let img = document.createElement('img');
            let span = document.createElement('span');
    
            card.className = 'card';
            if(window.innerWidth > 650) {
                img.src = `img/all-plants-photo/Растение ${item.plant_name}.jpg`;
            } else {
                img.src = `img/all-plants-photo-small/Растение ${item.plant_name}.jpg`;
            }
            img.onerror = function() {
                // Обработка ошибки
                // Создаем массив с именами файлов изображений
                let imageNames = Array.from({length: 13}, (_, i) => `img/plant-image/P_${String(i+1).padStart(2, '0')}.png`);

                // Перемешиваем массив
                imageNames.sort(() => Math.random() - 0.5);

                img.src = imageNames[0];

                console.log('Ошибка при загрузке изображения "' + item.plant_name + '". Заменили его на изображение ' + imageNames[0]);
            };
            span.textContent = item.plant_name;
    
            card.appendChild(img);
            card.appendChild(span);
    
            container.appendChild(card);

            if(i == (data.length - 1)) {
                boolIsFinalLoad = true;
            }
        }
    }

    if(boolIsFinalLoad == false) {
        document.querySelector('.load-more').style.display = 'flex';
    } else {
        document.querySelector('.load-more').style.display = 'none';
    }
    document.querySelector('.please-wait').style.display = 'none';
    document.querySelector('#main-1').style.display = 'flex';

    loadedCards += limitter;    

    RemoveAllModals();
    AddClickEventFromCards(); // Обновляю события для нажатий на карты
}

// Показываем блок карточек, и выводим их в нужном порядке
function docWrite_01(text, data) {
    document.querySelector('.loadd').style.display = 'none';
    document.querySelector('.block-request .answ p').innerText = text;
    document.querySelector('.result-cards').style.display = 'grid';   

    document.querySelector('.butt-final-2').style.display = 'flex';
    document.querySelector('.butt-final-2').scrollIntoView({behavior: "smooth"});

    console.log("Отправляем вот такую строку:" + text); 

    randomImgPlantsCard();  // Устанавливаем случайные картинки из набора, на все карточки
    SetNamePlants(data);    // Устанавливаем нужные названия для карточек, из массива
}

// Устанавливает случайные картинки из набора, на все карточки
function randomImgPlantsCard() {
    // Получаем все элементы img внутри .card
    let images = document.querySelectorAll('.card img');

    // Создаем массив с именами файлов изображений
    let imageNames = Array.from({length: 13}, (_, i) => `img/plant-image/P_${String(i+1).padStart(2, '0')}.png`);

    // Перемешиваем массив
    imageNames.sort(() => Math.random() - 0.5);

    // Присваиваем каждому элементу img случайное изображение из массива
    images.forEach((img, index) => {
        img.src = imageNames[index];
    });
}
