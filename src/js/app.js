import { validate } from 'webpack';
import { addFields, formatUsers} from './format-data.js';

const filterForm = document.getElementById("filters");
const teacherContainer = document.getElementById('teacher-grid');
const favoritesContainer = document.querySelector('.favourites .teachers');
const popup = document.getElementById('teacher-popup');
const apiLink = 'https://randomuser.me/api/?results=55';
const apiLinkMore = 'https://randomuser.me/api/?results=13';
const apiLinkOne = 'https://randomuser.me/api/?results=1';
let displayUsers = 10;


function renderTeachers(teachers) {
    teacherContainer.innerHTML = ''; 

    teachers.slice(0, displayUsers).forEach(teacher => { 
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

function renderFavorites(teachers) {
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

        renderFavorites(apiTeachers);
    };

    popup.style.display = 'flex';
}


document.getElementById('close-popup').addEventListener('click', function() {
    document.getElementById('teacher-popup').style.display = 'none';
});

filterForm.addEventListener("change", function() {
    const country = document.getElementById("filter-country").value;
    const ageRange = document.getElementById("filter-age").value;
    const gender = document.getElementById("filter-gender").value;
    const favoritesOnly = document.getElementById("filter-favorite").checked;

    const filteredTeachers = apiTeachers.filter(teacher => {
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


//  TABLE & SORTING

document.addEventListener('DOMContentLoaded', function() {
    searchInput.value = '';

    const tableBody = document.getElementById('tbody');
    const tableNavigation = document.getElementById('table-nav');
    const itemsPerPage = 10;
    let currentPage = 1;

    function waitForData() {

        if (apiTeachers.length > 0) {
            
            renderTableData(apiTeachers);
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
                renderTableData(apiTeachers);
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

        const sortedData = [...apiTeachers].sort((a, b) => {
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
    const matchedTeachers = findMatchesByValue(apiTeachers, searchValue); 

    renderTeachers(matchedTeachers);
});

function findMatchesByValue(apiTeachers, searchValue) {
    return apiTeachers.filter(teacher => {
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

if (openPopupButton && closePopupButton && popupAdd) {
    openPopupButton.addEventListener('click', () => {
        popupAdd.style.display = 'block';
    });

    closePopupButton.addEventListener('click', (event) => {
        event.preventDefault();
        popupAdd.style.display = 'none';
    });
}

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
        fetch('http://localhost:3000/teachers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newTeacher)
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(error => {
                    console.error('Error details:', error);
                    throw new Error('Failed to add teacher');
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Teacher added:', data);
            apiTeachers.push(data);
            renderTeachers(apiTeachers);

            form.reset();
            popupAdd.style.display = 'none';
        })
        .catch(error => console.error('Error adding teacher:', error));
    } else {
        alert("Error: check your input data");
    }
});

// FETCH API TEACHERS
export let apiTeachers = [];

fetch(apiLink)
    .then(response => response.json())
    .then(data => {
        apiTeachers = data.results
        .map(formatUsers)
        .map(addFields)
        .filter(validateUser);

    fetchLocalTeachers();
    })
    .catch(error => console.error('Error fetching users:', error));
    

// SHOW MORE TEACHERS BUTTON 

const showMoreButton = document.getElementById("show-more");

function fetchMoreUsers() {
    return fetch(apiLinkMore)
        .then(response => response.json())
        .then(async data => {
            let newUsers = data.results
                .map(formatUsers)
                .map(addFields)
                .filter(validateUser);

            apiTeachers = [...apiTeachers, ...newUsers];
            return newUsers;
        })
        .catch(error => {
            console.error('Error fetching users:', error);
            return [];
        });
}

showMoreButton.addEventListener('click', async () => {
    if (displayUsers >= apiTeachers.length) {

        const newUsers = await fetchMoreUsers();
        renderTeachers(apiTeachers);
        renderFavorites(apiTeachers);
        displayUsers += newUsers.length;
    } else {
        
        displayUsers += 10;
        renderTeachers(apiTeachers.slice(0, displayUsers));
        renderFavorites(apiTeachers.slice(0, displayUsers));
    }
});

function fetchLocalTeachers() {
    return fetch('/db.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            if (!data.teachers || !Array.isArray(data.teachers)) {
                throw new Error('Invalid structure of db.json');
            }

            apiTeachers = [...apiTeachers, ...data.teachers];
            renderTeachers(apiTeachers);
            renderFavorites(apiTeachers);
        })
        .catch(error => console.error('Error fetching the JSON:', error));
}
