
// Ждём, пока DOM-модель загрузится
document.addEventListener('DOMContentLoaded', function() { 

    KeyValues_GetAndInsertIntoTable_3()

    // Задаём событие по клику, на элемент на Кнопка назад
    document.querySelector('.butt_back.n_but').addEventListener('click', function() {
        window.location.href = 'index.html';
    });

    // Функции для обработки фокуса и нажатий на input элементы формы
    // Здесь прописана логика, как ведут себя элементы, когда они не выбраны, и когда выбраны
    {
        // Обработка элементов типа input range:
        ProccessingInputActive_onElement(1);
        ProccessingInputActive_onElement(3);
        ProccessingInputActive_onElement(4);
        ProccessingInputActive_onElement(7);
        ProccessingInputActive_onElement(8);
        ProccessingInputActive_onElement(9);

        // Для всех контейнеров с элементами типа input checked добавляем событие по нажатию (проставление точки)
        InputAllContainersTouchPoc();

        // Устанавливаем обработчики нажатий для полей, где есть элементы checkbox input
        AllInputCheckboxes()

        // Обработчик для выбора цвета
        ColorLabelInput()
    }

    // Скрывает или показывает кнопку начала подбора
    EndTextTest2()

    // Добавляет обработчик для скрытия ввода характеристик, и показа блока результатов
    DisplayAnswerForPodbor()

    // Добавляет обработчик событий на оранжевые кнопки "Почему это растение попало в набор?"
    OrangeButonActive()
    
    // Устанавливает одно из 3х значений типа климата
    UpdateClimatTypeVal()
});

// ---------

// Хранит значения, для каждого элемента
let arrayOfCange = Array(12).fill(0);
// Важно: отсчёт начинается с 1го элемента, а не с 0го

// ---------

// Автоматическая функция, которая извлекает из каждой записи в JSON формате, данные
// по одному (указанному) полю
// response - ответ в формате JSON, selector - то поле, из которого мы извлекаем данные в массив
function ConvertJSON_to_massiv(response, selector) {
    const result = response.map(item => item[selector]);
    return result;
}

// Запрос к БД растений:
function SQL_RQ_FromServer2(sql_2, selector, mode) {
    // Используем асинхронную функцию для запроса-ответа к серверу
    $.ajax({

        // Подключаемся к php файлу на сервере
        type: "POST",
        url: "https://gogortey.ru/res/execute_4.php",
        
        // Отправляем туда наш SQL-запрос
        data: { sql: sql_2 },

        // Когда получим ответ:
        success: function(data_inp) {
            //console.log(data_inp);
            let decodeData

            if(data_inp != "0 results[]" && data_inp != "Неверный запрос: ") {
                try { decodeData = JSON.parse(data_inp);} // Преобразуем строку JSON в объект JavaScript
                catch {
                    console.error("Ошибка при декодировании ответа из JSON формата: Сервер отправил нетипичный ответ.")
                    if(data_inp != "Неверный запрос: ") {
                        console.error("На запрос: '" + sql_2 + "', cервер отправил некорректный ответ: " + data_inp);
                    }
                }
            }
            
            if(mode == 0) { // Когда запрос не требует ответа
                console.log("Запрос выполнен, получен ответ: " + data_inp)

            } else if(mode == 1) {
                // console.log(data_inp)
                // console.log(decodeData);
                resultMass = ConvertJSON_to_massiv(decodeData, selector)
                Return_KeyValues_GetAndInsertIntoTable_3(resultMass)
            } else if (mode == 2) {
                resultMass = ConvertJSON_to_massiv(decodeData, selector)
                //GetPlantList_andInsertFromLabel(resultMass);
                // Обработка выделения элементов в синем блоке
                //ProcessSelectObjectForBlueBlock();
                //console.log(resultMass)
                ProcessAllPlantsMass(resultMass)

            } else {
                console.log(decodeData);
            }
        }
    })
}


// ---------
// Загрузка элементов цвета

// Получение значений, и их вставка в таблицы, для ключевых признаков
function KeyValues_GetAndInsertIntoTable_3() {
    resultMass = SQL_RQ_FromServer2("SELECT * FROM `PlantColors_2`", "plant_color_description", 1)
    //console.log(resultMass);
}

// Выводит в консоль список всех цветов
function Return_KeyValues_GetAndInsertIntoTable_3(resultMass) {
    console.log("Все цвета:")
    console.log(resultMass)

    createCheckboxesFromArray(resultMass, 'color-checkbox');
}

// Заполняет список цветов названиями цветов с сервера
function createCheckboxesFromArray(array, containerId) {
    const parent = document.getElementById('color-checkbox');

    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }

    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with id ${containerId} not found`);
        return;
    }

    array.forEach((value, index) => {
        const checkboxContainer = document.createElement('div');
        checkboxContainer.classList.add('input-checkbox-container');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `checkbox-${index}`;
        checkbox.value = value;

        const label = document.createElement('label');
        label.htmlFor = `checkbox-${index}`;
        label.textContent = value;

        checkboxContainer.appendChild(checkbox);
        checkboxContainer.appendChild(label);

        container.appendChild(checkboxContainer);
    });
}

//const resultMass = ['Белый', 'Жёлтый', 'Зелёный', 'Красный', 'Оранжевый', 'Пёстрый', 'Пурпурный', 'Разноцветный', 'Розовый', 'Синий', 'Фиолетовый'];





// ---------
// Обработчик элементов input


// Обработка элементов типа input range:
function ProccessingInputActive_onElement(elementNumber) {

    // Формируем селектор элемента
    const inputRange = document.querySelector(`#pg5-el-${elementNumber} input[type="range"]`);
    const resetBlock = document.querySelector('#pg5-el-' + elementNumber + ' .pg5-block');

    //console.log("Используем элемент: " + resetBlock);
    
    // Скрываем блок сброса при загрузке страницы
    resetBlock.style.opacity = 0;
    
    // Обработчик события фокуса на input
    inputRange.addEventListener('focus', () => {
        // Показываем блок сброса
        resetBlock.style.opacity = 1;
        // Делаем ползунок прозрачным
        inputRange.style.opacity = 1;
    });

    // будет содержать новое значение элемента range
    inputRange.addEventListener('input', () => {
        arrayOfCange[elementNumber] = inputRange.value;
        //console.log("Записали в массив" + elementNumber + " значение: " + arrayOfCange[elementNumber]);
    });
    
    // Обработчик события нажатия на блок сброса
    resetBlock.addEventListener('click', () => {
        // Скрываем блок сброса
        resetBlock.style.opacity = 0;
        // Снижаем прозрачность ползунка
        inputRange.style.opacity = 0.3;
        // Сбрасываем значение ползунка
        inputRange.value = 1;
        arrayOfCange[elementNumber] = 0;
        //console.log("Записали в массив" + elementNumber + " значение: " + arrayOfCange[elementNumber]);
    }); 
}

// Для всех контейнеров с элементами типа input checked добавляем событие по нажатию (проставление точки)
function InputAllContainersTouchPoc() {
    const inputContainers = document.querySelectorAll('.input-point-container');

    // Функция для установки checked нажатому input
    function setChecked(container) {
        const input = container.querySelector('input');
        input.checked = true;
    }
      
      // Обработка нажатий на контейнеры с точками
    inputContainers.forEach(container => {
        container.addEventListener('click', () => {
          setChecked(container);
        });
    });
}

// Устанавливаем обработчики нажатий для полей, где есть элементы checkbox input
function AllInputCheckboxes() {
    resetButton1 = document.querySelector('#pg5-el-2 .pg5-block');
    resetButton1.style.opacity = 0;
    resetButton1.addEventListener('click', function() {
        //console.log("Нажата кнопка reset 2");
        allInputOfThisPlase = document.querySelectorAll('#pg5-el-2 input');
        //console.log(allInputOfThisPlase);
        allInputOfThisPlase.forEach((element) => {
            element.checked = false;
        });
        arrayOfCange[2] = 0;
        resetButton1.style.opacity = 0;
    });
    
    blockElementInp = document.querySelector('#pg5-el-input-ch-1');
    //console.log(blockElementInp);
    blockElementInp.addEventListener('click', function() {
        //console.log("12313");
        arrayOfCange[2] = 1;
        resetButton1.style.opacity = 1;
    });
    blockElementInp = document.querySelector('#pg5-el-input-ch-2');
    blockElementInp.addEventListener('click', function() {
        arrayOfCange[2] = 2;
        resetButton1.style.opacity = 1;
    });
    blockElementInp = document.querySelector('#pg5-el-input-ch-3');
    blockElementInp.addEventListener('click', function() {
        arrayOfCange[2] = 3;
        resetButton1.style.opacity = 1;
    });


    resetButton2 = document.querySelector('#pg5-el-5 .pg5-block');
    resetButton2.style.opacity = 0;
    resetButton2.addEventListener('click', function() {
        //console.log("Нажата кнопка reset 2");
        allInputOfThisPlase = document.querySelectorAll('#pg5-el-5 input');
        //console.log(allInputOfThisPlase);
        allInputOfThisPlase.forEach((element) => {
            element.checked = false;
        });
        arrayOfCange[5] = 0;
        resetButton2.style.opacity = 0;
    });

    blockElementInp = document.querySelector('#pg5-el-input-ch-4');
    blockElementInp.addEventListener('click', function() {
        arrayOfCange[5] = 1;
        resetButton2.style.opacity = 1;
    });
    blockElementInp = document.querySelector('#pg5-el-input-ch-5');
    blockElementInp.addEventListener('click', function() {
        arrayOfCange[5] = 2;
        resetButton2.style.opacity = 1;
    });


    resetButton3 = document.querySelector('#pg5-el-6 .pg5-block');
    resetButton3.style.opacity = 0;
    resetButton3.addEventListener('click', function() {
        allInputOfThisPlase = document.querySelectorAll('#pg5-el-6 input');
        allInputOfThisPlase.forEach((element) => {
            element.checked = false;
        });
        arrayOfCange[6] = 0;
        resetButton3.style.opacity = 0;
    });

    blockElementInp = document.querySelector('#pg5-el-input-ch-6');
    blockElementInp.addEventListener('click', function() {
        arrayOfCange[6] = 1;
        resetButton3.style.opacity = 1;
    });
    blockElementInp = document.querySelector('#pg5-el-input-ch-7');
    blockElementInp.addEventListener('click', function() {
        arrayOfCange[6] = 2;
        resetButton3.style.opacity = 1;
    });


    resetButton4 = document.querySelector('#pg5-el-11 .pg5-block');
    resetButton4.style.opacity = 0;
    resetButton4.addEventListener('click', function() {
        allInputOfThisPlase = document.querySelectorAll('#pg5-el-11 input');
        allInputOfThisPlase.forEach((element) => {
            element.checked = false;
        });
        arrayOfCange[11] = 0;
        resetButton4.style.opacity = 0;
    });

    blockElementInp = document.querySelector('#pg5-el-input-ch-8');
    blockElementInp.addEventListener('click', function() {
        arrayOfCange[11] = 1;
        resetButton4.style.opacity = 1;
    });
    blockElementInp = document.querySelector('#pg5-el-input-ch-9');
    blockElementInp.addEventListener('click', function() {
        arrayOfCange[11] = 2;
        resetButton4.style.opacity = 1;
    });
}

// Обработчик для выбора цвета
function ColorLabelInput() {

    document.querySelector('#pg5-el-10 .pg5-block').style.opacity = 0;

    function isChecked() {
      const checkboxes = document.querySelectorAll('#pg5-el-10 .pg5-checkbox-cont input[type="checkbox"]');
      //console.log(checkboxes);
      for (const checkbox of checkboxes) {
        if (checkbox.checked == true) {
          return true;
        }
      }
      return false;
    }

    function uncheckAll() {
      const checkboxes = document.querySelectorAll('#pg5-el-10 .pg5-checkbox-cont input[type="checkbox"]');
      for (const checkbox of checkboxes) {
        checkbox.checked = false;
      }
    }

    document.querySelectorAll('#pg5-el-10 .pg5-checkbox-cont input[type="checkbox"]').forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        if (isChecked()) {
            arrayOfCange[10] = 1;
          document.querySelector('#pg5-el-10 .pg5-block').style.opacity = 1;
        } else {
            arrayOfCange[10] = 0;
            document.querySelector('#pg5-el-10 .pg5-block').style.opacity = 0;
        }
        //console.log(arrayOfCange);
      });
    });

    document.querySelector('#pg5-el-10 .pg5-block').addEventListener('click', () => {
        arrayOfCange[10] = 0;
      document.querySelector('#pg5-el-10 .pg5-block').style.opacity = 0;
      uncheckAll();
    });

}

// Эта функция просматривает все события нажатия на элементы, в блоке ввода характеристик
// И если выбран хоть один элемент - она показывает синюю кнопку, по которой можно начать подбор растений
function EndTextTest2() {
    //document.querySelector('p.pg5-add-p-1#pg5-el-6').textContent = arrayOfCange;

    // Возвращает true, если нашёлся хотя бы один элемент отличный от 0
    function CheckArrayFull(mass) {
        return mass.some(element => element > 0);
    }

    // Ищу все элементы, по нажатию на которые может измениться число выбранных input элементов на форме
    allInputs =  document.querySelectorAll("input");
    allRadioButtons =  document.querySelectorAll(".input-checkbox-container");
    allPointButtons =  document.querySelectorAll(".input-point-container");
    allResetButtons =  document.querySelectorAll(".pg5-block");

    // Корректно совмещаю все элементы в один массив, для дальнейшего перебора
    allElements = [...allInputs, ...allRadioButtons, ...allPointButtons, ...allResetButtons];
    //console.log(allElements);

    blueButtonOfStartPodbor = document.querySelector('.pg5-start-button');
    textOfNotOnceInputSelected = document.querySelector('p.pg5-add-p-1#pg5-el-6');

    blueButtonOfStartPodbor.style.display = "none"

    allElements.forEach(elemINp => {
        elemINp.addEventListener('click', () => {
            //document.querySelector('p.pg5-add-p-1#pg5-el-6').textContent = arrayOfCange;

            if(CheckArrayFull(arrayOfCange) == true) {
                //console.log("Хотя бы один элемент выбран");
                blueButtonOfStartPodbor.style.display = "grid";
                textOfNotOnceInputSelected.style.display = "none";
            } else {
                //console.log("Ни один элемент не выбран");
                blueButtonOfStartPodbor.style.display = "none";
                textOfNotOnceInputSelected.style.display = "block";
            }
        });
    });
 
}


// = true, если пришёл не пустой ответ от БД
// Важно: Ответ также должен содержать 3 или больше растений !!!
boolisRequestGood = true;

MainState = 0

// !!! Тут нужно будет допилить - собрать характеристики, отправить их в php на сервер
// На сервере - собрать запрос, и прислать ответ
// Код разбора ответа можно взять из старого скрипта
// И только потом запускать эту функцию
// А пока ответ идёт - показать только иконку загрузки

// Это - шаблон! Не рабочая функция

// Добавляет обработчик для скрытия ввода характеристик, и показа блока результатов
function DisplayAnswerForPodbor() {
    UpdateClimatTypeVal()

    blockMainInputCharact = document.querySelector("#main-block-input-charact");
    blockElementLoad = document.querySelector(".loadd");
    blockCurrentAnswer = document.querySelector("#curr-answ");
    blockNotCurrentAnswer = document.querySelector("#not-curr-answ");

    blockExplanation  = document.querySelector("#expl-block");

    // С курсором мышки проверить дополнительно

    //Виден только блок ввода характеристик
    blockCurrentAnswer.style.display = "none";
    blockNotCurrentAnswer.style.display = "none";
    blockExplanation.style.display = "none";
    blockElementLoad.style.display = "none";

    // Видны все элементы
    // blockElementLoad.style.display = "grid";
    // blockCurrentAnswer.style.display = "block";
    // blockNotCurrentAnswer.style.display = "block";
    // blockExplanation.style.display = "block";
    // document.body.style.cursor = 'default';
    // blockElementLoad.style.cursor = 'default';

    // Видна только загрузка
    // blockMainInputCharact.style.display = "none";
    // blockCurrentAnswer.style.display = "none";
    // blockNotCurrentAnswer.style.display = "none";
    // blockExplanation.style.display = "none";
    // document.body.style.cursor = 'wait';
    // blockElementLoad.style.cursor = 'wait';

    // Результаты с 3мя карточками
    // blockMainInputCharact.style.display = "none";
    // blockNotCurrentAnswer.style.display = "none";
    // blockElementLoad.style.display = "none";
    // blockExplanation.style.display = "none";

    // Пустой результат
    // blockMainInputCharact.style.display = "none";
    // blockElementLoad.style.display = "none";
    // blockExplanation.style.display = "none";
    // blockCurrentAnswer.style.display = "none";
    // blockNotCurrentAnswer.style.display = "block";

    // Показывается модуль объяснения результата
    //blockExplanation.style.display = "block";

    // По нажатию на кнопку "Пройти езё раз" - страница перезагружается
    buttRestart = document.querySelectorAll("#butt-restart");

    buttRestart.forEach(elem => {
        elem.addEventListener('click', () => {
            location.reload();
        })
    })

    buttStart = document.querySelector(".pg5-start-button");


    buttStart.addEventListener('click', () => {
        console.log("Все значения указанных характеристик:")
        console.log(arrayOfCange)

        // Видна только загрузка
        blockMainInputCharact.style.display = "none"; // < ------------------------------ Раскомментировать !
        // blockCurrentAnswer.style.display = "none";
        // blockNotCurrentAnswer.style.display = "none";
        // blockExplanation.style.display = "none";
        blockElementLoad.style.display = "grid";
        document.body.style.cursor = 'wait';
        blockElementLoad.style.cursor = 'wait';

        GetValuesFromHaract();
        CheckCountSelectedHaract()

        setTimeout(function() {                        
            document.body.style.cursor = 'default';
            blockElementLoad.style.cursor = 'default';
            blockElementLoad.style.display = "none";

            if(boolisRequestGood) {
                // Хорошие результаты
                blockCurrentAnswer.style.display = "block";
            } else {
                // Плохие результаты
                blockNotCurrentAnswer.style.display = "block";
                blockMainInputCharact.style.display = "none";
                blockElementLoad.style.display = "none";
                blockExplanation.style.display = "none";
                blockCurrentAnswer.style.display = "none";
            }
        }, 500);
    })
}

// Добавляет обработчик событий на оранжевые кнопки "Почему это растение попало в набор?"
function OrangeButonActive() {

    // Получаем все кнопки
    let buttons = document.querySelectorAll('.pg5-req-butt');

    // Добавляем обработчик событий для каждой кнопки
    buttons.forEach(function(button, index) {
        button.addEventListener('click', function() {
            // Получаем название растения
            var plantName = document.querySelector('.pg5-lvl2-cont-1 .pg5-lvl2-block:nth-child(' + (index + 1) + ') .pg5-lvl4-name-pl').textContent;
            // Выводим название растения в консоль
            console.log("Вывод пояснений к растению: " + plantName);
            ShowExplanBlock(plantName);
        });
    });    
}

// Показывает модуль объяснений, пролистывает до него, и устанавливает название растения в нужное место
function ShowExplanBlock(plantName) {

    // Показывается модуль объяснения результата
    blockExplanation.style.display = "block";

    plantExplHeadText = document.querySelector('#plant-name-expl-module');
    plantExplHeadText.textContent = plantName;
    plantExplHeadText.scrollIntoView({behavior: "smooth"});

    // !!! Вот здесь - запрос к БД, на все характеристики этого растения, по имени
}



// ---------
// Играюсь с заголовком

function transformString(inputString) {
    if (inputString.length !== 14) {
        return "Длина строки должна быть ровно 14 символов";
    }

    let lowerCaseString = inputString.toLowerCase();
    let randomIndexes = [];
    
    while (randomIndexes.length < 3) {
        let randomIndex = Math.floor(Math.random() * 14);
        if (!randomIndexes.includes(randomIndex)) {
            randomIndexes.push(randomIndex);
        }
    }

    let transformedString = lowerCaseString.split('').map((char, index) => {
        if (randomIndexes.includes(index)) {
            return char.toUpperCase();
        }
        return char;
    }).join('');

    return transformedString;
}

// Играюсь с заголовком
setInterval(function () {
    //console.log('Таймер сработал!');
    RandomLetterForHtach() // <----------------------------------- Раскомментировать строчку
}, 1500);

// // Пример использования
// let inputString = "РешателЬ заДач";
// let result = transformString(inputString);
// console.log(result);

htach = document.querySelector('.pg4-p1');

function RandomLetterForHtach() {
    htach.textContent = transformString(htach.textContent)
}




// ---------
// Пишу блок объяснений

str_finalAnsw = "" // Что получится в финале объяснений

// Выбирает все выбранные харктеристики, и приписывает их значения в модуль объяснений, ко всем растениям
function GetValuesFromHaract() {
    if (arrayOfCange[1] != 0) {
        str_finalAnsw += arrayOfCange[1] + " ∈ Освещение, "
    } if (arrayOfCange[2] != 0) {
        str_finalAnsw += 'Переносимость прямого света = "'
        if (arrayOfCange[2] == 1) str_finalAnsw += "Да"
        if (arrayOfCange[2] == 2) str_finalAnsw += "Средне"
        if (arrayOfCange[2] == 3) str_finalAnsw += "Нет"
        str_finalAnsw += '", '
    } if (arrayOfCange[3] != 0) {
        str_finalAnsw += arrayOfCange[3] + " ∈ Относительная влажность, "
    } if (arrayOfCange[4] != 0) {
        str_finalAnsw += arrayOfCange[4] + " ∈ Температура, "
    } if (arrayOfCange[5] != 0) {
        str_finalAnsw += 'Тип растения = "'
        if (arrayOfCange[5] == 1) str_finalAnsw += "Домашнее"
        if (arrayOfCange[5] == 2) str_finalAnsw += "Уличное"
        str_finalAnsw += '", '
    } if (arrayOfCange[6] != 0) {
        str_finalAnsw += 'Плодоносное? = "'
        if (arrayOfCange[6] == 1) str_finalAnsw += "Да"
        if (arrayOfCange[6] == 2) str_finalAnsw += "Нет"
        str_finalAnsw += '", '
    } if (arrayOfCange[7] != 0) {
        str_finalAnsw += arrayOfCange[7] + " ∈ Выработка кислорода, "
    } if (arrayOfCange[8] != 0) {
        str_finalAnsw += arrayOfCange[8] + " ∈ Занимаемая площадь, "
    } if (arrayOfCange[9] != 0) {
        str_finalAnsw += arrayOfCange[9] + " ∈ Уход за растением (кол-во дней), "
    } if (arrayOfCange[11] != 0) {
        str_finalAnsw += 'Известное растение? = "'
        if (arrayOfCange[11] == 1) str_finalAnsw += "Да"
        if (arrayOfCange[11] == 2) str_finalAnsw += "Нет"
        str_finalAnsw += '", '
    }

    str_finalAnsw = str_finalAnsw.slice(0, -2);

    //console.log("Результат: " + str_finalAnsw)

    document.querySelector("#p-result-answer").textContent = str_finalAnsw
}



// --------
// Выбор типа климата для набора

mass_climatTypes = ["Субтропический", "Умеренный", "Тропический"]

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

int_randomVal = getRandomInt(1, 3);
//console.log("int_randomVal = " + int_randomVal); 

function UpdateClimatTypeVal() {
    blocksOfClType = document.querySelectorAll(".clim-type-block")
    //console.log("Устанавливаю климат")

    blocksOfClType.forEach(elem => {
        elem.textContent = mass_climatTypes[int_randomVal - 1]
    })

    blocksOfClType_2 = document.querySelectorAll(".clim-block-main")

    blocksOfClType_2.forEach(elem => {
        if(int_randomVal == 1) {
            elem.classList.add('color-block-green');
        } else if(int_randomVal == 2) {
            elem.classList.add('color-block-blue');
        } else {
            elem.classList.add('color-block-yellow');
        }
    })

    UpdateAllelopTypeVal();
}



// --------
// Выбор Аллелопатии для набора

//mass_allelopTypes = ["Нейтральная", "Положительная"]

int_randomVal_allelop = getRandomInt(1, 10);
console.log("int_randomVal_allelop = " + int_randomVal_allelop); 

function UpdateAllelopTypeVal() {
    if(int_randomVal_allelop == 10) {
        blocksOfClType = document.querySelectorAll(".allelop-type-block")
    
        blocksOfClType.forEach(elem => {
            elem.textContent = "Положительная"            
        })

        blocksOfClType_2 = document.querySelectorAll(".allelop-block-main")

        blocksOfClType_2.forEach(elem => {
            if(int_randomVal_allelop == 10) {
                elem.classList.add('color-block-green');
            }
        })
    }
}




// ---------
// Будет ли показан блок результатов с 3мя карточками
// Если человек выбрал больше 5 характеристик - то не будет

function CheckCountSelectedHaract() {
    int_counter = 0;

    for(i = 1; i < arrayOfCange.length; i++) {
        if(arrayOfCange[i] != 0) int_counter++
    }

    console.log("int_counter = " + int_counter)

    if(int_counter > 5) {
        boolisRequestGood = false;
    }
}




// ---------
// Получаю названия растений, для формирования 3х карточек

SQL_RQ_FromServer2("SELECT * FROM MainTable_2;", "Название растения", 2)

function ProcessAllPlantsMass(resultMass) {
    //console.log("Все растения:")
    //console.log(resultMass)

    randInt_1 = getRandomInt(1, 45);
    randInt_2 = getRandomInt(46, 95);
    randInt_3 = getRandomInt(96, 140);

    console.log(resultMass[randInt_1], resultMass[randInt_2], resultMass[randInt_3])

    document.querySelector("#plant-name-1").textContent = resultMass[randInt_1]
    document.querySelector("#plant-name-2").textContent = resultMass[randInt_2]
    document.querySelector("#plant-name-3").textContent = resultMass[randInt_3]

    document.querySelector("#plant-name-1-img").src = "img/all-plants-photo/Растение " + resultMass[randInt_1] + ".jpg"
    document.querySelector("#plant-name-2-img").src = "img/all-plants-photo/Растение " + resultMass[randInt_2] + ".jpg"
    document.querySelector("#plant-name-3-img").src = "img/all-plants-photo/Растение " + resultMass[randInt_3] + ".jpg"


    function ErrorImageCon(img) {
        // Обработка ошибки
        // Создаем массив с именами файлов изображений
        let imageNames = Array.from({length: 13}, (_, i) => `img/plant-image/P_${String(i+1).padStart(2, '0')}.png`);
    
        // Перемешиваем массив
        imageNames.sort(() => Math.random() - 0.5);
    
        img.src = imageNames[0];
    
        //console.log('Ошибка при загрузке изображения "' + item.plant_name + '"');
    }

    // Если картинки с нужным именем не нашлось
    document.querySelector("#plant-name-1-img").onerror = function() { ErrorImageCon(document.querySelector("#plant-name-1-img")) }; 
    document.querySelector("#plant-name-2-img").onerror = function() { ErrorImageCon(document.querySelector("#plant-name-2-img")) }; 
    document.querySelector("#plant-name-3-img").onerror = function() { ErrorImageCon(document.querySelector("#plant-name-3-img")) }; 
}

















































/*
// ------------------------------------------------------------------- //
// 	              Переменные для создания SQL-запроса:	               //                                              
// ------------------------------------------------------------------- // 


// ------------------------------------------------------------------- //
// 	            Ждём, пока DOM-модель полностью загрузится:	           //                                              
// ------------------------------------------------------------------- // 

document.addEventListener('DOMContentLoaded', function() { 
    // Устанавливаю версию
    let versionElement = document.querySelector('.version p');
    if(versionElement) {
        versionElement.textContent = '1.16';
    }
    
    let header = document.querySelector('header');
    let width = window.innerWidth;
    if (width < 650) {
        header.style.backgroundImage = "url('css/img/Header_Photo/B (1)_small.jpg')";
        header.style.backgroundSize = "cover";
    }

    // Получение сохраненного значения переменной
    isDevelopModActive = localStorage.getItem('isDevelopModActive');
    
    UpdateDevelomMode();

    // Скрывет все блоки с классом "block-qu", в начале
    const elements = document.querySelectorAll('.block-qu');

    elements.forEach(element => {
      element.style.display = 'none';
    });

    // Также скрывает все особые блоки и кнопки, в начале
    document.getElementsByClassName('butt-final')[0].style.display = 'none';
    document.getElementsByClassName('block-request')[0].style.display = 'none';
    document.querySelector('.butt-final-2').style.display = 'none';
    document.querySelector('.reauest-2-only-color').style.display = 'none';

    document.querySelector('.loadd').style.display = 'none';
    document.querySelector('.result-cards').style.display = 'none';
    document.querySelector('.zero-reauest').style.display = 'none';

    // ------------------------------------------------------------------- //
    // 	             Обработчик событий для кнопки старта:	               //                                              
    // ------------------------------------------------------------------- // 

    document.querySelector('.butt-start').addEventListener('click', function() {
        // По нажатию кнопки Старт, скрываем один блок, и показываем другой:

        console.log("123");
        document.getElementById('block-a').style.display = 'grid';
        document.getElementsByClassName('descr-qu-1-grad')[0].style.display = 'none';
        isStart = true;
    });

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

        // // Устанавливаю случайные цвета для кнопок ответов, в зависимости от их классов:
        // if (button.classList.contains('good-button')) {
        //     color = getRandomColor(120, 60);    // От зелёного до жёлтого
        // } else if (button.classList.contains('gerat-button')) {
        //     color = getRandomColor(60, 30);     // От жёлтого до ораньжевого
        // } else if (button.classList.contains('bad-batton')) {
        //     color = getRandomColor(30, 0);      // От оранжевого до красного
        // }

        // Устанавливаю случайные цвета для кнопок ответов, в зависимости от их классов:
        // Изменил задаваемые цвета, что бы избежать насыщенного красного, т.к. он немного отталкивает
        if (button.classList.contains('good-button')) {
            color = getRandomColor(100, 75);    // От зелёного до жёлтого
        } else if (button.classList.contains('gerat-button')) {
            color = getRandomColor(75, 45);     // От жёлтого до оранжевого
        } else if (button.classList.contains('bad-batton')) {
            color = getRandomColor(45, 15);      // От оранжевого до красного
        }

        button.style.backgroundColor = color;
    });

    // ------------------------------------------------------------------- //
    // 	      Добавляю событие: При нажатии на любую кнопку ответа         //
    // ------------------------------------------------------------------- // 

    // Добавляю событие: При нажатии на любую кнопку
    document.querySelectorAll('.butt-answ').forEach(button => {
        button.addEventListener('click', function() {
            
            //CheckAllBlocks(); // Вызываю обновление всех блоков
            setTimeout(() => {
                CheckAllBlocks(); // Update all the blocks after a 10 millisecond delay
                UpdateDevelomMode();
            }, 1);

            // Добавляю стиль "Нажатой" кнопки к той, которую нажал пользователь
            this.parentElement.querySelectorAll('.butt-answ').forEach(otherButton => {
                // Удаляю стиль "Нажатой" кнопки у всех в этом блоке
                otherButton.classList.remove('active');
            });
            this.classList.add('active'); // Добавляю этот стиль к нажатой
        });
    });

    // ------------------ //
    // 	      Меню        //
    // ------------------ // 

    let GoToPage_2 = document.querySelector('.go-to-page-2');
    let GoToPage_3 = document.querySelector('.go-to-page-3');
    
    GoToPage_2.addEventListener('click', function() {
        window.location.href = 'page_2.html';
    });
    
    GoToPage_3.addEventListener('click', function() {
        window.location.href = 'page_3.html';
    });
    


    // Получаем элементы по классам
    let decrNavMenu = document.querySelector('.decr-nav-menu');
    let contentNavMenu = document.querySelector('.content-nav-menu');
    let buttHideMenu = document.querySelector('.butt-hide-menu');
    
    // Добавляем обработчик события click на .decr-nav-menu
    decrNavMenu.addEventListener('click', function() {
      // Показываем .content-nav-menu и скрываем .decr-nav-menu
      contentNavMenu.style.display = 'grid';
      decrNavMenu.style.display = 'none';
    });
    
    // Добавляем обработчик события click на .butt-hide-menu
    buttHideMenu.addEventListener('click', function() {
      // Показываем .decr-nav-menu и скрываем .content-nav-menu
      decrNavMenu.style.display = 'flex';
      contentNavMenu.style.display = 'none';
    });


    // Добавляю событие: При нажатии на кнопку разработчика в меню
    let buttDevModEnable = document.querySelectorAll('.butt-develop-mode')[0];
    let CircleDevMode = document.querySelectorAll('.butt-develop-mode .circle-dev-mode')[0];

    buttDevModEnable.addEventListener('click', function() {
        if(isDevelopModActive === true) {
            isDevelopModActive = false;
            CircleDevMode.classList.remove('circle-dev-mode-enable-style');
        } else {
            isDevelopModActive = true;
            CircleDevMode.classList.add('circle-dev-mode-enable-style');
        }

        console.log("isDevelopModActive = " + isDevelopModActive);
        UpdateDevelomMode();
    });

    // ------------------------------------------------------------------- //
    // 	  Обработчик событий для всех кнопок ответов, во всех формах:      //
    // ------------------------------------------------------------------- // 

    SetButtonSelection();

    // ------------------------------------------------------------------- //
    // 	      Обрабатываю нажатие на кнопку "Показать результаты":	       //                                              
    // ------------------------------------------------------------------- // 

    FinalButtonProc();

    // ------------------------------------------------------------------- //
    // 	        Обрабатываю нажатие на кнопку "Пройти ещё раз"             //
    // ------------------------------------------------------------------- // 

    // Перезагружаю страницу, если нажата кнопка "Пройти ещё раз"
    ReloadPageButtonProc();

    // ------------------------------------------------------------------- //
    // 	        Обработчик событий для нажатия на кнопки ввода             //
    // ------------------------------------------------------------------- // 
    
    document.querySelectorAll('.butt-answ').forEach(function(button) {
        button.addEventListener('click', function() {
          this.querySelector('input').focus();
        });
    });      

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
});

// ------------------------------------------------------------------- //
// 	  Обработчик событий для всех кнопок ответов, во всех формах:      //
// ------------------------------------------------------------------- // 

// Здесь я прописываю обработчики событий, для всех кнопок ответов, во всех формах
// Тут я устанавливаю для переменных нужные значения. Эти переменные объявлены в самом верху этого скрипта
// Далее, по значениям этих переменных, я собираю SQL-запрос

function SetButtonSelection() {

    SetColorAction();

    // a
    document.querySelector('#block-a .answ-block-1').addEventListener('click', function() {
        a_InHome = 1
        document.getElementById('block-b').style.display = 'none';
        removeActiveClass('block-b');
        b_OncePlant = 0;
        isTempCorrect = false;
        ZeroingAllVar();
    });    
    document.querySelector('#block-a .answ-block-2').addEventListener('click', function() {
        a_InHome = 2
        document.getElementById('block-b').style.display = 'none';
        removeActiveClass('block-b');
        b_OncePlant = 0;
        document.querySelector('.err-inp-2').style.display = 'none';
        document.querySelector('.my-input-2').value = '';
        isTempCorrect = false;
        ZeroingAllVar();
    });

    // a-2
    document.querySelector('#block-a-2 .answ-block-1').addEventListener('click', function() {
        a_1_MinTempInHome = 1
        document.querySelector('.err-inp-3').style.display = 'none';
        document.querySelector('.my-input-3').value = '';
        isHumCorrect = false;
    });
    document.querySelector('.my-input-2').addEventListener('click', () => {
        const input = document.querySelector('.my-input-2 input');
        input.focus();
        input.click();
    });
    document.querySelector('.my-input-2').addEventListener('input', function(e) {
        // Если значение поля ввода изменилось:
        isTempCorrect = false;
        CheckCorrectInput2();

        document.querySelector('.err-inp-3').style.display = 'none';
        document.querySelector('.my-input-3').value = '';
        isHumCorrect = false;
    });

    // a-1
    document.querySelector('#block-a-1 .answ-block-1').addEventListener('click', function() {
        a_2_AVGTempInRegion = 1
        isTempCorrect = false;
        CheckCorrectInput1();
    });    
    document.querySelector('.my-input-1').addEventListener('input', function(e) {
        // Если значение поля ввода изменилось:
        CheckCorrectInput1();
    });
    document.querySelector('.my-input-1').addEventListener('click', () => {
        const input = document.querySelector('.my-input-1 input');
        input.focus();
        input.click();
      });
    document.querySelector('#block-a-1 .answ-block-2').addEventListener('click', function() {
        a_2_AVGTempInRegion = 2
        isTempCorrect = true
        document.querySelector('.err-inp-1').style.display = 'none';
        document.querySelector('.my-input-1').value = '';
    });    

    // a-2-1
    document.querySelector('#block-a-2-1 .answ-block-1-s').addEventListener('click', function() {
        a_2_1_AVGHum = 1
        isHumCorrect = false
        CheckCorrectInput3();
    });    
    document.querySelector('.my-input-3').addEventListener('input', function(e) {
        // Если значение поля ввода изменилось:
        CheckCorrectInput3();
    });
    document.querySelector('.my-input-3').addEventListener('click', () => {
        const input = document.querySelector('.my-input-3 input');
        input.focus();
        input.click();
      });
    document.querySelector('#block-a-2-1 .answ-block-2-s').addEventListener('click', function() {
        a_2_1_AVGHum = 2
        isHumCorrect = true
        document.querySelector('.err-inp-3').style.display = 'none';
        document.querySelector('.my-input-3').value = '';
    });    
    document.querySelector('#block-a-2-1 .answ-block-3-s').addEventListener('click', function() {
        a_2_1_AVGHum = 3
        isHumCorrect = true
        document.querySelector('.err-inp-3').style.display = 'none';
        document.querySelector('.my-input-3').value = '';
    });    
    document.querySelector('#block-a-2-1 .answ-block-4-s').addEventListener('click', function() {
        a_2_1_AVGHum = 4
        isHumCorrect = true
        document.querySelector('.err-inp-3').style.display = 'none';
        document.querySelector('.my-input-3').value = '';
    });    

    // b
    document.querySelector('#block-b .answ-block-1').addEventListener('click', function() {
        b_OncePlant = 1
    });    
    document.querySelector('#block-b .answ-block-2').addEventListener('click', function() {
        b_OncePlant = 2
    });

    // c
    document.querySelector('#block-c .answ-block-1').addEventListener('click', function() {
        c_AFlowers = 1
        ColorZeroing() 
    });    
    document.querySelector('#block-c .answ-block-2').addEventListener('click', function() {
        c_AFlowers = 2
        ColorZeroing() 
    });
    document.querySelector('#block-c .answ-block-3').addEventListener('click', function() {
        c_AFlowers = 3
    });

    // c-3 - обработчик выбора цветов - прописан отдельно (ниже этой функции)

    // d
    document.querySelector('#block-d .answ-block-1').addEventListener('click', function() {
        d_IsPlod = 1
    });    
    document.querySelector('#block-d .answ-block-2').addEventListener('click', function() {
        d_IsPlod = 2
    });
    document.querySelector('#block-d .answ-block-3').addEventListener('click', function() {
        d_IsPlod = 3
    });

    // e
    document.querySelector('#block-e .answ-block-1').addEventListener('click', function() {
        e_StandOnWindow = 1
    });    
    document.querySelector('#block-e .answ-block-2').addEventListener('click', function() {
        e_StandOnWindow = 2
    });

    // e-1
    document.querySelector('#block-e-1 .answ-block-1').addEventListener('click', function() {
        e_1_ASunLight = 1
    });    
    document.querySelector('#block-e-1 .answ-block-2').addEventListener('click', function() {
        e_1_ASunLight = 2
    });
    document.querySelector('#block-e-1 .answ-block-3').addEventListener('click', function() {
        e_1_ASunLight = 3
    });

    // f
    document.querySelector('#block-f .answ-block-1').addEventListener('click', function() {
        f_GenerateAOxugen = 1
    });    
    document.querySelector('#block-f .answ-block-2').addEventListener('click', function() {
        f_GenerateAOxugen = 2
    });
    document.querySelector('#block-f .answ-block-3').addEventListener('click', function() {
        f_GenerateAOxugen = 3
    });

    // g
    document.querySelector('#block-g .answ-block-1').addEventListener('click', function() {
        g_AFreeProstr = 1
    });    
    document.querySelector('#block-g .answ-block-2').addEventListener('click', function() {
        g_AFreeProstr = 2
    });
    document.querySelector('#block-g .answ-block-3').addEventListener('click', function() {
        g_AFreeProstr = 3
    });

    // h
    document.querySelector('#block-h .answ-block-1').addEventListener('click', function() {
        h_NoControl = 1
    });    
    document.querySelector('#block-h .answ-block-2').addEventListener('click', function() {
        h_NoControl = 2
    });
    document.querySelector('#block-h .answ-block-3').addEventListener('click', function() {
        h_NoControl = 3
    });
}

// ------------------------------------------------------------------- //
// 	     Все процедуры, которые использует SetButtonSelection():       //
// ------------------------------------------------------------------- // 

// ------------------------------------------ //
// 	        Проверка input-элементов:         //
// ------------------------------------------ // 

// Проверка правильности ввода, в input-элементах (всех 3х)

function CheckCorrectInput1() {
    document.querySelector('.my-input-1').addEventListener('input', function(e) {
        var value = e.target.value;
        var errorElement = document.querySelector('.err-inp-1');
        
        if (value == "" || isNaN(value) || value < -20 || value > 35) {
            // Проверка на попадание числа в нужные границы
            errorElement.style.display = 'block'; 
            // Если ввод пользователя выходит за границы - мы показываем красный текст ошибки
            isTempCorrect = false;
            a_2_input_AVGTempInRegion = 0;
            a_2_AVGTempInRegion = 0;
        } else {
            errorElement.style.display = 'none';
            isTempCorrect = true;
            a_2_input_AVGTempInRegion = parseInt(value);
            a_2_AVGTempInRegion = 1;
        }

        CheckAllBlocks();
    });
}

function CheckCorrectInput2() {
    document.querySelector('.my-input-2').addEventListener('input', function(e) {
        var value = e.target.value;
        var errorElement = document.querySelector('.err-inp-2');
        
        if (value == "" || isNaN(value) || value < 15 || value > 30) {
            errorElement.style.display = 'block';
            isTempCorrect = false;
            a_1_input_MinTempInHome = 0;
            a_1_MinTempInHome = 0
        } else {
            errorElement.style.display = 'none';
            isTempCorrect = true;
            a_1_input_MinTempInHome = parseInt(value);
            a_1_MinTempInHome = 1
        }

        CheckAllBlocks();
    });
}

function CheckCorrectInput3() {
    document.querySelector('.my-input-3').addEventListener('input', function(e) {
        var value = e.target.value;
        var errorElement = document.querySelector('.err-inp-3');
        
        if (value == "" || isNaN(value) || value < 20 || value > 90) {
            errorElement.style.display = 'block';
            isHumCorrect = false;
            a_2_1_input_AVGHum = 0;
            a_2_1_AVGHum = 0
        } else {
            errorElement.style.display = 'none';
            isHumCorrect = true;
            a_2_1_input_AVGHum = parseInt(value);
            a_2_1_AVGHum = 1
        }

        CheckAllBlocks();
    });
}

// ------------------------------------------ //
// 	         Обработка ввода цветов:          //
// ------------------------------------------ // 

// Массив всех значений цветов (выбраны, или нет)
// Используется только в том случае, если пользователь выбрал блок c-3
let colors = {
    green: false,
    red: false,
    orange: false,
    yellow: false,
    lightBlue: false,
    blue: false,
    violet: false,
    pink: false,
    silver: false,
    multicolor: false
};

function SetColorAction() {
    // Получение всех кнопок цветов
    let buttons = document.querySelectorAll('.butt-bar-colors .color-s');
    
    // Добавление обработчика событий для каждой кнопки
    buttons.forEach(button => {
      button.addEventListener('click', function() {
          // Получение id кнопки (цвета)
          let color = this.id;

          console.log("Нажата кнопка цвета: " + color);
    
          // Изменение значения булевой переменной на противоположное
          colors[color] = !colors[color];
    
          // Изменение стиля элемента в зависимости от значения булевой переменной
          if (colors[color]) {
            this.classList.add('active-2');
          } else {
            this.classList.remove('active-2');
          }

          isColorCucsSelected = CheckCorrectColors();
          //console.log("isColorCucsSelected = " + isColorCucsSelected + " _");

          CheckAllBlocks();
      });
    });  
}

// Сброс всех цветов, и выделения кнопок цветов
// Используется, при надатии любой кнопки в блоке c
function ColorZeroing() {
    for (let color in colors) {
        colors[color] = false;
    }

    // Получение всех элементов .color-s внутри .color-other
    let colorButtons = document.querySelectorAll('.color-other .color-s');

    // Обход всех кнопок цветов
    colorButtons.forEach(button => {
      // Удаление стиля active-2
      button.classList.remove('active-2');
    });
}

// Проверка, выбрал ли пользователь хотя бы один цвет
// Используется только в том случае, если пользователь выбрал блок c-3
function CheckCorrectColors() {
    // Создание переменной
    let isAnyColorActive = false;

    // Проверка, есть ли хотя бы один цвет, который равен true
    for (let color in colors) {
      if (colors[color]) {
        isAnyColorActive = true;
        break;
      }
    }

    return isAnyColorActive;
}

// ------------------------------------------ //
// 	        Все основные переменные:          //
// ------------------------------------------ // 

let isDevelopModActive = false;     // Включён ли режим разработчика?

let _mainCounter = 0;               // Счётчик состояний

let isStart = false;                // Ползователь начал выбирать ответы?
let isTempCorrect = false;          // Значение температуры в поле ввода корректно? (и для дома, и для улицы)
let isHumCorrect = false;           // Значение влажности в поле ввода корректно?
let isColorCucsSelected = false;    // Хотя бы один цвет выбран? (если показан блок выбора цветов c-3)

// ------------------------------------------------------------------- //
// 	       Все процедуры, которые использует CheckAllBlocks():         //
// ------------------------------------------------------------------- // 

// Процедура обновления блоков, для активации элементов разработчика
function UpdateDevelomMode() {
    let elements = Array.from(document.getElementsByClassName('letter-abbr'));

    if(isDevelopModActive === true) {
        elements.forEach(element => {
            element.style.display = 'block';
        });
    } else {
        elements.forEach(element => {
            element.style.display = 'none';
        });
    }

    // Сохранение значения
    localStorage.setItem('isDevelopModActive', isDevelopModActive);
}

// Скрывает указанный блок
function HideBlock(nameBlock) {
    document.getElementById(nameBlock).style.display = 'none'; // Скрываю весь блок со страницы
    removeActiveClass(nameBlock); // Убираю выделение у всех нажатых кнопок в этом блоке
}

// Убираю выделение у всех нажатых кнопок в этом блоке
function removeActiveClass(parentId) {
    let elements = document.getElementById(parentId).querySelectorAll('.butt-answ');
    for(let i=0; i<elements.length; i++){
        elements[i].classList.remove('active');
    }
}

// // Показывает указанный блок
// function ShowBlock(nameBlock) {
//     let block = document.getElementById(nameBlock);

//     block.style.display = 'grid';       
//     block.scrollIntoView({behavior: "smooth"});
//     console.log("Фокус на блок: " + nameBlock);
// }

// Показывает указанный блок
function ShowBlock(nameBlock) {
    setTimeout(function() {
        let block = document.getElementById(nameBlock);

        block.style.display = 'grid';       
        block.scrollIntoView({behavior: "smooth"});
        console.log("Фокус на блок: " + nameBlock);
    }, 1);
}

// Служебные переменные
let isRevertQuwerty = 0;
let RQ_2 = 0;

// ------------------------------------------------------------------- //
// 	          Основная процедура: Перераспределение блоков             //
// ------------------------------------------------------------------- // 

// Процедура вызывается после нажатия на кнопку в любом блоке
// Эта процедура скрывает или показывает нужные блоки

// Если пользователь нажал ответ в одном блоке, показывается следующий за ним,
// при этом, все блоки, которые ниже него - скрываются, их переменные обнуляются, а выделение кнопочек - сбрасывается.
// Это чем-то похоже на рекурсивную обработку. Если _mainCounter < значения конкретного блока, 
// то обнуляется этот блок, и все блоки которые идут ниже него
function CheckAllBlocks() {

    if(isStart == true) {
        _mainCounter = 1;
    }

    console.log("Update all blocks");    

    if(_mainCounter >= 1) {
        if(a_InHome == 1) {
            // Дом

            HideBlock('block-a-1');             
            ShowBlock('block-a-2');

            a_2_AVGTempInRegion = 0;
            _mainCounter = 2;

            if(isRevertQuwerty>0) isRevertQuwerty--;
        } else if (a_InHome == 2) {
            // Улица

            ShowBlock('block-a-1');
            HideBlock('block-a-2');

            a_1_MinTempInHome = 0;
            a_2_1_AVGHum = 0;
            _mainCounter = 3;

            isRevertQuwerty = 2;
            RQ_2 = 2;

        }
    } else {
        a_InHome = 0;

        HideBlock('block-a-2');
        HideBlock('block-a-1');
    }

    if(_mainCounter >= 2 && isRevertQuwerty <= 0) {
        if(isTempCorrect == true && a_InHome == 1) {
            ShowBlock('block-a-2-1');
            _mainCounter = 3;
            if(RQ_2 > 0) RQ_2--;
        } else {
            HideBlock('block-a-2-1');
            a_2_1_AVGHum = 0;
        }
    } else {
        HideBlock('block-a-2-1');
        a_2_1_AVGHum = 0;
    }

    if(_mainCounter >= 3) {
        if(
            (a_InHome == 1 && isHumCorrect == true) ||
            (a_InHome == 2 && a_2_AVGTempInRegion == 2) ||
            (a_InHome == 2 && a_2_AVGTempInRegion == 1 && isTempCorrect == true)
        )
            {
            ShowBlock('block-b');
            _mainCounter = 4;
        } else {
            HideBlock('block-b');
            b_OncePlant = 0;
        }
    } else {
        HideBlock('block-b');
        b_OncePlant = 0;
    }

    if(_mainCounter >= 4) {
        if(b_OncePlant != 0) {
            ShowBlock('block-c');
            _mainCounter = 6;
        } else {
            HideBlock('block-c');
            c_AFlowers = 0;
        }
    } else {
        HideBlock('block-c');
        c_AFlowers = 0;
    }

    if(_mainCounter >= 5) {
        if(c_AFlowers == 3) {
            ShowBlock('block-c-3');  
            window.scrollTo(0, document.body.scrollHeight);
        } else {
            HideBlock('block-c-3');
            isColorCucsSelected = false

            ColorZeroing();
        }
    } else {
        HideBlock('block-c-3');
        isColorCucsSelected = false
    }

    if(_mainCounter >= 6) {
        if(c_AFlowers == 1 || c_AFlowers == 2 || isColorCucsSelected == true) {
            ShowBlock('block-d');
            _mainCounter = 7;
        } else {
            HideBlock('block-d');
            d_IsPlod = 0;
        }
    } else {
        HideBlock('block-d');
        d_IsPlod = 0;
    }

    if ((_mainCounter >= 7) && (a_InHome == 1)) {
        if(d_IsPlod != 0) {
            ShowBlock('block-e');
        } else {
            HideBlock('block-e');
            e_StandOnWindow = 0;
        }
    
        if(e_StandOnWindow == 1) {
            ShowBlock('block-e-1');
        } else {
            HideBlock('block-e-1');
            e_1_ASunLight = 0;
        }
    
        if(e_StandOnWindow == 2 || e_1_ASunLight != 0) {
            ShowBlock('block-f');
        } else {
            HideBlock('block-f');
            f_GenerateAOxugen = 0;
        }
    
        if(f_GenerateAOxugen != 0) {
            ShowBlock('block-g');
            _mainCounter = 8;
        } else {
            HideBlock('block-g');
            g_AFreeProstr = 0;
        }
    } else {
        HideBlock('block-g');
        HideBlock('block-e');
        HideBlock('block-e-1');
        HideBlock('block-f');

        e_StandOnWindow = 0;
        e_1_ASunLight = 0;
        f_GenerateAOxugen = 0;
        g_AFreeProstr = 0;

        //_mainCounter = 8;
    }    

    if(_mainCounter >= 8 || (_mainCounter >= 7 && a_InHome == 2)) {
        // Либо прошли все блоки по дому, либо мы выбрали улицу
        if(g_AFreeProstr != 0 || (a_InHome == 2 && d_IsPlod != 0)) {
            ShowBlock('block-h');
            _mainCounter = 9;
        } else {
            HideBlock('block-h');
            h_NoControl = 0;
        }
    } else {
        HideBlock('block-h');
        h_NoControl = 0;
    }

    // Финальная кнопка:
    if(_mainCounter >= 9) {
        if(h_NoControl != 0) {
            _mainCounter = 10;
            let block = document.getElementsByClassName('butt-final')[0];

            block.style.display = 'flex';     
            block.scrollIntoView({behavior: "smooth"});
        }
    } else {
        document.getElementsByClassName('butt-final')[0].style.display = 'none';
        document.getElementsByClassName('block-request')[0].style.display = 'none';
    }

    //document.querySelectorAll('.main-counter')[0].textContent = _mainCounter;    
    //console.log("Main-counter = " + _mainCounter);
}

// ------------------------------------------------------------------- //
// 	             Нажатие на кнопку "Подобрать растения"                //
// ------------------------------------------------------------------- // 

// Обработка нажатия на финальную кнопку 
// [Эта процедура вызывается после загрузки всей DOM-модели страницы, в самом верху этого скрипта]
function FinalButtonProc() {
    document.querySelector('.butt-final').addEventListener('click', function() {
        _mainCounter = -1;      // Обнуляем счётчик блоков

        let elements = Array.from(document.getElementsByClassName('block-qu'));

        // Скрываю все блоки
        elements.forEach(element => { 
            element.style.display = 'none';
        });

        // Если режим разработчика включён
        if(isDevelopModActive === true) {
            // Показываем блок с окошечками запроса и ответа от БД:
            document.getElementsByClassName('block-request')[0].style.display = 'grid';
        }
        
        // Показываем блок с гифкой загрузки (пока нам не придёт ответ от БД)
        document.getElementsByClassName('butt-final')[0].style.display = 'none';
        document.querySelector('.loadd').style.display = 'grid';
        document.querySelector('.loadd').scrollIntoView({behavior: "smooth"});

        // Выводим значения всех полученных переменных, в консоль:
        // debugPrint_2();

        // Собираем SQL-запрос
        let SQL_Rq = CreateSQLequest();
        document.querySelector('.block-request .req p').textContent = SQL_Rq;

        // Отправляем этот SQL-запрос на сервер
        SQL_RQ_FromSwever(SQL_Rq);  

        //console.log("Final*");
    });
}    

// ------------------------------------------ //
// 	          Создание SQL-запроса:           //
// ------------------------------------------ // 

// Эта процедура собирает SQL-запрос из значений переменных, 
// которые были получены, когда пользователь нажимал на кнопочки ответов
function CreateSQLequest() {
    let strRequare = "SELECT plant_name FROM MainTable WHERE ";
    let windowCompare = 7; // Окно на температуру
    let windowCompare_2 = 45; // Окно на влажность
    //let windowCompare_Light = 3;

    if (a_InHome === 1) {
        strRequare += "plant_type_description = 'Домашнее' ";
    } else if (a_InHome === 2) {
        strRequare += "plant_type_description = 'Уличное'";
    }

    strRequare += " AND ";

    if (a_InHome === 1) {
        strRequare += "min_temperature >= " + (a_1_input_MinTempInHome - windowCompare);
        strRequare += " AND ";
        strRequare += "max_temperature <= " + (a_1_input_MinTempInHome + windowCompare);
    }

    if (a_2_AVGTempInRegion === 1) {
        if(a_2_input_AVGTempInRegion < 15) {
            strRequare += " min_temperature <= " + (a_2_input_AVGTempInRegion + windowCompare);
        }        
    }

    strRequare += " AND ";

    let bool1 = false;

    if (a_2_1_AVGHum === 2) {
        a_2_1_input_AVGHum = 35;
        bool1 = true;
    } else if (a_2_1_AVGHum === 3) {
        a_2_1_input_AVGHum = 80;
        bool1 = true;
    } else if (a_2_1_AVGHum === 4) {
        a_2_1_input_AVGHum = 55;
        bool1 = true;
    }

    if (bool1 === true || a_2_1_AVGHum === 1) {
        strRequare += "min_humidity >= " + (a_2_1_input_AVGHum - windowCompare_2);
    }

    strRequare += " AND ";

    if (b_OncePlant === 2) {
        strRequare += "(allelopathy_description = 'Нейтральная' OR allelopathy_description = 'Положительная')";
    }

    strRequare += " AND ";

    if (c_AFlowers === 1) {
        strRequare += "plant_color_description LIKE '%елёный%'";
    }

    // Все цвета:

    
    // let colors = {
    //     green: false,
    //     red: false,
    //     orange: false,
    //     yellow: false,
    //     lightBlue: false,
    //     blue: false,
    //     violet: false,
    //     pink: false,
    //     silver: false,
    //     multicolor: false
    // };

    // # 1 - Белый
    // # 2 - Красный
    // # 3 - Оранжевый
    // # 4 - Жёлтый
    // # 5 - Голубой
    // # 6 - Синий
    // # 7 - Филоетовый
    // # 8 - Розовый
    // # 9 - Серебрянный
    // # 10 - Бордовый
    // # 11 - Разноцветный
    

    if(isColorCucsSelected === true){
        let addStr1 = "";

        addStr1 += " AND (";
        if(colors['red'] == true) {
            addStr1 += "plant_color_description LIKE '%расный%' OR ";
        } 
        if(colors['orange'] == true) {
            addStr1 += "plant_color_description LIKE '%ранжевый%' OR ";
        } 
        if(colors['yellow'] == true) {
            addStr1 += "plant_color_description LIKE '%ёлтый%' OR ";
        } 
        if(colors['lightBlue'] == true) {
            addStr1 += "plant_color_description LIKE '%олубой%' OR ";
        } 
        if(colors['blue'] == true) {
            addStr1 += "plant_color_description LIKE '%иний%' OR ";
        } 
        if(colors['violet'] == true) {
            addStr1 += "plant_color_description LIKE '%иолетовый%' OR ";
        } 
        if(colors['pink'] == true) {
            addStr1 += "plant_color_description LIKE '%озовый%' OR ";
        } 
        if(colors['silver'] == true) {
            addStr1 += "plant_color_description LIKE '%еребристый%' OR ";
        } 
        if(colors['multicolor'] == true) {
            addStr1 += "plant_color_description LIKE '%азноцветный%' OR ";
        } 
        if(colors['green'] == true) {
            addStr1 += "plant_color_description LIKE '%елёный%' OR ";
        } 
        

        addStr1 = addStr1.trim(); // Удаляю пробелы в конце строки
    
        if (addStr1.endsWith(' OR')) {
            addStr1 = addStr1.slice(0, -3); // Удаляю AND, если он вылез в коне запроса
        }

        addStr1 += ")";
        strRequare += addStr1;      
    }

    strRequare += " AND ";

    if (d_IsPlod === 1) {
        strRequare += "is_fruitful = 1";
    } else if (d_IsPlod === 3) {
        strRequare += "is_fruitful = 0";
    }

    strRequare += " AND ";

    if (e_StandOnWindow === 2) {
        strRequare += "(sunlight_tolerance_description = 'Нет' OR sunlight_tolerance_description = 'Средне')";
        strRequare += " AND ";
        strRequare += "max_light <= 8";
    } else if (e_StandOnWindow === 1) {
        strRequare += "min_light >= 3";
    }
    
    strRequare += " AND ";
    
    if (f_GenerateAOxugen === 1) {
        strRequare += "oxygen_production >= 5";
    } else if (f_GenerateAOxugen === 2) {
        strRequare += "oxygen_production >= 3";
    }
    
    strRequare += " AND ";
    
    if (g_AFreeProstr === 1) {
        strRequare += "area_covered <= 4";
    } else if (g_AFreeProstr === 2) {
        strRequare += "area_covered <= 7";
    }
    
    strRequare += " AND ";
    
    if (h_NoControl === 1) {
        strRequare += "care_instructions < 6";
    } else if (h_NoControl === 2) {
        strRequare += "(care_instructions >= 6)";
    }
    
    let remove_extra_and = (sql_query) => {
        while (sql_query.includes(' AND  AND ')) {
            sql_query = sql_query.replace(' AND  AND ', ' AND '); // Удаляю AND, если он появился 2 раза подряд
        }
        while (sql_query.includes(' AND AND ')) {
            sql_query = sql_query.replace(' AND AND ', ' AND '); // Удаляю AND, если он появился 2 раза подряд
        }
    
        sql_query = sql_query.trim(); // Удаляю пробелы в конце строки
    
        if (sql_query.endsWith(' AND')) {
            sql_query = sql_query.slice(0, -4); // Удаляю AND, если он вылез в коне запроса
        }
        return sql_query;
    }
    
    let outputRequare = remove_extra_and(strRequare); // Делаю строку без ошибок, как SQL-запрос
    
    outputRequare += str_SortMainReq;
    
    console.log();
    console.log("Запрос:" + outputRequare);
    console.log();    

    allCountOfRequ = 1;

    return(outputRequare)
}

// Вывод значений всех переменных в форму запроса
function debugPrint_2(){
    let output = "Текст запроса: [Тестовый]\n";
    output += `a_InHome: ${a_InHome}\n`;
    output += `a_1_MinTempInHome: ${a_1_MinTempInHome}\n`;
    output += `a_1_input_MinTempInHome: ${a_1_input_MinTempInHome}\n`;
    output += `a_2_AVGTempInRegion: ${a_2_AVGTempInRegion}\n`;
    output += `a_2_input_AVGTempInRegion: ${a_2_input_AVGTempInRegion}\n`;
    output += `a_2_1_AVGHum: ${a_2_1_AVGHum}\n`;
    output += `a_2_1_input_AVGHum: ${a_2_1_input_AVGHum}\n`;
    output += `b_OncePlant: ${b_OncePlant}\n`;
    output += `c_AFlowers: ${c_AFlowers}\n`;
    output += `c_3_SelectAColor: ${c_3_SelectAColor}\n`;
    output += `d_IsPlod: ${d_IsPlod}\n`;
    output += `e_StandOnWindow: ${e_StandOnWindow}\n`;
    output += `e_1_ASunLight: ${e_1_ASunLight}\n`;
    output += `f_GenerateAOxugen: ${f_GenerateAOxugen}\n`;
    output += `g_AFreeProstr: ${g_AFreeProstr}\n`;
    output += `h_NoControl: ${h_NoControl}\n`;    

    document.querySelector('.block-request .req p').textContent = output;

    // Сейчас эта процедура не используется
}

// Обнуляем все переменные
// Используется, если мы нажали на любую кнопку в блоке a
function ZeroingAllVar() {
    a_1_MinTempInHome = 0
    a_1_input_MinTempInHome = 0
    a_2_AVGTempInRegion = 0
    a_2_input_AVGTempInRegion = 0
    a_2_1_AVGHum = 0
    a_2_1_input_AVGHum = 0
    b_OncePlant = 0
    c_AFlowers = 0
    c_3_SelectAColor = ""
    d_IsPlod = 0
    e_StandOnWindow = 0
    e_1_ASunLight = 0
    f_GenerateAOxugen = 0
    g_AFreeProstr = 0
    h_NoControl = 0
}

// Запрос на сортировку в нужном порядке:
str_SortMainReq = ''; 

// Не использую сортировку в SQL-запросе, т.к. я всё равно перемешиваю все навания, когда получаю их

// str_SortMainReq = `
// ORDER BY 
//     is_famous DESC,
//     CASE allelopathy_description 
//         WHEN 'Положительная' THEN 1 
//         WHEN 'Нейтральная' THEN 2 
//         ELSE 3 
//     END,    
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
//     END,
//     area_covered ASC,
//     oxygen_production DESC;
// `;

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
                
                ShowSQL_InjectionError();
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
            console.log(data[i]); // Выводим каждую строку в консоль
        }
    }

    // Обработка полученного ответа от БД, для вывода в карточки
    function JSON_Parser_OnHTMLPage(data) {
        var plantNames = ""; 

        // Перемешиваем получившийся массив в случайном порядке
        data.sort(function(a, b) {
            return 0.5 - Math.random();
        });        

        plantNames = OnPageWeu_02(data);

        if(plantNames == "Пустой ответ" || isGreenZeroRequest === true || data.length == 0) {
            // Показываем карточку "Мы не смогли подобрать для вас растения"

            ZeroReauest_Show(); 
        } else {
            docWrite_01(plantNames, data);
        }  
    }    

    // Показываем только блок "К сожалению, мы не смогли подобрать для вас растение", и кнопку "Пройти ещё раз"
    function ZeroReauest_Show() {
        document.querySelector('.zero-reauest').style.display = 'grid';
        document.querySelector('.result-cards').style.display = 'none';
        document.querySelector('.reauest-2-only-color').style.display = 'none';
        document.querySelector('.loadd').style.display = 'none';
        document.querySelector('.butt-final-2').style.display = 'flex';
    }
}

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

// Показываем блок карточек, и выводим их в нужном порядке
function docWrite_01(text, data) {
    document.querySelector('.loadd').style.display = 'none';
    document.querySelector('.block-request .answ p').innerText = text;
    document.querySelector('.result-cards').style.display = 'grid';   

    document.querySelector('.butt-final-2').style.display = 'flex';
    if(window.innerWidth > 650) { 
        if(isFocusCardBlock === false) {
            document.querySelector('.butt-final-2').scrollIntoView({behavior: "smooth"});
        }        
    }

    console.log("Отправляем вот такую строку:" + text); 

    //randomImgPlantsCard();  // Устанавливаем случайные картинки из набора, на все карточки
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

function ErrorImageCon(img) {
    // Обработка ошибки
    // Создаем массив с именами файлов изображений
    let imageNames = Array.from({length: 13}, (_, i) => `img/plant-image/P_${String(i+1).padStart(2, '0')}.png`);

    // Перемешиваем массив
    imageNames.sort(() => Math.random() - 0.5);

    img.src = imageNames[0];

    console.log('Ошибка при загрузке изображения "' + item.plant_name + '"');
}

// Устанавливает нужные названия для карточек, из массива
function SetNamePlants(plantNames_mass) {
    // Пример входной строки:
    // "Геликония, Бувардия, Будра, Жакаранда, Камнеломка, Лаванда, Осока";

    // Получаем все карточки
    let spans = document.querySelectorAll('.card span');

    console.log("b_OncePlant = " + b_OncePlant);

    if((b_OncePlant != 1) || (isDuoColorReqActive === true)) { // Несколько растений

        //console.log("allCountOfRequ = " + allCountOfRequ);

        // Присваиваем каждой карточке название растения из массива
        spans.forEach((span, index) => {
            
            if (index < plantNames_mass.length) {
                let namePl = plantNames_mass[index].plant_name;
                span.textContent = namePl
                console.log("Обрабатываем название карточки: " + namePl);
                let crad = span.parentElement;
                let img_loc = crad.querySelectorAll('img');
                
                // Если вы хотите установить src для первого изображения
                let img = img_loc[0];           
        
                //img.src = `img/all-plants-photo/Растение ${namePl}.jpg`;

                img.src = `img/all-plants-photo/Растение ${namePl}.jpg`;
                // if(window.innerWidth > 650) {
                //     img.src = `img/all-plants-photo/Растение ${namePl}.jpg`;
                // } else {
                //     img.src = `img/all-plants-photo-small/Растение ${namePl}.jpg`;
                // }
    
                img.onerror = function() { ErrorImageCon(img) }; // Если картинки с нужным именем не нашлось
    
                span.parentElement.style.display = 'grid';
            } else {
                span.parentElement.style.display = 'none'; // Скрываем лишние карточки
            }            
    
        });
    
    } else { // Только одно растение // if(b_OncePlant == 0 || 1)
        spans.forEach((span, index) => {     
            span.parentElement.style.display = 'none';
        });

        spansNew = Array.from(spans);

        spansNew.sort(function(a, b) {
            return 0.5 - Math.random();
        });        

        document.querySelector('.upper-block-3').style.setProperty("grid-template-columns", "1fr");

        span = spansNew[1];

        let namePl = plantNames_mass[0].plant_name;
        span.textContent = namePl
        console.log("Обрабатываем название карточки: " + namePl);
        let crad = span.parentElement;
        let img_loc = crad.querySelectorAll('img');
        
        // Если вы хотите установить src для первого изображения
        let img = img_loc[0];           
    
        //img.src = `img/all-plants-photo/Растение ${namePl}.jpg`;

        img.src = `img/all-plants-photo/Растение ${namePl}.jpg`;
        // if(window.innerWidth > 650) {
        //     img.src = `img/all-plants-photo/Растение ${namePl}.jpg`;
        // } else {
        //     img.src = `img/all-plants-photo-small/Растение ${namePl}.jpg`;
        // }
    
        img.onerror = function() { ErrorImageCon(img) }; // Если картинки с нужным именем не нашлось

        let textSpan1 = document.querySelectorAll('.result-cards .spsp span')[0];
        textSpan1.textContent = "Вот такое растение подойдёт тебе лучше всего:";        
    
        span.parentElement.style.display = 'grid';
    }
    
    // Если названий растений меньше 7, но больше 3, показываем только первые 3 карточки
    if (plantNames_mass.length < 7 && plantNames_mass.length > 3) {
        for (let i = 3; i < spans.length; i++) {
            spans[i].parentElement.style.display = 'none';
        }
    }
}

// Перезагружаю страницу, если нажата кнопка "Пройти ещё раз"
// [Эта процедура вызывается после загрузки всей DOM-модели страницы, в самом верху этого скрипта]
function ReloadPageButtonProc() {
    document.querySelector('.butt-final-2').addEventListener('click', function() {
        location.reload();
    });    
}

// ------------------------------------------ //
// 	             2й запрос к БД:              //
// ------------------------------------------ // 

let allCountOfRequ = 0; // Общее количество запросов к БД
let isFocusCardBlock = false;
let isDuoColorReqActive = false;


// 2й запрос к БД - выборка по всем выбранным цветам, без учёта других параметров
// Выполняется, если первый запрос вернул пустой результат
function Requ_2_OnlyGettingColor() {
    if(colors['green'] == true) {

        console.log("Выбран зелёный цвет, говорим, что результатов нету");
        isGreenZeroRequest = true;
        document.querySelector('.zero-reauest').style.display = 'grid';
        document.querySelector('.loadd').style.display = 'none';
        document.querySelector('.result-cards').style.display = 'none';

    } else if(allCountOfRequ < 2) {    
        console.log("Посылаем новый запрос, только с цветами");

        isDuoColorReqActive = true;
        allCountOfRequ = 2;

        document.querySelector('.loadd').style.display = 'grid';

        let addStr1 = "";
    
        if(colors['red'] == true) {
            addStr1 += "plant_color_description LIKE '%расный%' OR ";
        } 
        if(colors['orange'] == true) {
            addStr1 += "plant_color_description LIKE '%ранжевый%' OR ";
        } 
        if(colors['yellow'] == true) {
            addStr1 += "plant_color_description LIKE '%ёлтый%' OR ";
        } 
        if(colors['lightBlue'] == true) {
            addStr1 += "plant_color_description LIKE '%олубой%' OR ";
        } 
        if(colors['blue'] == true) {
            addStr1 += "plant_color_description LIKE '%иний%' OR ";
        } 
        if(colors['violet'] == true) {
            addStr1 += "plant_color_description LIKE '%иолетовый%' OR ";
        } 
        if(colors['pink'] == true) {
            addStr1 += "plant_color_description LIKE '%озовый%' OR ";
        } 
        if(colors['silver'] == true) {
            addStr1 += "plant_color_description LIKE '%еребристый%' OR ";
        } 
        if(colors['multicolor'] == true) {
            addStr1 += "plant_color_description LIKE '%азноцветный%' OR ";
        }         
    
        addStr1 = addStr1.trim(); // Удаляю пробелы в конце строки
    
        if (addStr1.endsWith(' OR')) {
            addStr1 = addStr1.slice(0, -3); // Удаляю OR, если он вылез в коне запроса
        }

        let strRequare = "SELECT plant_name FROM MainTable WHERE ";
        strRequare += addStr1;
        
        //let SQL_Rq = CreateSQLequest();
        document.querySelector('.block-request .req p').textContent = strRequare;

        document.querySelector('.reauest-2-only-color').style.display = 'block';
        document.querySelector('.nav-menu-bar').scrollIntoView({behavior: "smooth"});
        isFocusCardBlock = true;

        document.querySelector('.result-cards .spsp').style.display = 'none';

        SQL_RQ_FromSwever(strRequare);        
    }
}

*/