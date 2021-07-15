import elements from "./elements.js";

const chkAgree = document.getElementById("agree");
const form = document.getElementById("regForm");
const subBtn = document.getElementById("sub");
chkAgree.addEventListener("change", (e) => {
    subBtn.disabled = !e.target.checked;
});

// form.addEventListener("submit", (e) => {
//     e.preventDefault();
//     sendCredentials();
// })

// async function sendCredentials() {
//     const data = {
//         name: elements.username.value,
//         email: elements.email.value,
//         password: elements.pass1.value
//     };

//     const res = await fetch("/register", {
//         method: "POST",
//         body: JSON.stringify(data),
//         header: {
//             "Content-Type": "application/json"
//         }
//     });
//     const result = await res.json();
//     console.log(result);
// }