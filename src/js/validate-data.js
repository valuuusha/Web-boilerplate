import { allUsers } from './format-data.js';
// import { isValidNumber } from 'libphonenumber-js';
// import countries from 'i18n-iso-countries';
// import enLocale from 'i18n-iso-countries/langs/en.json' assert { type: 'json' };

function validateStringField(field) {
    return typeof field === 'string' && field[0] === field[0].toUpperCase();
}

function validateFullName(fullName) {
    const fullNameRegex = /^[A-Z][a-z]+ [A-Z][a-z]+$/;
    return typeof fullName === 'string' && fullNameRegex.test(fullName);
}

function validateGender(gender) {
    const validGenders = ['male', 'female'];
    return validGenders.includes(gender.toLocaleLowerCase());
}

function validateAgeField(age) {
    return typeof age === 'number' && age > 0 && age <= 100;
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// countries.registerLocale(enLocale);

// function getCountryCodeByName(countryName) {
//     return countries.getAlpha2Code(countryName, 'en');
// }

// function validatePhoneNum(phoneNum, country) {
//     const countryCode = getCountryCodeByName(country);

//     if (!countryCode) {
//         return false;
//     }

//     return isValidNumber(phoneNum, countryCode);
// }

function validateNoteField(note) {
    if (note === null) {
        return true;
    }
    return typeof note === 'string' && /^[A-Z][a-zA-Z\s.,!?'"()-]*$/.test(note);
}


export function validateUser(user) {
    let isValid = true;

    isValid &&= validateFullName(user.full_name);
    isValid &&= validateGender(user.gender);
    isValid &&= validateStringField(user.state);
    isValid &&= validateStringField(user.city);
    isValid &&= validateStringField(user.country);
    isValid &&= validateAgeField(user.age);
    // isValid &&= validatePhoneNum(user.phone, user.country);
    isValid &&= validateEmail(user.email);
    isValid &&= validateNoteField(user.note);

    return isValid;
}

const validationResults = allUsers.map(user => ({
    user,
    isValid: validateUser(user),
}));

export const validUsers = allUsers.filter(user => validateUser(user));

console.log(validationResults);
// console.log(validUsers);