/**
 * Simple HTTP Library
 * Library for making HTTP requests
 *
 * @version 1.0.0
 * @author  Firooz Meysami
 *
 **/

class EasyHTTP {
    // Make an HTTP GET Request 
    get() {
        var res;
      if(localStorage.getItem('data') === null){
          res = [];
      }else{
          res = JSON.parse(localStorage.getItem('data'));
      }
      return res;
    }
  
    // Make an HTTP POST Request
    post(title,content) {
        //Get data From LocalStorage
        var lcData = this.get();
        
        //Create data ID
        var id;
        if(lcData.length>0){
          id = lcData[lcData.length-1].id + 1;
        }else{
          id=0;
        }

        // Create an Object
        const data = {
          id: id,
          title:title,
          content: content,
          date:new Date
        }

        //add form Data to Localstorage Data
        lcData.push(data);

       //Convert lcData to string and Replace with date on LC
        localStorage.setItem('data',JSON.stringify(lcData));
        
    }
  
     // Make an HTTP PUT Request
     put(postID) {
       
      //Get LC Data
      var data = this.get();
      //Loop
      data.forEach(function(d,index){
          
          //if Founded
          if(d.id == postID){
            d.title = titleInput.value ; 
            d.content = contentInput.value ; 
          }
          
      });
      
      localStorage.setItem('data',JSON.stringify(data));
      

    }
  
    // Make an HTTP DELETE Request
     delete(post) {
       
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
      
    }
  
   }
  
export const http = new EasyHTTP;