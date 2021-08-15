import elements from "./elements.js";

const chkAgree = document.getElementById("agree");
const subBtn = document.getElementById("sub");
chkAgree.addEventListener("change", (e) => {
    if((elements["pass1"].value === elements["pass2"].value) && (elements["pass1"].value.length > 6)) {
        subBtn.disabled = false;
    } else {
        subBtn.disabled = true;
    }
});

function validData() {
    let valid = true;
    if(elements["pass1"].value !== elements["pass2"].value) valid = false;
    if(!(elements["pass1"].value.length > 6 && elements["pass2"].length > 6)) valid = false;
    if(elements["pass1"].value.search(/\$|\^|#|_|@|!|%|&/g) === -1) valid = false;
    if(elements["pass1"].value.search(/[0-9]+/g) === -1) valid = false;
    if(elements["pass1"].value.search(/[A-Z]+/g) === -1) valid = false;
    if(elements["pass1"].value.search(/[a-z]+/g) === -1) valid = false;
    if(elements["email"].value.search(/[a-zA-Z0-9_]+\.*[a-zA-Z0-9_]+@[a-zA-Z0-9_]+\.+[a-zA-Z0-9_]+/g) === -1) valid = false;
    if(elements["username"].value.length < 5) valid = false;
    return valid;
}