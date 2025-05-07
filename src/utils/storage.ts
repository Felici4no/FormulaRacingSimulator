import { LapRecord, RacingData, User } from '../types';

const STORAGE_KEY = 'racingData';

// Carrega dados do localStorage ao iniciar
const loadFromStorage = (): RacingData => {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    return storedData ? JSON.parse(storedData) : { users: [], laps: [] };
  } catch (error) {
    console.error('Error loading data:', error);
    return { users: [], laps: [] };
  }
};

// Salva dados no localStorage
const saveToStorage = (data: RacingData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving data:', error);
  }
};

let racingData: RacingData = loadFromStorage();

// Get data from storage
export const getData = (): RacingData => {
  return racingData;
};

// Save data to storage
export const saveData = (data: RacingData): void => {
  racingData = data;
  saveToStorage(data);
};

// Save a new user
export const saveUser = (user: User): void => {
  const data = getData();
  data.users.push(user);
  saveData(data);
};

// Save a new lap record
export const saveLap = (lap: LapRecord): void => {
  const data = getData();
  data.laps.push(lap);
  saveData(data);
};

// Get ranked lap times (only completed laps, sorted by time)
export const getRankedLaps = (): LapRecord[] => {
  const data = getData();
  return data.laps
    .filter(lap => lap.completed)
    .sort((a, b) => a.time - b.time);
};

// Generate a simple user ID
export const generateUserId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
};