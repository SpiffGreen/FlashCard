/**
 * @name    FlashCard
 * @author  Spiff Jekey-Green
 */


window.addEventListener("DOMContentLoaded", runApp);

/**
 * Apps Constants
 */
let offset = 0;
let main = null, loader = null, isFetchCompleted = false;
const LIMIT = 6;

function runApp() {
    main = document.querySelector("main");
    loader = document.querySelector(".loader");
    // updateMain();

    // Intersection observer
    const observerOptions = {
        root: null,
        threshold: 0.3,
    };

    const mainObserver = new IntersectionObserver(handleLoad, observerOptions);
    mainObserver.observe(loader);
}

function handleLoad(entries) {
    const [entry] = entries;
    if(entry.isIntersecting) {
        if(!isFetchCompleted) {
            loader.classList.toggle("hidden");
            setTimeout(() => {
                updateMain();
                loader.classList.toggle("hidden");
            }, 500);
        }
    }
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
    isFetchCompleted = data.isCompleted;
    offset += LIMIT;
    return data.data;    
}
