/**
 * microBlog (using Module Design Pattern)
 * @version 2.0.0
 * @author Firooz Meysami
 * @license MIT
 * 
 */
// UI Controller
const UICtrl = (function(){
    //Private methods

    var output;
    const UISelector = {
        posts:'.posts',
        createBtn : 'createBtn',
        updateBtn : 'updateBtn',
        backBtn : 'backBtn',
        titleInp : 'titleInput',
        contentInp : 'contentInput',
        editIDInp : 'editID',
        jumbotron : '.jumbotron',
        form : 'form',
        editIDInp : 'editID'
    }

    const content = document.querySelector(UISelector.posts);
    const createButton = document.getElementById(UISelector.createBtn);
    const updateButton = document.getElementById(UISelector.updateBtn);
    const backButton = document.getElementById(UISelector.backBtn);
    const titleInput = document.getElementById(UISelector.titleInp);
    const contentInput = document.getElementById(UISelector.contentInp);
    const editIDInput = document.getElementById(UISelector.editIDInp);
    const jumbotron = document.querySelector(UISelector.jumbotron);
    const form = document.querySelector(UISelector.form);

    //Public methods
    return {
        showData:function(){
            const allData = httpCtrl.get();
            output = '';
         //If Exsit One more Post On Localstorage
        if(allData.length>0){
            allData.reverse().forEach( data =>{
            output += `
                <div class="row mb-3" data-id="post-${data.id}">
                    <div class="col-12">
                        <div class="card w-100">
                            <div class="card-header">${data.title}</div>
                            <div class="card-body">
                            ${data.content}
                            </div>
                            <div class="card-footer">
                                <button class="btn btn-warning edit">
                                    Edit
                                </button>
                                <button class="btn btn-danger delete">
                                    Delete
                                </button>
                            </div>
                        </div>
                        </div>
                    </div>
                    `;
             });
        //Localstorage is Empty
        }else{
            output += `<div class="col-12"><h3 class="text-center">No Post</h3></div>`; 
        }
        
        content.innerHTML = output;
        },
         //Change UI Mode
        changeMode : function(mode){
        if(mode == 'edit'){
            createButton.style.display = "none"
            updateButton.style.display = "inline"
            backButton.style.display = "inline"
        }else{
            createButton.style.display = "inline"
            updateButton.style.display = "none"
            backButton.style.display = "none"

        }
        UICtrl.clearForm();
         },
         clearForm : function(){
            titleInput.value='';
            contentInput.value='';
            editIDInput.value='';
         },

        elements :function(){
            return {
                titleInput,
                contentInput,
                jumbotron,
                form,
                content,
                createButton,
                editIDInput

            }
        },
        showAlert : function(message,className){

            // Create div
            const div = document.createElement('div');
            // Add classes
            div.className = 'alert alert-'+className;
            // Add text
            div.appendChild(document.createTextNode(message));
            // Insert alert div
            UICtrl.elements().jumbotron.insertBefore(div,UICtrl.elements().form );
           
            // Timeout
            setTimeout(() => {
            div.remove();
            }, 3000); 
        },
        fillForm : function(data){
        UICtrl.elements().titleInput.value = data.title;
        UICtrl.elements().contentInput.value = data.content;
        UICtrl.elements().editIDInput.value = data.id;
    }



    }
})()

// Http Controller
const httpCtrl = (function(){
    //Private methods
    var res;

    //Public methods
    return {
        get: function(){
            
            if(localStorage.getItem('data') === null){
                res = [];
            }else{
                res = JSON.parse(localStorage.getItem('data'));
            }
            return res;
        },
        post: function(title, content){
            //Get data From LocalStorage
            var lcData = httpCtrl.get();
            
            //Create data ID
            var id;
            if(lcData.length>0){
            id = lcData[lcData.length-1].id + 1;
            }else{
            id=0;
            }

            //Create an Object
            const data = {
            id: id,
            title:titleInput.value,
            content: contentInput.value,
            date:new Date
            }

            //add form Data to Localstorage Data
            lcData.push(data);

              //Convert lcData to string and Replace with date on LC
            localStorage.setItem('data',JSON.stringify(lcData));
            return data;
        },
        put:function(postID){
            //Get LC Data
            var data = httpCtrl.get();
            //Loop
            data.forEach(function(d,index){
                
                //if Founded
                if(d.id == postID){
                    d.title = titleInput.value ; 
                    d.content = contentInput.value ; 
                }
                
            });
            
            localStorage.setItem('data',JSON.stringify(data));
            return data;
        },
        delete: function(post){
             //Break Post ID To Array
            const postIDArr = post.split("-");
            //Get Actual ID
            const id = postIDArr[1];

            //Get LC Data
            var data = this.get();
            //Loop
            data.forEach(function(d,index){
                
                if(d.id == id){
                    data.splice(index,1) ; 
                }
                
            });
            localStorage.setItem('data',JSON.stringify(data));
            return data;
        }
    }
})()

//App Controller
const appCtrl = (function(httpCtrl, UICtrl){
    //Private methods

    //Contain All EventListners
    function loadEventListeners(){
        //Create Button Click
       UICtrl.elements().createButton.addEventListener('click',createButtonClick);
       //Row Click (Deligation for Delete)
        UICtrl.elements().content.addEventListener('click',deleteBtnClick);
       //Row Click (Deligation for Edit Button)
       UICtrl.elements().content.addEventListener('click',editBtnClick);
        //Back Button Click
       backBtn.addEventListener('click',backBtnClick);
        //Update Button Click
        updateBtn.addEventListener('click',updateBtnClick); 
    }

    //functions

    //Create Button Clicked
    function createButtonClick(e){
        e.preventDefault();
        //Validation
        if(UICtrl.elements().contentInput.value === '' || UICtrl.elements().titleInput.value === ''){

            //Show Alert
            UICtrl.showAlert('Please Fill All Field','danger');
        }else{

            //Create Post
            httpCtrl.post(UICtrl.elements().titleInput.value,UICtrl.elements().contentInput.value);
            //Show Data On UI
            UICtrl.showData();
            //Show Alert
            UICtrl.showAlert('Post Added Successfully !','success');

        }   
        
    }

    //Delete Post Clicked
    function deleteBtnClick(e){
        e.preventDefault();
        //Deligation
        if(e.target.classList.contains('delete')){
            
            //Confirm Deletion
            if(confirm('Are You Sure?')){
                //Get Post ID
                const postID = e.target.parentElement.parentElement.parentElement.parentElement.dataset.id;
                //Delete Post by ID
                 httpCtrl.delete(postID);
                 //Refresh UI data
                 UICtrl.showData();
                 //Change Form mode ('edit','add')
                 UICtrl.changeMode('add');
                 //Show Alert
                 UICtrl.showAlert('Post Deleted Successfully','success');
            }
        }
    }

    //Edit Post Clicked
    function editBtnClick(e){
        e.preventDefault();
    //Deligation
        if(e.target.classList.contains('edit')){
            //Chang Form To Edit Mode
            UICtrl.changeMode('edit');
    
            //Get Post ID
            const postID = e.target.parentElement.parentElement.parentElement.parentElement.dataset.id;
            //Break Post ID To Array
            const postIDArr = postID.split("-");
            //Get Actual ID
            const id = postIDArr[1];
    
            //Get LC Data
            var data = httpCtrl.get();
            //Loop
            let found = null;
            data.forEach(function(d,index){
                
                if(d.id == id){
                    found = d; 
                }
                
            });
    
            //Fill Form With Clicked Post Data
            UICtrl.fillForm(found);
            
        }
    }

    //Back Button Clicked
        function backBtnClick(e){
            e.preventDefault();
            //Change Form mode ('edit','add')
            UICtrl.changeMode('add');
            //Clear Form inputs
            UICtrl.clearForm();
        }

    //Update Button Clicked
    function updateBtnClick(e){
        e.preventDefault();
        if(UICtrl.elements().titleInput.value=='' || UICtrl.elements().contentInput.value==''){
            //Show Alert
            UICtrl.showAlert('Please Fill All Fields!','danger');
        }else{
            //Validation
            if(UICtrl.elements().editIDInput.value != undefined && !isNaN(UICtrl.elements().editIDInput.value)){
                //Update Post
                httpCtrl.put(UICtrl.elements().editIDInput.value);
                //Show Date on UI
                UICtrl.showData();
                //Show Alert
                UICtrl.showAlert('Post Updated Successfully !','success');
                //Change Form mode ('edit','add')
                UICtrl.changeMode('add');
           }
            
        }
        
    }
    
    //Public methods
    return{
        init:function(){
            //Show Data on UI
            UICtrl.showData();
            //Change Form mode ('edit','add')
            UICtrl.changeMode('add');
            // Load event listeners
            loadEventListeners();

        }
    }
})(httpCtrl, UICtrl)


//Start on Project init
appCtrl.init();
