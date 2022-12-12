import {CognitoUser} from 'amazon-cognito-identity-js';
import {Auth} from 'aws-amplify';
import {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import {Hub} from 'aws-amplify';
import {HubCallback} from '@aws-amplify/core';

type CustomCognitoUser = CognitoUser & {
  attributes: {
    sub: string;
    email_verified: boolean;
    name: string;
    email: string;
  };
};

type UserType = CustomCognitoUser | null | undefined;

type AuthContextType = {
  user: UserType;
  userId: string;
};

const AuthContext = createContext<AuthContextType>({
  user: undefined,
  userId: '',
});

const AuthContextProvider = ({children}: {children: ReactNode}) => {
  const [user, setUser] = useState<UserType>(undefined);
  console.log('user from Auth', JSON.stringify(user, null, 2));
  const checkUser = async () => {
    try {
      const authUser = await Auth.currentAuthenticatedUser({
        bypassCache: true,
      });
      setUser(authUser);
    } catch (e) {
      setUser(null);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    const listener: HubCallback = data => {
      const {event} = data.payload;
      if (event === 'signOut') {
        setUser(null);
      }
      if (event === 'signIn') {
        checkUser();
      }
    };
    Hub.listen('auth', listener);

    return () => Hub.remove('auth', listener);
  }, []);

  return (
    <AuthContext.Provider value={{user, userId: user?.attributes?.sub || ''}}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
export const useAuthContext = () => useContext(AuthContext);
