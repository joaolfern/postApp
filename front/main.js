

const postsContainer = document.querySelector(".posts");
const createPost = document.querySelector(".createPost");
const editPostContainer = document.querySelector(".editPost");
const mainButton = document.querySelector("#mainButton");
const newPostDesc = document.querySelector(".createPost__desc");
const newPostTitle = document.querySelector(".createPost__title");
const editPostTitle = document.querySelector(".editPost__title");
const editPostDesc = document.querySelector(".editPost__desc");
const searchBar = document.querySelector(".nav__searchBar");
const noPost = document.querySelector(".noPost");

const API = "http://localhost:3000";
let data;
let editId;

refresh();

async function fetchData() {
  try{
    const response = await fetch(`${API}/posts`, {
      mode: 'cors',
      headers: {'Content-Type': 'application/json'},
    });
    data = await response.json()
  }catch(e){
    console.log(e);
    alert("Não é possível se conectar ao servidor");
  }
  
}

function genPosts() {
  return data
    .map(
      (post) => `
            <div class="post">
              <div class="post__header">
              <h1 class="post__title">${post.name}</h1>
              <div class="post__icons">
                <button class="post__deleteBtn" onclick="deletePost('${post["_id"]}')">
                  <i class="fas fa-trash"></i>
                </button>
                <button class="post__deleteBtn" onclick="editPost('${post.name}', '${post.description}', '${post["_id"]}')">
                  <i class="fas fa-pen"></i>
                </button>
              </div>     
              </div>
              <div class="post__body">
                <p class="post__description">${post.description}</p>
                <p class="post__date">· ${getDate(post.date)}</p>       
              </div>

            </div>
        `
    )
    .join("");
}

async function refresh(fetch = true) {
  if(fetch)
    await fetchData();
  
  document.title = `Postagens (${data.length})`;
  postsContainer.innerHTML = genPosts();

  if(data.length == 0){
    noPost.classList.remove("hidden");
  }
  if(data.length != 0){
    noPost.classList.add("hidden");
  }

}

async function addPost(){
  const title = newPostTitle.value;
  const desc = newPostDesc.value;
  
  const body = {
    name: title,
    description: desc.split('\n')
    .join('<br>')
  };

  const response = await fetch(`${API}/posts/`, {
    method: "POST",
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(body)
  });

  if(response.status !== 200){
    alert("Entrada inválida");
    return
  }

  refresh(true);
  showCreatePost(false);

  newPostTitle.value = "";
  newPostDesc.value = "";
}

async function deletePost(id){
  if(window.confirm("Deletar Post?")){
    const response = await fetch(`${API}/posts/${id}`, {
      method: "DELETE",
    });
  
    data = data.filter(post => post["_id"] != id);
    refresh(false);
  }
}

function editPost(name, desc, id){
  editPostContainer.classList.remove("hidden");
  postsContainer.classList.add("hidden");
  editPostTitle.value = name;
  editPostDesc.value = desc
    .split('<br>')
    .join('\n');

  editId = id;
}

async function saveEditedPost(){
  const brRefractored = editPostDesc.value
    .split('\n')
    .join('<br>');

  const body = {
    name: editPostTitle.value,
    description: brRefractored
  };

  const response = await fetch(`${API}/posts/${editId}`, {
    method: "PATCH",
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(body)
  });

  if(response.status !== 200){
    alert("Erro");
    console.log(response);
    return
  }

  cancelEdit();
  refresh();
}

async function searchPost(){
  if(!searchBar.classList.toggle("nav__searchBar--shown"))
    searchBar.style.transition = "unset";  
  else
    searchBar.style.transition =  "all .5s ease-out";

  searchBar.focus();
  if(!searchBar.classList.contains("nav__searchBar--shown")){
    const match = searchBar.value;
  
    const response = await fetch(`${API}/posts/${match}`);
    data = await response.json();
    refresh(false);
    searchBar.value = "";
  }
}

function getDate(dateString){
  const date = new Date(dateString);
  const now = new Date(Date.now());

  const diff = getTimeDiff(date, now);

  return diff.days ? `${diff.days} days`
   : diff.hours ? `${diff.hours} hours`
   : diff.minutes ? `${diff.minutes} min`
   : `${diff.seconds} sec`

}

function handleCancel(){
  emptyInput = newPostTitle.value == "" && newPostTitle.value == "" ? true : false;
  if(!emptyInput){
    if(window.confirm("Cancelar?")){
      newPostDesc.value = "";
      newPostTitle.value = "";
      showCreatePost();
    }
    return;
  } 
  showCreatePost();
}

function cancelEdit(){
  editPostContainer.classList.add("hidden");
  postsContainer.classList.remove("hidden");
}

function showCreatePost(screen) {
  if(createPost.classList.contains("hidden")){
    createPost.classList.remove("hidden");
    postsContainer.classList.add("hidden");
    toggleIcon(true);
  }
  else{
    createPost.classList.add("hidden");
    postsContainer.classList.remove("hidden");
    toggleIcon(false);
  }

  function toggleIcon(newPost = true){
    mainButton.classList.remove(`fa-${newPost ? "plus" : "home"}`);
    mainButton.classList.add(`fa-${newPost ? "home" : "plus"}`)
  }
}

function getTimeDiff(earlierDate, laterDate) 
{
    let oDiff = new Object();

    let nTotalDiff = laterDate.getTime() - earlierDate.getTime();

    oDiff.days = Math.floor(nTotalDiff / 1000 / 60 / 60 / 24);
    nTotalDiff -= oDiff.days * 1000 * 60 * 60 * 24;

    oDiff.hours = Math.floor(nTotalDiff / 1000 / 60 / 60);
    nTotalDiff -= oDiff.hours * 1000 * 60 * 60;

    oDiff.minutes = Math.floor(nTotalDiff / 1000 / 60);
    nTotalDiff -= oDiff.minutes * 1000 * 60;

    oDiff.seconds = Math.floor(nTotalDiff / 1000);

    let hourtext = '00';
    if (oDiff.days > 0){ hourtext = String(oDiff.days);}
    if (hourtext.length == 1){hourtext = '0' + hourtext};

    let mintext = '00';
    if (oDiff.minutes > 0){ mintext = String(oDiff.minutes);}
    if (mintext.length == 1) { mintext = '0' + mintext };

    let sectext = '00';
    if (oDiff.seconds > 0) { sectext = String(oDiff.seconds); }
    if (sectext.length == 1) { sectext = '0' + sectext };

    let sDuration = hourtext + ':' + mintext + ':' + sectext;
    oDiff.duration = sDuration;

    return oDiff;
}