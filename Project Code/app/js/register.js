function passwordCheck() {    
    var myInput = document.getElementById("psw");
    var length = document.getElementById("length");
    var number = document.getElementById("number");
    var upperCaseLetters = /[A-Z]/; // : Fill in the regular experssion for upperCaseLetters
    var numbers = /\d/; // : Fill in the regular experssion for digits
    var minLength = 8;
    myInput.onkeyup = function() {
        console.log(letter.classList);
        //Validating capital letter requirement
        if(myInput.value.match(upperCaseLetters)) {
            letter.classList.remove("invalid");
            letter.classList.add("valid");
        }
        else {
            letter.classList.remove("valid");
            letter.classList.add("invalid")
        }
        //Validating length
        if(myInput.value.length >= minLength) {
            length.classList.remove("invalid");
            length.classList.add("valid");
        }
        else {
            length.classList.remove("valid");
            length.classList.add("invalid")
        }
        //Validating numbers
        if(myInput.value.match(numbers)) {
            number.classList.remove("invalid");
            number.classList.add("valid");
        }
        else {
            number.classList.remove("valid");
            number.classList.add("invalid")
        }
    };
}

function emailCheck() {    
    var myInput = document.getElementById("confirmEmail");
    var emailMatch = document.getElementById("emailMatch");
    myInput.onkeyup = function() {
        console.log(emailMatch.classList);
        console.log(document.getElementById("email").value);
        if(document.getElementById("email").value == document.getElementById("confirmEmail").value && (document.getElementById("confirmEmail").value != "")) {
            emailMatch.classList.remove("invalid");
            emailMatch.classList.add("valid");
            console.log("match");
        }
        else {
            emailMatch.classList.remove("valid");
            emailMatch.classList.add("invalid");
            console.log("not match");
        }
    };
}

function passwordMatch() {    
    var myInput = document.getElementById("cpsw");
    var pswMatch = document.getElementById("pswMatch");
    myInput.onkeyup = function() {
        console.log(pswMatch.classList);
        console.log(document.getElementById("psw").value);
        if(document.getElementById("psw").value == document.getElementById("cpsw").value) {
            pswMatch.classList.remove("invalid");
            pswMatch.classList.add("valid");
            console.log("match");
        }
        else {
            pswMatch.classList.remove("valid");
            pswMatch.classList.add("invalid");
            console.log("not match");
        }
    };
}