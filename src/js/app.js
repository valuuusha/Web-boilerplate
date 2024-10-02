import { validUsers as teachers } from '/validUsers.js'; 

document.addEventListener('DOMContentLoaded', () => {
    loadFavorites(); 
    renderTeachers();
    renderFavorites();
});

function renderTeachers() {
    const teacherContainer = document.querySelector('.teachers');

    teachers.slice(0, 10).forEach(teacher => {
        const teacherCard = document.createElement('article');
        teacherCard.classList.add('teacher-card');

        teacherCard.innerHTML = `
        <img src="${teacher.picture_large}" alt="${teacher.full_name}" />
        <h3>${teacher.full_name}</h3>
        <h4>${teacher.course}</h4>
        <h5>${teacher.country}</h5>
        `;

        teacherCard.addEventListener('click', function() {
            showTeacherInfo(teacher);
        });

        teacherContainer.appendChild(teacherCard);
    });
}

function renderFavorites() {
    const favoritesContainer = document.querySelector('.favourites .teachers');

    teachers
        .filter(teacher => teacher.favorite === true)
        .slice(0, 5).forEach(teacher => {
            const favoriteCard = document.createElement('article');
            favoriteCard.classList.add('teacher-card');

            favoriteCard.innerHTML = `
                <img src="${teacher.picture_large}" alt="${teacher.full_name}" />
                <h3>${teacher.full_name}</h3>
                <h5>${teacher.country}</h5>
            `;

            favoritesContainer.appendChild(favoriteCard);

            favoriteCard.addEventListener('click', function() {
                showTeacherInfo(teacher);
            });
        });
}

function showTeacherInfo(teacher) {
    const popup = document.getElementById('teacher-popup');

    document.getElementById("popup-picture").src = teacher.picture_large;
    document.getElementById("popup-name").textContent = teacher.full_name;
    document.getElementById("popup-course").textContent = teacher.course;
    document.getElementById("popup-city-country").textContent = `${teacher.city}, ${teacher.country}`;
    document.getElementById("popup-age-gender").textContent = `${teacher.age}, ${teacher.gender}`;
    document.getElementById("popup-email").textContent = teacher.email; 
    document.getElementById("popup-phone").textContent = teacher.phone; 
    document.getElementById("popup-bio").textContent = teacher.note;

    const favoriteStar = document.getElementById('popup-favorite');
    favoriteStar.classList.toggle("full", teacher.favorite);

    favoriteStar.onclick = () => {
        favoriteStar.classList.toggle("full");
        teacher.favorite = favoriteStar.classList.contains("full");
        updateFavorites(); 
    };

    popup.style.display = 'flex';
}
function updateFavorites() {
    localStorage.setItem('teachers', JSON.stringify(teachers));
}

function loadFavorites() {
    const storedTeachers = localStorage.getItem('teachers');
    if (storedTeachers) {
        const parsedTeachers = JSON.parse(storedTeachers);
        parsedTeachers.forEach((storedTeacher) => {
            const teacher = teachers.find(t => t.id === storedTeacher.id);
            if (teacher) {
                teacher.favorite = storedTeacher.favorite;
            }
        });
    }
}


document.getElementById('close-popup').addEventListener('click', function() {
    document.getElementById('teacher-popup').style.display = 'none';
});
