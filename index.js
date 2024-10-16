const searchResult = document.getElementById('searchResults');
const elList = document.querySelector('.list');
const elForm = document.querySelector('.form');
const elGenres = document.querySelector('#genre');
const elMovieTitle = document.getElementById('movieTitle'); // Film nomi inputi
const elBookmarkList = document.querySelector('#bookmarkedMoviesList');
const localData = JSON.parse(window.localStorage.getItem('bookmark')) || []; // Dastlabki bookmarklar
let elBookmarked = localData; // Saqlangan bookmarklar
let counter = 0;

// Dastlabki film soni
searchResult.textContent = films.length;

// Dastlabki yuklash: bookmark ro'yxatini ko'rsatish
const renderBookmarkList = function() {
    elBookmarkList.innerHTML = '';
    elBookmarked.forEach(function(bookmark) {
        const newLi = document.createElement('li');
        const removeBtn = document.createElement('button');

        removeBtn.textContent = 'Remove';
        newLi.textContent = bookmark.title;

        removeBtn.addEventListener('click', function() {
            elBookmarkList.removeChild(newLi);
            elBookmarked.splice(elBookmarked.indexOf(bookmark), 1);
            window.localStorage.setItem('bookmark', JSON.stringify(elBookmarked));
            if (elBookmarked.length === 0) {
                window.localStorage.removeItem('bookmark');
            }
        });

        elBookmarkList.appendChild(newLi);
        newLi.appendChild(removeBtn);
    });
};

// Dastlabki yuklash
if (localData.length > 0) {
    renderBookmarkList();
}

// Qidiruv funksiyasi
elForm.addEventListener('submit', function(evt) {
    evt.preventDefault(); // Formani yuborishdan to'xtatish

    const selectedGenre = elGenres.value;
    const titleFilter = elMovieTitle.value.toLowerCase(); // Film nomini qidirish
    const filteredFilms = films.filter(film => {
        const matchesGenre = selectedGenre === "all" || film.genres.includes(selectedGenre);
        const matchesTitle = film.title.toLowerCase().includes(titleFilter);
        return matchesGenre && matchesTitle; // Har ikkala shartni qondirishi kerak
    });

    // Qidiruv natijalarini yangilash
    searchResult.textContent = filteredFilms.length; // Yangilandi

    // Film ro'yxatini yangilash
    elList.innerHTML = ""; // Avvalgi natijalarni tozalash
    renderMoviesList(filteredFilms, elList);

    // Inputlarni tozalash
    elMovieTitle.value = null; // Film nomini tozalash
    elGenres.value = "all"; // Select optionini "All" holatga qaytarish
});

// Bookmark funksiyasi
elList.addEventListener('click', function(evt) {
    const bookmarkId = evt.target.dataset.bookmarkBtnId * 1;
    const foundBookmarkIndex = films.find(film => film.release_date === bookmarkId);

    if (evt.target.matches('.bookmark')) {
        if (!elBookmarked.includes(foundBookmarkIndex)) {
            elBookmarked.push(foundBookmarkIndex);
            window.localStorage.setItem('bookmark', JSON.stringify(elBookmarked));
            renderBookmarkList(); // Yangilangan bookmark ro'yxatini ko'rsatish
        }
    }
});

// Janrlarni ro'yxatini ko'rsatish
const renderGenresList = function(arr) {
    const genreList = [];
    arr.forEach(function(film) {
        film.genres.forEach(function(genre) {
            if (!genreList.includes(genre)) {
                genreList.push(genre);
                const newOption = document.createElement('option');
                newOption.value = genre;
                newOption.textContent = genre;
                elGenres.appendChild(newOption);
            }
        });
    });
}

// Filmlar ro'yxatini ko'rsatish
const renderMoviesList = function(filmsArr, htmlElement) {
    filmsArr.forEach(function(film) {
        film.genres.push("Bookmark");

        const newItem = document.createElement('li');
        const newImage = document.createElement('img');
        const newTitle = document.createElement('h5');
        const newP = document.createElement('p');
        const newGenresList = document.createElement('ul');

        newImage.src = film.poster;
        newTitle.textContent = film.title;
        if (film.overview.length > 50) {
            newP.textContent = film.overview.slice(0, 60) + '...';
        }

        film.genres.forEach(function(genre, index) {
            const newGenresItem = document.createElement('li');

            if (index === film.genres.length - 1) {
                newGenresItem.classList.add('bookmark');
                newGenresItem.dataset.bookmarkBtnId = film.release_date;
            }

            newGenresItem.textContent = genre;
            newGenresList.appendChild(newGenresItem);
        });

        newItem.appendChild(newImage);
        newItem.appendChild(newTitle);
        newItem.appendChild(newP);
        newItem.appendChild(newGenresList);
        htmlElement.appendChild(newItem);
    });
}

// Janr va film ro'yxatini dastlabki ko'rsatish
renderGenresList(films);
renderMoviesList(films, elList);
