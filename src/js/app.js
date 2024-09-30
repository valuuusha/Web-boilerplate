

import { validUsers as teachers} from './validate-data.js'; 

function renderTeachers() {
    const teacherContainer = document.querySelector('.teachers');
    teacherContainer.innerHTML = '';

    teachers.slice(0, 10).forEach(teacher => {
        const teacherCard = document.createElement('article');
        teacherCard.classList.add('teacher-card');

        teacherCard.innerHTML = `
        <img src="${teacher.picture_large}" alt="${teacher.full_name}" />
        <h3>${teacher.full_name}</h3>
        <h4>${teacher.course}</h4>
        <h5>${teacher.country}</h5>
        `;


        teacherContainer.appendChild(teacherCard);
    });
}

function renderFavorites() {
    const favoritesContainer = document.querySelector('.favourites .teachers');
    favoritesContainer.innerHTML = '';

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
        });
}

document.addEventListener('DOMContentLoaded', () => {
    renderTeachers();
    renderFavorites();
});
