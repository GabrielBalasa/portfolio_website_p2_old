/* Theme toggle */
if(localStorage.getItem('theme')) {
    document.querySelector('body').classList.add('light-theme');
}

document.querySelector('.theme-toggle').addEventListener('click', _ => {
    const bodyEl = document.querySelector('body');
    if( bodyEl.classList.contains('light-theme') ) {
        bodyEl.classList.remove('light-theme');
        document.querySelector('.fa-moon').classList.add('active');
        document.querySelector('.fa-sun').classList.remove('active');
        localStorage.removeItem('theme');
    } else {
        bodyEl.classList.add('light-theme');
        document.querySelector('.fa-moon').classList.remove('active');
        document.querySelector('.fa-sun').classList.add('active');
        localStorage.setItem('theme', 'light-theme');
    }
});

/* ToDo List */
if (document.querySelector('.todo')) {
    let form = document.getElementById('todoForm'),
        input = document.querySelector('textarea[name="todoNewItem"]'),
        clearButton = document.getElementById('todoClear'),
        todoList = localStorage.todoList ? JSON.parse(localStorage.todoList) : [],
        todoListIndex = todoList.length,
        todoListDiv = document.querySelector('.todoList');

    function saveToLocalStorage() {
        localStorage.setItem('todoList', JSON.stringify(todoList));
        if (todoList.length > 0) {
            clearButton.disabled = false;
        }
    }

    /* HTML data for the todo list items */

    function todoItemHtml(todoItem, id) {
        let todoItemDiv = document.createElement('div'),
            checkBox = document.createElement('input');
        checkBox.type = 'checkbox';
        checkBox.checked = todoItem.checked;
        checkBox.addEventListener('click', todoListToggle);
        todoItemDiv.classList.add('todoItem');
        todoItemDiv.style.textDecoration = todoItem.checked ? 'line-through' : 'initial';
        todoItemDiv.textContent = todoItem.value;
        todoItemDiv.dataset.itemid = id;
        todoItemDiv.appendChild(checkBox);
        return todoItemDiv;
    }

    /* Word count function for the todo list */

    function wordCount() {
        let counter = document.querySelector('.wordCount > span'),
            p = document.querySelector('.wordCount > .p');
        if(input.value.length === 1) {
            p.style.display = 'none';
        } else {
            p.style.display = 'inline';
        }

        counter.innerHTML = input.value.length;
    }

    /* Todo list items check mark toggle */

    function todoListToggle(e) {
        let parent = e.currentTarget.parentNode,
            id = parent.dataset.itemid;
        parent.style.textDecoration = e.currentTarget.checked ? 'line-through' : 'initial';
        todoList[id].checked = !todoList[id].checked;
        saveToLocalStorage();
    }

    // add new todo item on form submission
    document.getElementById('todoAdd').addEventListener('click', function() {
        if(input.value === "") {
            alert("Please enter a value to add to the list!")
        } else {
            let todoItem = {value: input.value, checked: false};
            todoListIndex++;
            todoListDiv.appendChild(todoItemHtml(todoItem, todoListIndex - 1));
            todoList.push(todoItem);
            saveToLocalStorage();
            form.reset();
            wordCount();
        }
    });

    // count characters when user is typing
    input.addEventListener('keydown', wordCount);
    input.addEventListener('keyup', wordCount);

    if (todoList.length > 0) {
        clearButton.disabled = false;
    }

    // list todo items from localStorage
    todoList.forEach((todoItem, id) => {
        todoListDiv.appendChild(todoItemHtml(todoItem, id));
    });

    // clear list
    clearButton.addEventListener('click', function clearList() {
        todoList = [];
        saveToLocalStorage();
        clearButton.disabled = true;
        todoListDiv.innerHTML = "";
    });
}

/* Weather App */


let icon = document.querySelector(".weatherIcon"),
    temp = document.querySelector(".degrees-n"),
    tempDesc = document.querySelector(".temp .text"),
    loc = document.querySelector(".location h5");

const kelvin = 273.15,
    key = ""; // API key

// Weather data from API

if (document.querySelector('.weather')) {

    function getWeather(latitude, longitude){
        let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;
        fetch(api)
            .then(
                function(response) {
                    response.json().then(function(data) {
                        temp.textContent = parseInt(data.main.temp - kelvin);
                        tempDesc.textContent = data.weather[0].description;
                        loc.textContent = `${data.name}, ${data.sys.country}`;
                        icon.innerHTML = `<img src="icons/${data.weather[0].icon}.png"/>`;
                    });
                }
            )
    }

    /* Current location if access granted */

    navigator.geolocation.getCurrentPosition(function (e){
        let latitude = e.coords.latitude;
        let longitude = e.coords.longitude;
        getWeather(latitude, longitude);
    }, function() {
        latitude = 51.513654;
        longitude = -0.091775;
        document.querySelector(".location small").textContent = "Location services disabled";
        getWeather(latitude, longitude);
    });


    /* Clock App */

    function getTime(){
        let time = new Date(),
            hourDiv = document.querySelector(".h"),
            hour = time.toLocaleString('en-GB', {hour: 'numeric', hour12: true}).split(" "),
            minutes = document.querySelector(".m span"),
            ap = hour[1].slice(0, 1).toUpperCase(),
            apDiv = document.querySelector(".AP")
            minutesNo = time.getMinutes();
        hour = hour[0];
        if(hourDiv.textContent != hour) {
            hourDiv.textContent = hour;
        }
        if(minutes.textContent != minutesNo) {
            minutes.textContent = minutesNo < 10 ? `0${minutesNo}` : minutesNo;
        }
        apDiv.textContent = ap;
    }

}

setInterval(getTime, 1000);

