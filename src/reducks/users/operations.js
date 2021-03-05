import {signInAction, signOutAction, fetchProductsInCartAction, fetchOrdersHistoryAction} from "./actions"
import {push} from 'connected-react-router';
import {auth, db, FirebaseTimestamp} from  '../../firebase/index';

export const addProductToCart = (addedProduct) => {
    return async(dispatch, getState) => {
        const uid = getState().users.uid;
        const cartRef = db.collection('users').doc(uid).collection('cart').doc();
        addedProduct['cartId'] = cartRef.id;
        await cartRef.set(addedProduct);
        dispatch(push('/'))
    }
};

export const fetchOrdersHistory = () => {
    return async (dispatch, getState) => {
        const uid = getState().users.uid;
        const list = [];

        db.collection('users').doc(uid).collection('orders')
            .orderBy('updated_at', "desc").get()
            .then(snapshots => {
                snapshots.forEach(snapshot => {
                    const data = snapshot.data();
                    list.push(data)
                });
                dispatch(fetchOrdersHistoryAction(list))
            })
    }
};

export const fetchProductsInCart = (products) => {
    return async(dispatch) => {
        dispatch(fetchProductsInCartAction(products))
    }
};

export const listenAuthState = () => {
    return async (dispatch) => {
        return auth.onAuthStateChanged(user => {
            if (user) {
                const uid = user.uid
                db.collection('users').doc(uid).get().then(snapshot => {
                    const data = snapshot.data()
                    dispatch(signInAction({
                        isSignedIn: true,
                        role: data.role,
                        uid:uid,
                        username: data.username
                    }))
                })

            } else {
                dispatch(push('/signin'))
            }
        })
    }
};

export const resetPassword = (email) => {
    return async (dispatch) => {
        if (email === "") {
            alert("必須項目が未入力です")
            return false
        } else {
            auth.sendPasswordResetEmail(email).then(() => {
                alert('入力されたアドレスにパスワードリセット用のメールを送信しました。')
                dispatch(push('./signin'))
            }).catch(() => {
                alert('パスワードリセットに失敗しました。通信環境を確認してもう一度トライしてみてください。')
            })
        }

    }
};

export const signIn =(email,passward) => {
    return async(dispatch) => {
        // Validation
        if(email === "" || passward === "") {
            alert("必須項目が未入力です")
            return false
        }

        auth.signInWithEmailAndPassword(email,passward).then( result => {
            const user = result.user

            if (user) {
                const uid = user.uid
                db.collection('users').doc(uid).get().then(snapshot => {
                    const data = snapshot.data()
                    dispatch(signInAction({
                        isSignedIn: true,
                        role: data.role,
                        uid:uid,
                        username: data.username
                    }))

                    dispatch(push('/'))
                })
            }
        })
    }
};

export const signUp = (username,email,passward,confirmPassword) => {
    return async(dispatch) => {
        // Validation
        if(username === "" || email === "" || passward === "" || confirmPassword === "" ) {
            alert("必須項目が未入力です")
            return false
        }

        if(passward !== confirmPassword) {
            alert("パスワードが一致しません。もう一度お試しください")
            return false
        }

        if(passward.length < 6) {
            alert("パスワードは6文字以上で入力してください")
            return false
        }

        return auth.createUserWithEmailAndPassword(email,passward).then(result => {
            const user = result.user
            if (user) {
                const uid = user.uid
                const timestamp = FirebaseTimestamp.now()

                const userInialData = {
                    created_at: timestamp,
                    email: email,
                    role: "customer",
                    uid: uid,
                    updated_at: timestamp,
                    username: username
                }

                db.collection('users').doc(uid).set(userInialData)
                    .then(() => {
                        dispatch(push('/'))
                    })
            }
        })
    }
};

export const signOut = () => {
    return async(dispatch) => {
        auth.signOut().then(()=> {
            dispatch(signOutAction());
            dispatch(push('/signin'));
        })
    }

};