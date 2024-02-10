const storeInSession = (key, value) => {
  return  sessionStorage.setItem(key,value);
};

const lookUpSession = (key) => {
    return sessionStorage.getItem(key);
}

const deleteSession = (key) => {
    return sessionStorage.removeItem(key);
}

const clearSession = () => {
    return sessionStorage.clear();
}

export {storeInSession, lookUpSession, deleteSession, clearSession};
