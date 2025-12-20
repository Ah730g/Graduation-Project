import { createContext, useState, useContext } from 'react';

const userContext = createContext({
  user: null,
  setUser: () => {},
  token: null,
  setToken: () => {},
  message: null,
  setMessage: () => {},
  messageStatus: null,
  setMessageStatus: () => {},
  isAdmin: () => false,
});

export default function UserContextProvider({ children }) {
  const [user, _setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [token, _setToken] = useState(localStorage.getItem('ACCESS_TOKEN'));
  const [message, _setMessage] = useState(null);
  const [messageStatus, setMessageStatus] = useState(null);
  const setUser = (user) => {
    _setUser(user);
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  };
  const setMessage = (message) => {
    _setMessage(message);
    setTimeout(() => {
      _setMessage(null);
    }, 5000);
  };
  const setToken = (token) => {
    if (!token) localStorage.removeItem('ACCESS_TOKEN');
    else localStorage.setItem('ACCESS_TOKEN', token);

    _setToken(token);
  };
  const isAdmin = () => {
    return user && user.role === 'admin';
  };
  const values = {
    user,
    setUser,
    token,
    setToken,
    message,
    setMessage,
    messageStatus,
    setMessageStatus,
    isAdmin,
  };
  return <userContext.Provider value={values}>{children}</userContext.Provider>;
}

export const useUserContext = () => useContext(userContext);
