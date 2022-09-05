const taskHeads = ["name", "age", "activeStatus"];
const addForm = document.querySelector("#addForm");
const editForm = document.querySelector("#editForm");
const dataWrap = document.querySelector("#dataWrap");
const check = document.getElementById("flexSwitchCheckDefault");
const single = document.querySelector("#single");

const readFromStorage = (key = "users", dataType = "array") => {
  let data;
  try {
    data = JSON.parse(localStorage.getItem(key)) || [];
    if (!Array.isArray(data) && dataType == "array")
      throw new Error("data is not an array");
  } catch (e) {
    data = [];
  }
  return data;
};

const editFromStorage = (users, user) => {
  let index = users.findIndex((u) => u.id === user.id);
  users.splice(index, 1, user);
  writeToStorage(users);
};

const writeToStorage = (data, key = "users") => {
  localStorage.setItem(key, JSON.stringify(data));
};

const createUserObject = (addForm) => {
  let user = { id: Date.now() };
  taskHeads.forEach((head) => {
    if (head === "activeStatus") {
      if (check.checked) {
        user[head] = "active";
      } else {
        user[head] = "not active";
      }
    } else {
      user[head] = addForm.elements[head].value;
    }
  });
  return user;
};
const createMyOwnEle = (eleTag, parent, txtContent = null, classes = null) => {
  const myNewElement = document.createElement(eleTag);
  if (classes) myNewElement.classList = classes;
  if (txtContent) myNewElement.innerText = txtContent;
  parent.appendChild(myNewElement);
  return myNewElement;
};
const delUser = (users, i) => {
  users.splice(i, 1);
  writeToStorage(users);
  draw(users);
};

const changeActivity = (users, i) => {
  if (users[i].activeStatus === "active") {
    users[i].activeStatus = "not active";
  } else {
    users[i].activeStatus = "active";
  }
  writeToStorage(users);
  draw(users);
};

const editUser = (user) => {
  writeToStorage(user, "user");
  window.location.href = "editUser.html";
};

const showSingle = (user) => {
  writeToStorage(user, "item");
  window.location.href = "single.html";
};
const draw = (users) => {
  dataWrap.innerHTML = "";
  if (users.length == 0) {
    let tr = createMyOwnEle("tr", dataWrap, null, "alert alert-danger");
    let td = createMyOwnEle("td", tr, "no data found", "alert alert-danger");
    td.setAttribute("colspan", "5");
  }
  users.forEach((user, i) => {
    let tr = createMyOwnEle("tr", dataWrap);
    createMyOwnEle("td", tr, user.id);
    createMyOwnEle("td", tr, user.name);
    createMyOwnEle("td", tr, user.age);
    createMyOwnEle("td", tr, user.activeStatus);
    let td = createMyOwnEle("td", tr);
    let statusBtn = createMyOwnEle(
      "button",
      td,
      "change activity",
      "btn btn-primary mx-2 my-1"
    );
    statusBtn.addEventListener("click", () => changeActivity(users, i));
    let editBtn = createMyOwnEle("button", td, "edit", "btn btn-warning mx-2");
    editBtn.addEventListener("click", () => editUser(users[i]));
    let showBtn = createMyOwnEle("button", td, "show", "btn btn-success mx-2");
    showBtn.addEventListener("click", () => showSingle(users[i]));
    let delBtn = createMyOwnEle("button", td, "delete", "btn btn-danger mx-2");
    delBtn.addEventListener("click", () => delUser(users, i));
  });
};

if (addForm) {
  addForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const user = createUserObject(this);
    const users = readFromStorage();
    users.push(user);
    writeToStorage(users);
    window.location.href = "index.html";
  });

  check.addEventListener("click", () => {
    if (check.checked) {
      document.getElementById("activeToggle").innerText = "active";
    } else {
      document.getElementById("activeToggle").innerText = "not active";
    }
  });
}
if (dataWrap) {
  const users = readFromStorage();
  draw(users);
}
if (editForm) {
  const userNameEdit = document.getElementById("name");
  const userAgeEdit = document.getElementById("age");
  const checkEdit = document.getElementsByClassName("check")[0];
  const activeToggleEdit = document.getElementById("activeToggleEdit");
  const user = readFromStorage("user", "object");
  const users = readFromStorage();
  if (users.length === 0) {
    user = {};
  }
  userNameEdit.value = user.name;
  userAgeEdit.value = user.age;
  if (user.activeStatus === "not active") {
    checkEdit.removeAttribute("checked");
    activeToggleEdit.innerText = "not active";
  } else {
    checkEdit.setAttribute("checked", "checked");
    activeToggleEdit.innerText = "active";
  }
  checkEdit.addEventListener("click", () => {
    if (checkEdit.checked) {
      activeToggleEdit.innerText = "active";
    } else {
      activeToggleEdit.innerText = "not active";
    }
  });
  editForm.addEventListener("submit", (e) => {
    e.preventDefault();
    user.name = userNameEdit.value;
    user.age = userAgeEdit.value;
    user.activeStatus = activeToggleEdit.innerText;
    editFromStorage(users, user);

    window.location.href = "index.html";
  });
}

if (single) {
  // console.log("test")
  let users = readFromStorage();
  let user = readFromStorage("item", "object");
  if (users.length === 0) {
    createMyOwnEle("div", single, "no data to show", "alert alert-danger");
    user = {};
  } else {
    createMyOwnEle(
      "div",
      single,
      `${user.name} -- ${user.age} -- ${user.activeStatus} `,
      "alert alert-primary"
    );
  }
}
