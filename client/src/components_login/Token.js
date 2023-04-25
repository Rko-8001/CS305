// User Token
export const getUserToken = () => {
  return sessionStorage.getItem("userToken") || null;
};

export const removeUserToken = () => {
  sessionStorage.removeItem("userToken");
};

export const setUserToken = (userToken) => {
  sessionStorage.setItem("userToken", userToken);
};


// Role Token 
export const setRoleToken = (roleToken) => {
  sessionStorage.setItem("roleToken", roleToken);
};

export const getRoleToken = () => {
  return sessionStorage.getItem("roleToken") || null;
};

export const removeRoleToken = () => {
  sessionStorage.removeItem("roleToken");
};

