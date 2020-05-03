$(document).ready(function(){

let rexp = {
    name : /^[a-zA-Z]+$/,
    number : /^[0-9]+$/,
    username : /^[\w]+$/,
    email : /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    adress : /^[\w\-\s\,]+$/,
    password : /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/,
    sreg : /^[\w\-\?\s]+$/i
}

//Preview Image before submission
let preview_image = (event) => {
    var reader = new FileReader();
    reader.onload = function(){
    document.getElementById('imgcircle').src = reader.result;
   }
    reader.readAsDataURL(event.target.files[0]);
}

let validate = (field) => {
    if(!document.querySelector(".error")){
        let value = $(`#id_${field}`).val();
        let exts = ['jpg', 'jpeg', 'png'];
        if(field == "image"){
			var get_ext = value.split('.').reverse()[0].toLowerCase();
			if(!($.inArray (get_ext, exts) > -1)){
                $(`#id_${field}`).after(`<span class="error">Invalid Image</span>`);
            }
        }else if(field == "password" || field == "password2"){
            if( value.length < 8   ){
                $(`#id_${field}`).after(`<span class="error">Password must be @least 8 character}</span>`);
            }else if( $("#id_password").val() != $("#id_password2").val() ){
                $(`#id_${field}`).after('<div class="error">Password doesnt match</div>');
            }else if( !rexp.password.test(value) ){
                $(`#id_${field}`).after('<span class="error">Password not strong enough</span>');
            }else if( value == $("#id_username").val()  ){
                $(`#id_${field}`).after('<span class="error">Password must be different from username</span>');
            }
        }
        else if(field == "email"){
            if( value == "" || !rexp.email.test(value) ){
                $(`#id_${field}`).after(`<span class="error">Invalid Email</span>`);
            }
        }else if(field == "username" || field == "option"){
            if( value == "" ){
                $(`#id_${field}`).after(`<span class="error">${field} must not be empty</span>`);
            }
        }else{
            document.querySelector("#tab2").classList.remove("disbled")
            $("#personal").trigger("click");
        }
    } 
}

$("#id_image").change(() => {
    preview_image(event);
})

let allField = ["image","option", "username", "password", "password2", "email", ""]

$("#next").click(() => {
    try{
        for(field of allField){
            validate(field )
         }
    }catch(error){
        alert("Error Validating Fields");
    }
})

$("#back").click(() => {
    $("#login").trigger("click");
})

//remove the error from input field
$("input").change(function(){
    $(".error").remove();
});
$("input").keypress(function(){
    $(".error").remove();
});
$("select").change(function(){
    $(".error").remove();
});
$("select").keypress(function(){
    $(".error").remove();
});
    
    
$(function(){
	$("#id_query").autocomplete({
    minLength: 1,
    source: "search/",
    });
  });

});

