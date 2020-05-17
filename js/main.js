// Select element
const form = document.querySelector('.form'),
    input = document.querySelector('.find'),
    show = document.querySelector('.show'),
    showLyric = document.querySelector('.show-lyric'),
    modal = document.querySelector('.modal'),
    error = document.querySelector('.error'),
    close = document.querySelector('.close'),
    titles = document.querySelector('.titles'),
    spinner = document.querySelector('.spinner'),
    navigation = document.querySelector('.navigation');

// https://lyricsovh.docs.apiary.io/#

// URL API
// let url = `https://api.lyrics.ovh/v1/${inputValue}/${inputValue}`;

//
// 8 ─── SCROLL ON TOP ──────────────────────────────────────────────────────────────
//

const scrollOnTop = () => {
    let options = {
        top: 0,
        left: 0,
        behavior: "smooth"
    };
    window.scrollTo(options);
}

//
// ─── IS FETCHING ────────────────────────────────────────────────────────────────
//
let isLoading = false;
const isFetching = (isLoading) => {
    if (isLoading) {
        spinner.classList.add('show-loader');
    } else {
        spinner.classList.remove('show-loader');
    }
};


//
// 6 ─── FIND TEXT ──────────────────────────────────────────────────────────────────
const findText = async(artist, song) => {
    // Url to fetch
    let url = `https://api.lyrics.ovh/v1/${artist}/${song}`;
    // Try and catch
    try {
        let fetchText = await fetch(url);
        let textRes = await fetchText.json();
        // console.log(textRes);
        // Insert line brake
        const text = textRes.lyrics.replace(/,/g, '<br>');
        // Show text
        let t = `
        ${text !== '' ? text.trim() : 'Lyric empty, sorry.'}
        `;
        // Append
        showLyric.innerText = t;
        showLyric.classList.add('show-text');
        close.classList.add('show-close');

    } catch (error) {
        if (error) {
            console.log(error);
            errorFunction('Lyric empty sorry.')
        }
    }
};

//
// 5 ─── PAGINATION FETCH ───────────────────────────────────────────────────────
const paginationFetch = async(url) => {
    // console.log(url)

    // Show loader
    isLoading = true;
    isFetching(isLoading);
    // Try and catch
    try {
        let fetchLyrics = await fetch(`
                http://cors-anywhere.herokuapp.com/${url}`);
        let lyricsRes = await fetchLyrics.json();
        // console.log(lyricsRes);
        // Clear
        show.innerHTML = ''
            // Show results in the DOM function
        showResults(lyricsRes);
        // Scroll on top
        scrollOnTop()
            // Hide loader
        isLoading = false;
        isFetching(isLoading);
    } catch (error) {
        if (error) console.log(error);
    }
};

//
// 1 ─── FIND LYRICS FUNCTION ───────────────────────────────────────────────────────
const findLyrics = async(inputValue) => {
    // Show loader
    isLoading = true;
    isFetching(isLoading);
    // Url to fetch
    let url = `https://api.lyrics.ovh/suggest/${inputValue}`;
    // Try and catch
    try {
        let fetchLyrics = await fetch(url);
        let lyricsRes = await fetchLyrics.json();
        // console.log(lyricsRes);
        // Show results in the DOM function
        showResults(lyricsRes);
        // Hide loader
        isLoading = false;
        isFetching(isLoading);

    } catch (error) {
        if (error) console.log(error);
    }
};

//
// 3 ─── SHOW RESULTS FUNCTION ──────────────────────────────────────────────────────
const showResults = (results) => {
        // console.log(results);
        // First clear result
        show.innerHTML = ''
            // Loop through
        results.data.forEach(r => {
            // console.log(r)
            // Create a card element
            let card = document.createElement('div');
            // add card class
            card.classList.add('card');
            // Inner Html
            card.innerHTML = `
        <div class='center'><a href='${r.album.cover_big}' target='blank'>
        <img class='cover' src='${r.album.cover_small}'></img>
        </a></div>
        <div class='title'><strong>${r.title_short}</strong></div>
        <div class='album'>${r.album.title.substring(0, 13)} ...  </div>
        <div class='artist'><a href='${r.artist.link}' target='blank'><strong>${r.artist.name.substring(0,13)}<strong></a> <img src='${r.artist.picture_small}'> </div>
        <div class='center-lyric'><button onclick="findText('${r.artist.name}', '${r.title}')">Lyric</button></div>
       `
                // append to the DOM
            show.appendChild(card)
        });

        // Show titles
        titles.classList.add('show-titles');

        // Navigation buttons
        if (results.prev || results.next) {
            navigation.innerHTML = `
        ${results.prev ? `<button onclick="paginationFetch('${results.prev}')" >Prev</button>` : ''}
        ${results.next ? `<button onclick="paginationFetch('${results.next}')">Next</button>` : ''}
        `
    }
};


//
// 4 ─── HANDLE ERROR FUNCTION ─────────────────────────────────────────────────────────────

const errorFunction = (message) => {
    setTimeout(() => {
        error.classList.add('hide')
        error.innerHTML = ''
        
    }, 5000); // Clear after 5sec
    error.classList.remove('hide')
    error.innerHTML = message;
    
}

//
// 2 ─── EVENT LISTENER ─────────────────────────────────────────────────────────────

form.addEventListener('submit', e => {
    // Prevent default
    e.preventDefault();
    // Input value
    let inputValue = input.value;
    // console.log(inputValue)
    // Validation
    if (inputValue === '') {
        return errorFunction('Fill the input field.')
    }

    // Find lyrics
    findLyrics(inputValue);
    // Reset form
    form.reset()

});

 //
 // 7 ─── CLOSE MODAL ────────────────────────────────────────────────────────────────
 //
window.addEventListener('click', (e)=>{
    // console.log(e);
    // console.log(e.target);
    if(e.target !== showLyric ){
        showLyric.classList.add('hide');
        showLyric.classList.remove('show-text');
        close.classList.remove('show-close');
        // Scroll on top
        scrollOnTop()
    }
})


// Close event listener
close.addEventListener('click', ()=>{
    showLyric.classList.add('hide');
    showLyric.classList.remove('show-text');
    close.classList.remove('show-close');
    // Scroll on top
     scrollOnTop();
});