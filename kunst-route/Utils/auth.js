const USERS_KEY = 'kunstroute_users';
const CURRENT_USER_KEY = 'kunstroute_current_user';

export const SEED_USERS = [
  {
    email: 'emma.vandijk@kunstroute.nl',
    password: 'Kunst123!',
    voornaam: 'Emma',
    achternaam: 'van Dijk',
    telefoon: '0612345678',
    kunstrichting: 'Schilderijen',
    bio: 'Ik schilder landschappen en portretten op de Veluwe.',
    website: 'www.emmavandijk.nl',
    facebook: 'facebook.com/emmavandijk',
    instagram: '@emma_kunst',
    adres: 'Dorpsstraat 12',
    postcode: '3851 AB',
    woonplaats: 'Ermelo',
  },
  {
    email: 'pieter.jansen@schilderkunst.nl',
    password: 'Veluwe456!',
    voornaam: 'Pieter',
    achternaam: 'Jansen',
    telefoon: '0687654321',
    kunstrichting: 'Aquarellen',
    bio: 'Aquarellist met een passie voor de Veluwse natuur.',
    website: '',
    facebook: 'facebook.com/pieterjansen',
    instagram: '@pieter_aquarel',
    adres: 'Bosweg 5',
    postcode: '3880 AA',
    woonplaats: 'Putten',
  },
  {
    email: 'lisa.deboer@beeldhouwkunst.nl',
    password: 'Route789!',
    voornaam: 'Lisa',
    achternaam: 'de Boer',
    telefoon: '0698765432',
    kunstrichting: 'Beeldhouwen',
    bio: 'Beeldhouwster die werkt met hout en steen.',
    website: 'www.lisadeboer.com',
    facebook: '',
    instagram: '@lisa_sculptuur',
    adres: 'Kunstlaan 8',
    postcode: '3881 BC',
    woonplaats: 'Harderwijk',
  },
];

export function initUsers() {
  if (!localStorage.getItem(USERS_KEY)) {
    localStorage.setItem(USERS_KEY, JSON.stringify(SEED_USERS));
  }
}

export function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
}

export function getUserByEmail(email) {
  return getUsers().find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
}

export function emailExists(email) {
  return !!getUserByEmail(email);
}

export function login(email, password) {
  const user = getUserByEmail(email);
  if (!user) return { success: false, error: 'Geen account gevonden met dit e-mailadres.' };
  if (user.password !== password) return { success: false, error: 'Onjuist wachtwoord. Probeer het opnieuw.' };
  localStorage.setItem(CURRENT_USER_KEY, user.email);
  return { success: true };
}

export function register(userData) {
  const users = getUsers();
  if (emailExists(userData.email)) {
    return { success: false, error: 'Er bestaat al een account met dit e-mailadres.' };
  }
  users.push(userData);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  localStorage.setItem(CURRENT_USER_KEY, userData.email);
  return { success: true };
}

export function getCurrentUser() {
  const email = localStorage.getItem(CURRENT_USER_KEY);
  if (!email) return null;
  return getUserByEmail(email);
}

export function updateCurrentUser(updatedData) {
  const email = localStorage.getItem(CURRENT_USER_KEY);
  if (!email) return { success: false, error: 'Niet ingelogd.' };
  const users = getUsers();
  const idx = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
  if (idx === -1) return { success: false, error: 'Gebruiker niet gevonden.' };
  users[idx] = { ...users[idx], ...updatedData };
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return { success: true };
}

export function logout() {
  localStorage.removeItem(CURRENT_USER_KEY);
}

export function getSeedUsers() {
  return SEED_USERS;
}