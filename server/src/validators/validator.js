import pool from '../db/config';
import emailChecker from './emailChecker';

class Validator {
  static customValidateEmail(email) {
    return emailChecker.verifyEmail(email.toString().trim());
  }

  // static regxValidateEmail(email) {
  //   const re = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/ig;
  //   return re.test(email.trim().toLowerCase());
  // }

  static isPasswordTooShort(password) {
    return password.toString().trim().length < 6;
  }

  static isMatchingPasswords(password, confirmPassword) {
    return password.toString().trim() === confirmPassword.toString().trim();
  }

  static isValidName(name) {
    return name.toString().trim().length >= 2;
  }

  static isValidPhoneNumber(phoneNumber) {
    const number = phoneNumber.toString().trim();
    const arr = number.split('');
    if (arr.length > 15) return false;
    for (let i = 0; i < arr.length; i += 1) {
      if (Number.isNaN(Number(arr[i])) && arr[i] !== ' ' && arr[i] !== '+' && arr[i] !== '-') {
        return false;
      }
    }
    return true;
  }

  static isValidCoordinates(location) {
    if(location) {
      location = location.toString().trim();
    }
    const arr = location.split(',');
    const [lat, lng] = arr;
    
    if(arr.length !== 2) return false;
    if(Number.isNaN(Number(lat)) || Number.isNaN(Number(lng))) return false;
    if(Number(lat) < -90 || Number(lat) > 90) return false;
    if(Number(lng) < -180 || Number(lng) > 180) return false;

    return true;
  }

  static isValidComment(comment) {
    let arr = comment.toString().trim().split(' ');
    let arrOfActualWords = [];
    for (let i = 0; i < arr.length; i++){
      arr[i] = arr[i].toString().trim();
      if(arr[i] !== '') {
        arrOfActualWords.push(arr[i]);
      }
    }
    return arrOfActualWords.length > 2;
  }
}// END Validator

export default Validator;
