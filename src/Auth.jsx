import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getIsSignedIn } from './reducks/users/selectors'
import { listenAuthState } from './reducks/users/operations';

const Auth = ({children}) => {
    const selector = useSelector((state) => state);
    const isSignedIn = getIsSignedIn(selector);
    const dispatch = useDispatch();

    useEffect( () => {
        if (!isSignedIn) {
            dispatch(listenAuthState())
        }
    },[]);

    if (!isSignedIn) {
        return <></>
    } else  {
        return children
    }
};

export default Auth;