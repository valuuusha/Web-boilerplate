import { randomUserMock } from './FE4U-Lab2-mock.js';
import { additionalUsers } from './FE4U-Lab2-mock.js';
import fs from 'fs';
import path from 'path';

function formatUsers(user) {
  return {
    gender: user.gender,
    title: user.name.title,
    full_name: `${user.name.first} ${user.name.last}`,
    city: user.location.city,
    state: user.location.state,
    country: user.location.country,
    postcode: user.location.postcode,
    coordinates: {
      Latitude: user.location.coordinates.latitude,
      Longitude: user.location.coordinates.longitude
    },
    timezone: user.location.timezone,
    email: user.email,
    b_date: user.dob.date,
    age: user.dob.age,
    phone: user.phone,
    picture_large: user.picture.large,
    picture_thumbnail: user.picture.thumbnail
  };
}

const formattedUsers = randomUserMock.map(formatUsers);

function addFields(user) {
  return {
    ...user,
    id: user.id || generateRandomId(),
    favorite: false,
    course: getRandomCourse(),
    bg_color: getRandomColor(), 
    note: "Notes..."
  };
}

function generateRandomId() {
  const prefix = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  const numbers = Math.floor(1000000 + Math.random() * 90000000).toString(); 
  return `${prefix}${numbers}`;
}


function getRandomCourse() {
  const courses = [
    'Mathematics', 'Physics', 'English', 'Computer Science', 'Dancing',
    'Chess', 'Biology', 'Chemistry', 'Law', 'Art', 'Medicine', 'Statistics'
  ];
  return courses[Math.floor(Math.random() * courses.length)];
}

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

const finalUsers = formattedUsers.map(addFields);

function mergeUsers(formattedUsers, additionalUsers) {
  const mergedUsers = [...formattedUsers];

  additionalUsers.forEach(addUser => {

    const exists = mergedUsers.some(user => 
      user.full_name === addUser.full_name && user.email === addUser.email
    );
    
    if (!exists) {
      mergedUsers.push(addUser);
    }
  });

  return mergedUsers;
}

const allUsers = mergeUsers(finalUsers, additionalUsers);

function writeToFile(fileName, data) {

  const jsonData = JSON.stringify(data, null, 2);
  
  fs.writeFile(fileName, jsonData, 'utf8', (err) => {
    if (err) {
      console.error('', err);
      return;
    }
    console.log('');
  });
}
const filePath = path.join('src','results','mergedUsers.json');

writeToFile(filePath, allUsers);
