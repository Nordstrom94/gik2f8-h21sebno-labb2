todoForm.title.addEventListener('keyup', (e) => validateField(e.target));
todoForm.title.addEventListener('blur', (e) => validateField(e.target));
todoForm.description.addEventListener('input', (e) => validateField(e.target));
todoForm.description.addEventListener('blur', (e) => validateField(e.target));
todoForm.dueDate.addEventListener('input', (e) => validateField(e.target));
todoForm.dueDate.addEventListener('blur', (e) => validateField(e.target));
todoForm.addEventListener('submit', onSubmit);

const todoListElement = document.getElementById('todoList');
let titleValid = true;
let descriptionValid = true;
let dueDateValid = true;

const api = new Api('http://localhost:5001/tasks');

function validateField(field) {
  const { name, value } = field;
  let = validationMessage = '';
  switch (name) {
    case 'title': {
      if (value.length < 2) {   
        titleValid = false;
        validationMessage = "Fältet 'Titel' måste innehålla minst 2 tecken.";
      } else if (value.length > 100) { 
        titleValid = false;
        validationMessage =
          "Fältet 'Titel' får inte innehålla mer än 100 tecken.";
      } else {   
        titleValid = true;
      }
      break;
    }
    
    case 'description': {   
      if (value.length > 500) {
        descriptionValid = false;
        validationMessage =
          "Fältet 'Beskrvining' får inte innehålla mer än 500 tecken.";
      } else {
        descriptionValid = true;
      }
      break;
    }
    
    case 'dueDate': {   
      if (value.length === 0) { 
        dueDateValid = false;
        validationMessage = "Fältet 'Slutförd senast' är obligatorisk.";
      } else {
        dueDateValid = true;
      }
      break;
    }
  }
  
  field.previousElementSibling.innerText = validationMessage;  
  field.previousElementSibling.classList.remove('hidden');
}

function onSubmit(e) { 
  e.preventDefault(); 
  if (titleValid && descriptionValid && dueDateValid) { 
    console.log('Submit');
    saveTask();
  }
}

function saveTask() {
  const task = {
    title: todoForm.title.value,
    description: todoForm.description.value,
    dueDate: todoForm.dueDate.value,
    completed: false
  };

  api.create(task).then((task) => {  
    if (task) {
      renderList();
    }
  });
}

function renderList() {
  console.log('rendering');
  api.getAll().then((tasks) => {  
    todoListElement.innerHTML = ''; 
    tasks.sort((sort1, sort2) => (sort1.dueDate < sort2.dueDate) ? 1 : (sort1.dueDate > sort2.dueDate) ? -1 : 0);
    if (tasks && tasks.length > 0) {     
      tasks.forEach((task) => {
        if(task.completed){
          todoListElement.insertAdjacentHTML('beforeend', renderTask(task));
        }
        else{
          todoListElement.insertAdjacentHTML('afterbegin', renderTask(task));
        }
      });
    }
  });
}


function renderTask({ id, title, description, dueDate, completed }) {
  const checkDone =  completed == true ? "checked" : "";
  const colorDone = completed == true ? "bg-purple-100" : "";
  let html = `
    <li class="select-none mt-2 py-2 border-b border-amber-300 ${colorDone}">
      <div class="flex items-center p-1" id=${id}>
        <h3 class="mb-3 flex-1 text-xl font-bold text-pink-800 uppercase">${title}</h3>
        <div>
          <div>
            <input onclick="taskDone(${id})" type="checkbox" id="doneBox" name="doneBox"${checkDone}>
            <label for="completedBox">Utförd</label>
          </div>
          <span>${dueDate}</span>
          <button onclick="deleteTask(${id})" class="inline-block bg-amber-500 text-xs text-amber-900 border border-white px-3 py-1 rounded-md ml-2">Ta bort</button>
        </div>
      </div>`;
  description &&
    (html += `
      <p class="ml-8 mt-2 text-xs italic">${description}</p>
  `);

  html += `
    </li>`;
 
  return html;
}

function deleteTask(id) {
  api.remove(id).then((result) => {
    renderList();
  });
}

/***********************Labb 2 ***********************/
/* Här skulle det vara lämpligt att skriva den funktion som angivits som eventlyssnare för när någon markerar en uppgift som färdig. Jag pratar alltså om den eventlyssnare som angavs i templatesträngen i renderTask. Det kan t.ex. heta updateTask. 
  
Funktionen bör ta emot ett id som skickas från <li>-elementet.
*/


function taskDone(id){
  api.update(id);
}

/***********************Labb 2 ***********************/
renderList();
