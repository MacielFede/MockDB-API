const URL = "https://6362eea437f2167d6f6fa8ba.mockapi.io/Usuarios/";

function showResults(lista){
     //Displays the result of a fetch promise
     let htmlToAppend = "";
     if(Array.isArray(lista)){
          for (let usuario of lista) {
               htmlToAppend += `
                    <li class="my-2 ms-2" > ID: ${usuario.id} <br>
                         Nombre: ${usuario.Nombre} <br>
                         Apellido: ${usuario.Apellido}
                    </li>
               `;
          }
     }else{
          htmlToAppend += `
                    <li> ID: ${lista.id} <br>
                         Nombre: ${lista.Nombre} <br>
                         Apellido: ${lista.Apellido}
                    </li>
               `;
     }
     document.getElementById("results").innerHTML = htmlToAppend;
}

function getData(url, id){
     fetch(url + id, {
          method: 'GET',
          headers: {'Content-Type': 'application/json'}
     }).then(response => {
          if (response.ok) {
               return response.json();
          }else{
               throw Error(response.statusText);
          }
     })
     .then(respuesta => {
          showResults(respuesta);
          console.log(respuesta);
     })
     .catch(error => {
          document.getElementById("alert-error").classList.add("show");
          console.log(error);
     });
}

document.addEventListener("DOMContentLoaded", function(){
     //Listamos los Usuarios existentes en la DB
     document.getElementById("btnGet1").addEventListener("click", function(){
          let id = document.getElementById("inputGet1Id").value;
          getData(URL, id);
     });

     //Functions used to POST (add) new users to the db
     document.getElementById("inputPostNombre").addEventListener("keyup", function(){
          if(this.value != "" && document.getElementById("inputPostApellido").value != ""){
               document.getElementById("btnPost").removeAttribute("disabled");
          }else{
               document.getElementById("btnPost").disabled = true;
          }
     })
     document.getElementById("inputPostApellido").addEventListener("keyup", function(){
          if(this.value != "" && document.getElementById("inputPostNombre").value != ""){
               document.getElementById("btnPost").removeAttribute("disabled");
          }else{
               document.getElementById("btnPost").disabled = true;
          }
     })
     document.getElementById("btnPost").addEventListener("click", function(){
          let nombre = document.getElementById("inputPostNombre").value;
          let apellido = document.getElementById("inputPostApellido").value;
          fetch(URL,{
               method: 'POST',
               headers: {'Content-Type': 'application/json'},
               body: JSON.stringify({
                    Nombre: nombre,
                    Apellido: apellido
               })
          }).then(response => {
               if (response.ok) {
                    getData(URL, "");
                    document.getElementById("inputPostNombre").value = "";
                    document.getElementById("inputPostApellido").value = "";
                    document.getElementById("btnPost").disabled = true;
               }else{
                    throw Error(response.statusText);
               }
          })
          .catch(error => {
               document.getElementById("alert-error").classList.add("show");
               console.log(error);
          });
     });

     //Functions to handle modifications on the already existing users
     document.getElementById("inputPutId").addEventListener("input", function(){
          //If there's values in the input, display the button
          if(this.value!="" && this.value>0){
               document.getElementById("btnPut").disabled = false;
          }else{
               document.getElementById("btnPut").disabled = true;
          }
     })
     document.getElementById("btnPut").addEventListener("click", function(){
          fetch(URL + document.getElementById("inputPutId").value, {
               method: 'GET',
               headers: {'Content-Type': 'application/json'}
          }).then(response => {
               if (response.ok) {
                    return response.json();
               }else{
                    throw Error(response.statusText);
               }
          })
          .then(respuesta => {
               document.getElementById("inputPutNombre").value = respuesta.Nombre;
               document.getElementById("inputPutApellido").value = respuesta.Apellido;
               document.getElementById("btnSendChanges").disabled = false;
          })
          .catch(error => {
               document.getElementById("alert-error").classList.add("show");
               console.log(error);
          });
     });
     document.getElementById("cancelChanges").addEventListener("click", function(){
          document.getElementById("inputPutId").value = "";
          document.getElementById("btnPut").disabled = true;
     })
     document.getElementById("btnSendChanges").addEventListener("click", function(){
          let nombre = document.getElementById("inputPutNombre").value;
          let apellido = document.getElementById("inputPutApellido").value;
          let id =document.getElementById("inputPutId").value;
          fetch(URL+id,{
               method: 'PUT',
               headers: {'Content-Type': 'application/json'},
               body: JSON.stringify({
                    Nombre: nombre,
                    Apellido: apellido
               })
          }).then(response => {
               if (response.ok) {
                    getData(URL, "");
                    document.getElementById("inputPutId").value = "";
                    document.getElementById("btnPut").disabled = true;
               }else{
                    throw Error(response.statusText);
               }
          })
          .catch(error => {
               document.getElementById("alert-error").classList.add("show");
               console.log(error);
          });
     });

     //Functions to handle the deleting of users
     document.getElementById("inputDelete").addEventListener("input", function(){
          //If there's values in the input, display the button
          if(this.value!="" && this.value>0){
               document.getElementById("btnDelete").disabled = false;
          }else{
               document.getElementById("btnDelete").disabled = true;
          }
     })
     document.getElementById("btnDelete").addEventListener("click", function(){
          fetch(URL + document.getElementById("inputDelete").value, {
               method: 'DELETE',
               headers: {'Content-Type': 'application/json'}
          }).then(response => {
               if (response.ok) {
                    getData(URL, "");
                    document.getElementById("btnDelete").disabled = true;
                    document.getElementById("inputDelete").value = "";
               }else{
                    throw Error(response.statusText);
               }
          })
          .catch(error => {
               document.getElementById("alert-error").classList.add("show");
               console.log(error);
          });
     });


     //Refresh of the web page so the user can see the alert more than once
     document.getElementById("dismissAlert").addEventListener("click", function(){
          location.reload();
     })
});