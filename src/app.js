//import Modules
import {http} from './simpleHttp';
import {ui} from './ui.js';

//VARIABLES
const titleInput = document.getElementById('titleInput');
const contentInput = document.getElementById('contentInput');
const createBtn = document.getElementById('createBtn');
const posts = document.querySelector('.posts');
const backBtn = document.getElementById('backBtn');
const updateBtn = document.getElementById('updateBtn');
const editID = document.getElementById('editID');


//EVENT LISTNER
//Stop Enter Key instead of Click
document.addEventListener('keypress',stopEnterKey);
//Init Run
document.addEventListener('DOMContentLoaded',init)
//Create Post Button Click
createBtn.addEventListener('click',createBtnClick);
//Row Click (Deligation for Delete)
posts.addEventListener('click',deleteBtnClick);
//Row Click (Deligation for Edit Button)
posts.addEventListener('click',editBtnClick);
//Back Button Click
backBtn.addEventListener('click',backBtnClick);
//Back Button Click
updateBtn.addEventListener('click',updateBtnClick);

//FUNCTIONS

//Stop Enter Key
function stopEnterKey(e){
    if(e.keyCode === 13 || e.which === 13 ){
        e.preventDefault();
    }
}
//init
function init(){
    ui.changeMode('add');
    //Get All Data From LC
    const allData = http.get();
    //Show All Data From LC onshowData UI
    ui.showData(allData);
   
}
// Click on Post Create  Button
function createBtnClick(e){
    e.preventDefault();
    //Validation
    if(titleInput.value=='' || contentInput.value==''){
        //Show Alert
        ui.showAlert('Please Fill All Fields!','danger');
    }else{
        
        //Save in Local Storage
       http.post(titleInput.value,contentInput.value);
       //Clear reset form
       ui.clearForm();
       //Success Alert After Post
        ui.showAlert('Post Added Successfully !','success');
        //Get New Updated Data
        refreshData();
    }

}

//Click on Delete Button
function deleteBtnClick(e){
    e.preventDefault();
    //Deligation
    if(e.target.classList.contains('delete')){
    
        //Get Post ID
        if(confirm('Are You Sure?')){
            const postID = e.target.parentElement.parentElement.parentElement.parentElement.dataset.id;
             http.delete(postID);
             refreshData();
             ui.changeMode('add');
             ui.showAlert('Post Deleted Successfully','success');
        }
    }
}

//Click on Edit Button
function editBtnClick(e){
    e.preventDefault();
//Deligation
    if(e.target.classList.contains('edit')){
        //Chang Form To Edit Mode
        ui.changeMode('edit');

        //Get Post ID
        const postID = e.target.parentElement.parentElement.parentElement.parentElement.dataset.id;
        //Break Post ID To Array
        const postIDArr = postID.split("-");
        //Get Actual ID
        const id = postIDArr[1];

        //Get LC Data
        var data = http.get();
        //Loop
        let found = null;
        data.forEach(function(d,index){
            
            if(d.id == id){
                found = d; 
            }
            
        });

        //Fill Form With Clicked Post Data
        ui.fillForm(found);
        
    }
}

//Click On Back Button
function backBtnClick(e){
    e.preventDefault();
    ui.changeMode('add');
}

function updateBtnClick(e){
    e.preventDefault();
    if(titleInput.value=='' || contentInput.value==''){
        //Show Alert
        ui.showAlert('Please Fill All Fields!','danger');
    }else{
        if(editID.value != undefined && !isNaN(editID.value)){
            http.put(editID.value);
            refreshData();
            ui.showAlert('Post Updated Successfully !','success');
            ui.changeMode('add');
       }
        
    }
    
}

function refreshData(){
    const allData = http.get();
    //Show All Data From LC onshowData UI
    ui.showData(allData);
}
