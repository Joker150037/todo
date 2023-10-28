//selectingDOM Elements
let input = document.querySelector("input");
let remove = document.querySelector(".remove");
let add = document.querySelector(".add");
let edit = document.querySelector(".edit");
let taskContainer = document.getElementById("taskContainer");
let warning = document.querySelector(".alert-warning");
let success = document.querySelector(".alert-success");

//Classess.....

//Class for manipulation localStorage
class localStorageControl {
  static LSget() {
    let obj = JSON.parse(localStorage.getItem("tasks"));
    let tasks;
    if (obj == null) {
      tasks = [];
    } else {
      tasks = Object.values(obj);
    }
    return tasks;
  }
  static LSset() {
    let tasks = localStorageControl.LSget();
    let value = input.value;
    tasks.push(value);
    let stringTask = JSON.stringify(tasks);
    localStorage.setItem("tasks", stringTask);
  }
  static LSedit(value, index) {
    let tasks = localStorageControl.LSget();

    tasks[index] = value;

    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
  static LSremove(index) {
    let tasks = localStorageControl.LSget();
    if (tasks.length > index) {
      tasks.splice(index, 1);
    }
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
}

//Class for manipulating input
class UI {
  //clear input field
  static ClearInputField() {
    input.value = "";
  }
  //display from start
  static DisplayTasks() {
    let tasks = localStorageControl.LSget();
    tasks.forEach(function (task) {
      UI.AddtaskToUi(task);
    });
  }

  //display from clicking add
  static AddtaskToUi(value = input.value) {
    let div = document.createElement("div");
    div.classList.add(
      "task",
      "container-fluid",
      "bg-white",
      "d-flex",
      "py-2",
      "rounded-2",
      "justify-content-between",
      "mb-3"
    );
    div.innerHTML = `<span>${value}</span>
        <div class="">
          <button class="btn btn-primary btn-sm me-2 edit">
            <i class="fa-regular fa-pen-to-square"></i>
          </button>
          <button class="btn btn-danger btn-sm me-2 remove">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>`;
    taskContainer.appendChild(div);
    UI.ClearInputField();
  }

  //remove from clicking remove
  static RemovetaskFromUi(target) {
    let removeParentDiv = target;
    removeParentDiv.remove();
  }

  //edit from clicking edit
  static EdittaskFromUi(editDiv, index) {
    let parentDiv = editDiv;
    let span = parentDiv.firstElementChild;
    let editValue = span.textContent;
    input.value = editValue;

    add.textContent = "Edit";
    add.onclick = function () {
      span.textContent = input.value;
      add.textContent = "ADD";
      UI.ClearInputField();
      localStorageControl.LSedit(span.textContent, index);
    };
  }
}

//Events......

//event on load
document.addEventListener("DOMContentLoaded", function () {
  UI.DisplayTasks();
});

//event on add
add.onclick = function () {
  if (input.value.trim() == "") {
    warning.classList.remove("d-none");
    warning.classList.add("d-block");
    setTimeout(() => {
      warning.classList.remove("d-block");
      warning.classList.add("d-none");
    }, 1000);
  } else {
    localStorageControl.LSset();
    UI.AddtaskToUi();
    success.classList.remove("d-none");
    success.classList.add("d-block");
    setTimeout(() => {
      success.classList.remove("d-block");
      success.classList.add("d-none");
    }, 1000);
  }
};

taskContainer.addEventListener("click", function (e) {
  //event on remove
  if (e.target.parentElement.classList.contains("remove")) {
    let divs = document.querySelectorAll(".task");
    let removeDiv = e.target.parentElement.parentElement.parentElement;

    divs.forEach((element, index) => {
      if (element === removeDiv) {
        localStorageControl.LSremove(index);
      }
    });
    UI.RemovetaskFromUi(removeDiv);
  } //event on Edit
  else if (e.target.parentElement.classList.contains("edit")) {
    let divs = document.querySelectorAll(".task");
    let editDiv = e.target.parentElement.parentElement.parentElement;
    divs.forEach((element, index) => {
      if (element === editDiv) {
        UI.EdittaskFromUi(editDiv, index);
      }
    });
  }
});
