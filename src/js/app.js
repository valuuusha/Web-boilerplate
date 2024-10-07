import { validUsers as teachers} from './validUsers.js';
import { addFields} from './format-data.js';



const filterForm = document.getElementById("filters");
const teacherContainer = document.getElementById('teacher-grid');
const favoritesContainer = document.querySelector('.favourites .teachers');
const popup = document.getElementById('teacher-popup');


function renderTeachers(teachers) {
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

        teacherCard.addEventListener('click', function() {
            showTeacherInfo(teacher);
        });

        teacherContainer.appendChild(teacherCard);
    });
}

function renderFavorites() {
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

            favoriteCard.addEventListener('click', function() {
                showTeacherInfo(teacher);
            });

            favoritesContainer.appendChild(favoriteCard);
        });
}


function showTeacherInfo(teacher) {

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
        renderFavorites();
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

filterForm.addEventListener("change", function() {
    const country = document.getElementById("filter-country").value;
    const ageRange = document.getElementById("filter-age").value;
    const gender = document.getElementById("filter-gender").value;
    const favoritesOnly = document.getElementById("filter-favorite").checked;

    const filteredTeachers = teachers.filter(teacher => {
        const countryMatch = !country || teacher.country === country;

        let ageMatch = true;
        if (ageRange) {
            const [minAge, maxAge] = ageRange.split('-').map(Number);
            ageMatch = teacher.age >= minAge && teacher.age <= maxAge;
        }

        const genderMatch = !gender || teacher.gender === gender;
        const favoritesMatch = !favoritesOnly || teacher.favorite;

        return countryMatch && ageMatch && genderMatch && favoritesMatch;
    });

    renderTeachers(filteredTeachers);
});

loadFavorites(); 
renderTeachers(teachers);
renderFavorites();

//  TABLE & SORTING

document.addEventListener('DOMContentLoaded', function() {
    searchInput.value = '';

    const tableBody = document.getElementById('tbody');
    const tableNavigation = document.getElementById('table-nav');
    const itemsPerPage = 10;
    let currentPage = 1;

    function waitForData() {

        if (teachers.length > 0) {
            
            renderTableData(teachers);
        } else {
            setTimeout(waitForData, 1000);
        }
    }
    waitForData();

    function renderTableData(data) {
        tableBody.innerHTML = ''; 

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const currentData = data.slice(startIndex, endIndex);

        currentData.forEach((teacher) => {

            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${teacher.full_name}</td>
                <td>${teacher.course}</td>
                <td>${teacher.age}</td>
                <td>${teacher.gender}</td>
                <td>${teacher.country}</td>
            `;

            tableBody.appendChild(newRow);
        });

        renderNav(data.length);
    }

    function renderNav(itemsInTotal) {

        const pagesInTotal = Math.ceil(itemsInTotal / itemsPerPage);
        const maxPages = 2; 
        tableNavigation.innerHTML = '';
    
        const createDots = () => {

            const dots = document.createElement('span');
            dots.textContent = '...';
            dots.classList.add('dots');
            return dots;
        };
    
        const createNavButtons = (pageNum, label = null) => {
            const pageButton = document.createElement('button');
            pageButton.textContent = label ? label : pageNum;
            pageButton.classList.add('page-button');
    
            if (pageNum === currentPage) {
                pageButton.classList.add('active');
            }
    
            pageButton.addEventListener('click', () => {
                currentPage = pageNum;
                renderTableData(teachers);
            });
    
            return pageButton;
        };
    
        let startPage = Math.max(1, currentPage - Math.floor(maxPages / 2));
        let endPage = Math.min(pagesInTotal, currentPage + Math.floor(maxPages / 2));
    

        if (currentPage <= Math.floor(maxPages / 2)) {
            
            endPage = Math.min(pagesInTotal, maxPages);

        } else if (currentPage + Math.floor(maxPages / 2) >= pagesInTotal) {

            startPage = Math.max(1, pagesInTotal - maxPages + 1);
        }
    
        if (startPage > 1) {

            tableNavigation.appendChild(createNavButtons(1));
            if (startPage > 2) {

                tableNavigation.appendChild(createDots());
            }
        }
    
        for (let i = startPage; i <= endPage; i++) {

            const pageButton = createNavButtons(i);
            tableNavigation.appendChild(pageButton);
        }
    
        if (endPage < pagesInTotal) {

            if (endPage < pagesInTotal - 1) {
                tableNavigation.appendChild(createDots());
            }
            tableNavigation.appendChild(createNavButtons(pagesInTotal, 'Last'));
        }
    }
    

    function sortTable(column, type = 'string', direction = 'asc') {

        const sortedData = [...teachers].sort((a, b) => {
            let valueA = getColumnValue(a, column);
            let valueB = getColumnValue(b, column);

            if (type === 'number') {
                valueA = parseInt(valueA);
                valueB = parseInt(valueB);
            }

            return direction === 'asc' ? (valueA > valueB ? 1 : -1) : (valueA < valueB ? 1 : -1);
        });

        currentPage = 1; 
        renderTableData(sortedData);
    }

    function getColumnValue(teacher, column) {

        switch (column) {
            case 0:
                return teacher.full_name;

            case 1:
                return teacher.course; 

            case 2:
                return teacher.age;

            case 3:  
                return teacher.country;

            default:
                return '';
        }
    }

    const sortDirection = {
        name: 'asc',
        course: 'asc',
        age: 'asc',
        country: 'asc'
    };

    document.getElementById('sort-fullname').addEventListener('click', () => sortTable(0, 'string', switchSort('name')));
    document.getElementById('sort-spec').addEventListener('click', () => sortTable(1, 'string', switchSort('course')));
    document.getElementById('sort-age').addEventListener('click', () => sortTable(2, 'number', switchSort('age')));
    document.getElementById('sort-nat').addEventListener('click', () => sortTable(3, 'string', switchSort('country')));

    function switchSort(column) {
        sortDirection[column] = sortDirection[column] === 'asc' ? 'desc' : 'asc';

        return sortDirection[column];
    }
});

// SEARCH

const searchInput = document.querySelector('.search-input');
const searchButton = document.querySelector('.search');

searchButton.addEventListener('click', (event) => {
    event.preventDefault();
    const searchValue = searchInput.value.toLowerCase(); 
    const matchedTeachers = findMatchesByValue(teachers, searchValue); 

    renderTeachers(matchedTeachers);
});

function findMatchesByValue(teachers, searchValue) {
    return teachers.filter(teacher => {
        const nameMatch = teacher.full_name.toLowerCase().includes(searchValue);
        const noteMatch = teacher.note.toLowerCase().includes(searchValue);
        const ageMatch = String(teacher.age).includes(searchValue);

        return nameMatch || noteMatch || ageMatch;
    });
}

// ADDING NEW TEACHERS

const openPopupButton = document.getElementById('open-teach-add-popup');
const closePopupButton = document.getElementById('close-add-popup');
const popupAdd = document.getElementById('teach-add-popup');
const form = document.getElementById('addteacher-form');
import { validateUser } from './validate-data.js';

openPopupButton.addEventListener('click', () => {
    popupAdd.style.display = 'block';
});


closePopupButton.addEventListener('click', (event) => {
    event.preventDefault();
    popupAdd.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === popupAdd) {
        popupAdd.style.display = 'none';
    }
});


form.addEventListener('submit', (event) => {
    event.preventDefault();

    function calculateAge(birthdate) {
        const today = new Date();
        const birthDate = new Date(birthdate);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    const name = document.getElementById('name').value;
    const speciality = document.getElementById('speciality').value;
    const country = document.getElementById('country').value;
    const city = document.getElementById('city').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const birthdate = document.getElementById('birthdate').value;
    const sex = document.querySelector('input[name="sex"]:checked')?.id;
    const bgcolor = document.getElementById('bgcolor').value;
    const notes = document.getElementById('notes').value;
    const age = calculateAge(birthdate);

    const newTeacher = {
        full_name: name,
        course: speciality,
        country: country,
        city: city,
        email: email,
        phone: phone,
        b_date: birthdate,
        gender: sex,
        bg_color: bgcolor,
        note: notes,
        age: age  
    };

    if (validateUser(newTeacher)) {
        addFields(newTeacher);

        teachers.push(newTeacher);

        form.reset();
        popupAdd.style.display = 'none';

        renderTeachers(teachers);
        console.log(newTeacher);

    } else {
        alert("Error: check your input data");
    }
});



