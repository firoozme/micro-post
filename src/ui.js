class UI {
    //Construct
    constructor(){
        this.content = document.querySelector('.posts');
    }

    //Show Data
    showData(allData){
        var output = '';
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
        
        this.content.innerHTML = output;
    }

    //Show Alert
    showAlert(message,className){

        //Create Element Alert
        var div = document.createElement('div');
        div.classList = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const jumbotron = document.querySelector('.jumbotron');
        const form = document.querySelector('form');
        //Insert Created Element on UI
        jumbotron.insertBefore(div,form);
        //Hide Alert after 3 ms
        setTimeout(()=>div.remove(),3000);
    }

    //Clear Form
    clearForm(){
        document.getElementById('titleInput').value='';
        document.getElementById('contentInput').value='';
        document.getElementById('editID').value='';
    }

    //Change UI Mode
    changeMode(mode){
        if(mode == 'edit'){
            document.getElementById('createBtn').style.display = "none"
            document.getElementById('updateBtn').style.display = "inline"
            document.getElementById('backBtn').style.display = "inline"
        }else{
            document.getElementById('createBtn').style.display = "inline"
            document.getElementById('updateBtn').style.display = "none"
            document.getElementById('backBtn').style.display = "none"

        }
        ui.clearForm();
    }

    //Remove Edit Mode
    fillForm(data){
        document.getElementById('titleInput').value = data.title;
        document.getElementById('contentInput').value = data.content;
        document.getElementById('editID').value = data.id;
    }
}

export const ui = new UI;