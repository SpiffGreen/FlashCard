/**
 * @name    FlashCard
 * @author  Spiff Jekey-Green
 */


window.addEventListener("DOMContentLoaded", runApp);

/**
 * Apps Constants
 */
let offset = 0;
let main = null, navLinks = modalBtn = modalTitle = modalEdit = modalDelete = modalAnswer = modalInput = modalQuestion = null;  // Variables prepared to hold DOM elements
let loader = null, isFetchCompleted = false, isMenuOpen = false;
const LIMIT = 6;

function runApp() {
    main = document.querySelector("main");
    navLinks = document.querySelector(".nav-links");
    loader = document.querySelector(".loader");
    burger = document.querySelector(".burger");
    burger.addEventListener("click", toggleMenu);
    modalBtn = document.querySelector(".modalBtn");
    modalTitle = document.querySelector(".modal__title");
    modalAnswer = document.querySelector(".modalAnswer");
    modalQuestion = document.querySelector(".modalQuestion");
    modalInput = document.querySelector(".modalInput");
    modalDelete = document.querySelector(".deleteFlash");
    modalEdit = document.querySelector(".editFlash");
    // console.log(modalContent);
    
    // Intersection observer
    const observerOptions = {
        root: null,
        threshold: 0.3,
    };

    const mainObserver = new IntersectionObserver(handleLoad, observerOptions);
    mainObserver.observe(loader);

    if(innerWidth > 550) toggleMenu();
}

function handleLoad(entries) {
    const [entry] = entries;
    if(entry.isIntersecting) {
        if(!isFetchCompleted) {
            // loader.classList.toggle("hidden");
                loader.style.visibily = "visible";
                setTimeout(() => {
                    updateMain();
                loader.style.visibility = "hidden";
            }, 500);
        }
    }
    // loader.classList.toggle("hidden");
}

async function updateMain() {
    const data = await fetchCards();
    if(Array.isArray(data)) {
        data.forEach(i => {
            // const htmlStr = `<div class="card" id=${i._id}>
            // <p>${i.question}</p>
            // <input type="hidden" name="${i.answer}">
            // <button class="showAnswer">Show Answer</button><span class="slash">/</span><button class="edit">Edit</button>
            // </div>
            // `;
            // main.innerHTML += htmlStr;
            const cardDiv = document.createElement("div");
            // cardDiv.setAttribute("id", i._id);
            cardDiv.setAttribute("class", "card");
            const questionP = document.createElement("p");
            questionP.innerHTML = i.question;
            const answerInput = document.createElement("input");
            answerInput.value = i.answer;
            answerInput.setAttribute("type", "hidden");
            const showButton = document.createElement("button");
            showButton.innerText = "Show Answer";
            showButton.setAttribute("class", "showAnswer");
            showButton.addEventListener("click", () => {
                console.log(i);
                modalInput.value = i._id;
                modalAnswer.innerHTML = i.answer;
                modalQuestion.innerHTML = i.question;
                modalAnswer.blur();
                modalBtn.click();
                modalDelete.addEventListener("click", () => deleteFlashItem(i._id));
                modalEdit.addEventListener("click", () => editFlashItem(i._id));
            });

            // Add elements to div
            cardDiv.append(questionP, answerInput, showButton);
            main.append(cardDiv);
        });
    }
}

async function fetchCards() {
    const res = await fetch(`/api/cards?offset=${offset}&limit=${LIMIT}`);
    const data = await res.json();
    isFetchCompleted = data.isCompleted;
    offset += LIMIT;
    return data.data;    
}

function toggleMenu() {
    children = [...burger.children];
    children[1].classList.toggle("hide");
    children[0].classList.toggle("bend1");
    children[2].classList.toggle("bend2");
    navLinks.classList.toggle("hide-show");
}

function deleteFlashItem(id) {
    fetch("/api/delete", {
        method: "POST",
        body: JSON.stringify({data: id}),
        headers: {
            "Content-Type": "application/json"
        }
    });
    window.location.reload();
}

function editFlashItem(id) {
    const answer = modalAnswer.innerText;
    const question = modalQuestion.innerText;
    fetch("/api/edit", {
        method: "POST",
        body: JSON.stringify({id, answer, question}),
        headers: {
            "Content-Type": "application/json"
        }
    });
    window.location.reload();
}