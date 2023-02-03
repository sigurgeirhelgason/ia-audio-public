import axios from 'axios';
import { BASE_URL } from '../constants/api';

// Create user
export async function createUser(username, password) {
  const url = `${BASE_URL}user/create/`;
  const params = JSON.stringify({
    username: username,
    password: password,
  });
  const response = await axios.post(url, params, {
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
  });

  const token = response.data.user.token.access;
  return token;
}

// Login user
export async function login(username, password) {
  const url = `${BASE_URL}user/login/`;
  const params = JSON.stringify({
    username: username,
    password: password,
  });
  const response = await axios.post(url, params, {
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
  });

  const token = response.data.access;
  return token;
}
