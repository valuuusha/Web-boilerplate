import { addFields, formatUsers} from './format-data.js';

const filterForm = document.getElementById("filters");
const teacherContainer = document.getElementById('teacher-grid');
const favoritesContainer = document.querySelector('.favourites .teachers');
const popup = document.getElementById('teacher-popup');
const apiLink = 'https://randomuser.me/api/?results=55';
const apiLinkMore = 'https://randomuser.me/api/?results=13';
const apiLinkOne = 'https://randomuser.me/api/?results=1';
const popupMapDiv = document.getElementById('popup-map');
const toggleMapButton = document.getElementById('toggle-map');
const tableBody = document.getElementById('tbody');
const tableNavigation = document.getElementById('table-nav');
const addButton = document.getElementById('add-button');
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

    let mapVisible = false;
    let map; 

    if (popupMapDiv._leaflet_id) {
        popupMapDiv._leaflet_id = null;
    }
    if (map) {
        map.remove();
        map = null;
    }

    toggleMapButton.onclick = (event) => {
        event.preventDefault();
        
        let latitude = teacher.coordinates.Latitude;
        let longitude = teacher.coordinates.Longitude;

        if (mapVisible) {
            popupMapDiv.style.display = 'none';
            mapVisible = false;
            if (map) {
                map.remove();
            }
        } else {
            popupMapDiv.style.display = 'block';
            map = L.map(popupMapDiv).setView([latitude, longitude], 10);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            L.marker([latitude, longitude]).addTo(map)
                .bindPopup(teacher.full_name)
                .openPopup();

            popupMapDiv.style.display = 'block';
            mapVisible = true;
        }
    };

    const closePopupButton = document.getElementById('close-popup');
    closePopupButton.onclick = () => {
        popup.style.display = 'none';
        if (map) {
            map.remove();
        }
        popupMapDiv.style.display = 'none';
        mapVisible = false;
    };
}




document.getElementById('close-popup').addEventListener('click', function() {
    popup.style.display = 'none';
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
// PIECHART STATISTICS

const checkDataReady = setInterval(() => {
    if (apiTeachers && apiTeachers.length > 0) {
        clearInterval(checkDataReady);
        setupPieCharts(); 
    }
}, 10);


let ageChart, genderChart, specialityChart, nationalityChart;

const setupPieCharts = () => {

    if (ageChart) ageChart.destroy();
    if (genderChart) genderChart.destroy();
    if (specialityChart) specialityChart.destroy();
    if (nationalityChart) nationalityChart.destroy();

    const ageData = preparePieData('age');
    const genderData = preparePieData('gender');
    const courseData = preparePieData('speciality');
    const countryData = preparePieData('nationality');

    const ageCtx = document.getElementById('ageChart').getContext('2d');
    ageChart = createChart(ageCtx, ageData.chartLabels, ageData.chartData, 'Age');

    const genderCtx = document.getElementById('genderChart').getContext('2d');
    genderChart = createChart(genderCtx, genderData.chartLabels, genderData.chartData, 'Gender');

    const specialityCtx = document.getElementById('specialityChart').getContext('2d');
    specialityChart = createChart(specialityCtx, courseData.chartLabels, courseData.chartData, 'Speciality');

    const nationalityCtx = document.getElementById('nationalityChart').getContext('2d');
    nationalityChart = createChart(nationalityCtx, countryData.chartLabels, countryData.chartData, 'Nationality');
};

const createChart = (chartCtx, chartLabels, chartData, title) => {
    const data = {
        labels: chartLabels,
        datasets: [{
            label: title,
            data: chartData,
            backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)',
                'rgba(255, 205, 86, 0.6)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 205, 86, 1)'
            ],
            borderWidth: 1
        }]
    };

    const config = {
        type: 'pie',
        data: data,
        options: {
            responsive: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        font: {
                            size: 14
                        }
                    }
                },
                title: {
                    display: true,
                    text: title,
                    font: {
                        size: 18,
                        weight: 'bold'
                    },
                    padding: {
                        top: 10,
                        bottom: 20
                    }
                },
                tooltip: {
                    callbacks: {
                        label: (context) => {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${label}: ${value} (${percentage}%)`;
                        },
                    },
                    bodyFont: {
                        size: 14
                    }
                }
            }
        }
    };

    return new Chart(chartCtx, config);
};

const preparePieData = (column) => {
    const chartLabels = [];
    const chartData = [];
    const categoryCount = {};

    apiTeachers.forEach(teacher => {
        let value;
        switch (column) {
            case 'speciality':
                value = teacher.course;
                break;
            case 'age':
                value = getAgeGroup(teacher.age);;
                break;
            case 'gender':
                value = teacher.gender;
                break;
            case 'nationality':
                value = teacher.country;
                break;
        }

        categoryCount[value] = (categoryCount[value] || 0) + 1;
    });

    for (const [key, count] of Object.entries(categoryCount)) {
        chartLabels.push(key);
        chartData.push(count);
    }

    return { chartLabels, chartData };
};

const getAgeGroup = (age) => {
    if (age >= 18 && age <= 25) {
        return '18-25';
    } else if (age >= 26 && age <= 35) {
        return '26-35';
    } else if (age >= 36 && age <= 45) {
        return '36-45';
    } else if (age >= 46 && age <= 65) {
        return '46-65';
    } else {
        return '65+';
    }
};

const tableContainer = document.getElementById('statictics-table');
const chartContainer = document.getElementById('piechart');

document.addEventListener('keydown', (event) => {
    if (event.key === "Tab") { 
        event.preventDefault();
        const tableDisplay = window.getComputedStyle(tableContainer).display;

        if (tableDisplay === 'table' || tableDisplay === '') { 
            tableContainer.style.display = 'none';
            chartContainer.style.display = 'flex';
            tableNavigation.style.display = 'none';
        } else {
            tableContainer.style.display = 'table'; 
            chartContainer.style.display = 'none';
            tableNavigation.style.display = 'flex';
        }
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

const handleSubmit = (event) => {
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
        age: age,
        coordinates: {
            latitude: 50.4501,  
            longitude: 30.5234,
        },
        favorite: false,  
        picture_large: "./images/default_user_picture.jpg",
    };

    if (validateUser(newTeacher)) {
        fetch('http://localhost:3000/teachers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newTeacher)
        })
        .then(async response => {
            if (!response.ok) {
                const error = await response.json();
                console.error('Error details:', error);
                throw new Error('Failed to add teacher');
            }
            return response.json();
        })
        .then(data => {
            console.log('Teacher added:', data);
            apiTeachers.push(data);
            renderTeachers(apiTeachers);
            form.reset();

            setupPieCharts();
            popupAdd.style.display = 'none';
        })
        .catch(error => console.error('Error adding teacher:', error));
    } else {
        alert("Error: check your input data");
    }
}

addButton.addEventListener('click', handleSubmit);

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
        setupPieCharts();
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
