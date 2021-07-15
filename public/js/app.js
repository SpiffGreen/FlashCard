/**
 * @name    FlashCard
 * @author  Spiff Jekey-Green
 */


window.addEventListener("DOMContentLoaded", runApp);

/**
 * Apps Constants
 */
let offset = 0;
let main = null;
const LIMIT = 10;

function runApp() {
    main = document.querySelector("main");
    updateMain();
}

async function updateMain() {
    const data = await fetchCards();
    if(Array.isArray(data)) {
        data.forEach(i => {
            const htmlStr = `<div class="card" id=${i._id}>
            <p>${i.question}</p>
            <input type="hidden" name="${i.answer}">
            <button class="showAnswer">Show Answer</button><span class="slash">/</span><button class="edit">Edit</button>
        </div>
            `;
            main.innerHTML += htmlStr;
        });
    }
}

async function fetchCards() {
    const res = await fetch(`/cards?offset=${offset}&limit=${LIMIT}`);
    const data = await res.json();
    return data;    
}
