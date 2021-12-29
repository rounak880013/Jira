let addbtn=document.querySelector(".add");
let body=document.querySelector("body");
let grid=document.querySelector(".grid");
let deleteBtn=document.querySelector(".delete");
let deleteMode=false;
let allFiltersChildren = document.querySelectorAll(".filter div");
let filter_selected=false;
let selected_color="";
task_loaded=false;
for (let i = 0; i < allFiltersChildren.length; i++) {
  allFiltersChildren[i].addEventListener("click", function (e) {
    if(selected_color==e.currentTarget.classList[0]){
        filter_selected==false;
        selected_color="";
        loadTasks();
    }
    else{
    let filterColor = e.currentTarget.classList[0];
    selected_color=e.currentTarget.classList[0];
    loadTasks(filterColor);}
  });
}
if(localStorage.getItem("AllTickets")==undefined){
    let allTickets={};
    allTickets=JSON.stringify(allTickets);
    localStorage.setItem("AllTickets",allTickets);
}
loadTasks();
deleteBtn.addEventListener("click", function (e) {
    if (e.currentTarget.classList.contains("delete-selector")) {
      e.currentTarget.classList.remove("delete-selector");
      deleteMode = false;
    } else {
      e.currentTarget.classList.add("delete-selector");
      deleteMode = true;
    }
  });
addbtn.addEventListener("click",function(){
    deleteBtn.classList.remove("delete-selector");
    deleteMode=false;
    let premodal=document.querySelector(".modal");
    if(premodal!=null){
        return;
    }
    let s=`<div class="modal">
    <div class="task-section">
        <div class="task-inner-section" contenteditable="true"></div>
    </div>
    <div class="modal-priority-section">
        <div class="priority-inner-container">
            <div class="modal-priority pink"></div>
            <div class="modal-priority blue"></div>
            <div class="modal-priority green"></div>
            <div class="modal-priority black selected"></div>
        </div>
    </div>
</div>`;
    let div=document.createElement("div");
    div.innerHTML=s;
    body.append(div);
    let ticketColor="black";
    let allModalPriority=document.querySelectorAll(".modal-priority");
    for(let i=0;i<allModalPriority.length;i++){
        allModalPriority[i].addEventListener("click",function(e){
            for(let j=0;j<allModalPriority.length;j++){
                allModalPriority[j].classList.remove("selected");
            }
            e.currentTarget.classList.add("selected");
            ticketColor=e.currentTarget.classList[1];
        });
    }
    let taskInnerContainer=div.querySelector(".task-inner-section");
    taskInnerContainer.addEventListener("keydown",function(e){
        if(e.key=="Enter"){
            let id=uid();
            let task=e.currentTarget.innerText;
            let allTickets=JSON.parse(localStorage.getItem("AllTickets"));
            let ticketObj={
                color:ticketColor,
                taskValue:task,
            }
            allTickets[id]=ticketObj;
            let ticketDiv = document.createElement("div");
            ticketDiv.classList.add("ticket");
            localStorage.setItem("AllTickets",JSON.stringify(allTickets));
            ticketDiv.innerHTML=`<div class="ticket-color ${ticketColor}"></div>
            <div class="ticket-ID">#${id}</div>
            <div class="actual-task">
            ${e.currentTarget.innerText}
            </div>`;
            let ticketColorDiv=ticketDiv.querySelector(".ticket-color");
            ticketColorDiv.addEventListener("click",function(e){
                let Colors=["pink","blue","green","black"];
                let currColor=e.currentTarget.classList[1];
                let index=-1;
                for(let i=0;i<Colors.length;i++){
                    if(Colors[i]==currColor){
                        index=i;
                    }
                }
                index++;
                index=index%4;
                let newColor=Colors[index];
                ticketColorDiv.classList.remove(currColor);
                ticketColorDiv.classList.add(newColor);
            })
            ticketDiv.addEventListener("click", function (e) {
                if (deleteMode) {
                  e.currentTarget.remove();
                }
              });
            grid.append(ticketDiv);
            div.remove();
        }else if(e.key=="Escape"){
            div.remove();
        }
    });
})
function loadTasks(color) {
    let ticketsOnUi = document.querySelectorAll(".ticket");
  
    for (let i = 0; i < ticketsOnUi.length; i++) {
      ticketsOnUi[i].remove();
    }
  
    //1- fetch alltickets data
  
    let allTickets = JSON.parse(localStorage.getItem("AllTickets"));
  
    //2- create ticket UI for each ticket obj
    //3- attach required listeners
    //4- add tickets in the grid section of ui
  
    for (x in allTickets) {
      let currTicketId = x;
      let singleTicketObj = allTickets[x]; //pink
  
      //passed color was black
      if (color) {
        if (color != singleTicketObj.color) continue;
      }
  
      let ticketDiv = document.createElement("div");
      ticketDiv.classList.add("ticket");
  
      ticketDiv.setAttribute("data-id", currTicketId);
  
      ticketDiv.innerHTML = ` <div data-id="${currTicketId}" class="ticket-color ${singleTicketObj.color}"></div>
        <div class="ticket-id">
          #${currTicketId}
        </div>
        <div data-id="${currTicketId}" class="actual-task" contenteditable="true">
          ${singleTicketObj.taskValue}
        </div>`;
  
      let ticketColorDiv = ticketDiv.querySelector(".ticket-color");
  
      let actualTaskDiv = ticketDiv.querySelector(".actual-task");
  
      actualTaskDiv.addEventListener("input", function (e) {
        let updatedTask = e.currentTarget.innerText;
  
        let currTicketId = e.currentTarget.getAttribute("data-id");
        let allTickets = JSON.parse(localStorage.getItem("AllTickets"));
  
        allTickets[currTicketId].taskValue = updatedTask;
  
        localStorage.setItem("AllTickets", JSON.stringify(allTickets));
      });
  
      ticketColorDiv.addEventListener("click", function (e) {
        let colors = ["pink", "blue", "green", "black"];
  
        let currTicketId = e.currentTarget.getAttribute("data-id");
  
        let currColor = e.currentTarget.classList[1]; //green
  
        let index = -1;
        for (let i = 0; i < colors.length; i++) {
          if (colors[i] == currColor) index = i;
        }
  
        index++;
        index = index % 4;
  
        let newColor = colors[index];
  
        //1- all tickets lana ; 2- update krna ; 3- wapis save krna
  
        let allTickets = JSON.parse(localStorage.getItem("AllTickets"));
  
        allTickets[currTicketId].color = newColor;
  
        localStorage.setItem("AllTickets", JSON.stringify(allTickets));
  
        ticketColorDiv.classList.remove(currColor);
        ticketColorDiv.classList.add(newColor);
      });
  
      ticketDiv.addEventListener("click", function (e) {
        if (deleteMode) {
          let currTicketId = e.currentTarget.getAttribute("data-id");
  
          e.currentTarget.remove();
  
          let allTickets = JSON.parse(localStorage.getItem("AllTickets"));
  
          delete allTickets[currTicketId];
  
          localStorage.setItem("AllTickets", JSON.stringify(allTickets));
        }
      });
  
      grid.append(ticketDiv);
    }
  }