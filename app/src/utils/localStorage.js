// LocalStorage Helper Utilities
// Provides safe and convenient methods for localStorage operations

/**
 * Save data to localStorage
 * @param {string} key - Storage key
 * @param {any} data - Data to store (will be JSON stringified)
 * @returns {boolean} Success status
 */
export const saveData = (key, data) => {
  try {
    const jsonData = JSON.stringify(data)
    localStorage.setItem(key, jsonData)
    return true
  } catch (e) {
    console.error(`Error saving data to localStorage (key: ${key}):`, e)
    return false
  }
}

/**
 * Get data from localStorage
 * @param {string} key - Storage key
 * @param {any} defaultValue - Default value if key doesn't exist
 * @returns {any} Parsed data or defaultValue
 */
export const getData = (key, defaultValue = null) => {
  try {
    const jsonData = localStorage.getItem(key)
    if (jsonData === null) return defaultValue
    
    return JSON.parse(jsonData)
  } catch (e) {
    console.error(`Error getting data from localStorage (key: ${key}):`, e)
    return defaultValue
  }
}

/**
 * Update data in localStorage using an updater function
 * @param {string} key - Storage key
 * @param {Function} updater - Function that receives current data and returns new data
 * @param {any} defaultValue - Default value if key doesn't exist
 * @returns {boolean} Success status
 */
export const updateData = (key, updater, defaultValue = null) => {
  try {
    const currentData = getData(key, defaultValue)
    const newData = updater(currentData)
    return saveData(key, newData)
  } catch (e) {
    console.error(`Error updating data in localStorage (key: ${key}):`, e)
    return false
  }
}

/**
 * Delete data from localStorage
 * @param {string} key - Storage key
 */
export const deleteData = (key) => {
  try {
    localStorage.removeItem(key)
    return true
  } catch (e) {
    console.error(`Error deleting data from localStorage (key: ${key}):`, e)
    return false
  }
}

/**
 * Clear all localStorage data
 */
export const clearAll = () => {
  try {
    localStorage.clear()
    return true
  } catch (e) {
    console.error('Error clearing localStorage:', e)
    return false
  }
}

/**
 * Check if key exists in localStorage
 * @param {string} key - Storage key
 * @returns {boolean}
 */
export const hasKey = (key) => {
  return localStorage.getItem(key) !== null
}

/**
 * Get all keys from localStorage
 * @returns {string[]} Array of all keys
 */
export const getAllKeys = () => {
  const keys = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key) keys.push(key)
  }
  return keys
}
