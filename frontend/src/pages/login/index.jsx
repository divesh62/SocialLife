import UserLayout from '@/layout/UserLayout'
import React, { use, useEffect, useState } from 'react'
import styles from './styles.module.css'
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { loginUser, registerUser } from '@/config/redux/action/authAction';
import { empatyMessage } from '@/config/redux/reducer/authReducer';
import { imageConfigDefault } from 'next/dist/shared/lib/image-config';

export default function Login() {
    const authState = useSelector((state)=>state.auth);

    const dispatch = useDispatch();

    const router = useRouter();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const[name, setName] = useState("");

    useEffect(() => {
        if(authState.isloggedIn){
            router.push("/dashboard");
        }
    },[authState.isloggedIn]);

    const [userLoginMethod, setUserLoginMethod] = useState(true);
    const handleRegister = () => {
        console.log("Registering.....");
        dispatch(registerUser({
            username,
            name,
            email,
            password,
        }));
    }

    const handleLoginUser = () => {
        console.log("Logging in User....");
       dispatch(loginUser({
            username,
            password,
       }));
    }

    useEffect(() => {   
        dispatch(empatyMessage());
    }, [userLoginMethod]);

    useEffect(() => {   
        if(localStorage.getItem("token")){
            router.push("/dashboard");
        }
    }, []);

  return (
    <UserLayout>
      <div className={styles.container  }>
         <div className={styles.cardContainer}>
            <div className={styles.cardContainer__left}>
               <p className={styles.cardLeft__heading}>{userLoginMethod ? "Login": "Register"}</p>
              <p style={{color: authState.isError ? "red" : "green",textAlign:"center"}}> {authState.message.message}</p>

                <div className={styles.inputContainer}>
                    <div  className={styles.inputRow}>
                        <input type="text " onChange={(e)=>setUsername(e.target.value)} className={styles.inputField} placeholder='Username' />
                        <input type="password " onChange={(e)=>setPassword(e.target.value)} className={styles.inputField} placeholder='Password' />
                    </div>
                     { !userLoginMethod && <div className={styles.inputRow2}>
                        <input type="text " onChange={(e)=>setName(e.target.value)} className={styles.inputField} placeholder='Name' />
                        <input type="email " onChange={(e)=>setEmail(e.target.value)} className={styles.inputField} placeholder='Email' />
                    </div>}

                    <div className={styles.buttonWithOutline} onClick={()=>{
                        if(userLoginMethod){
                            handleLoginUser();
                        }else{
                            // Register Logic
                            handleRegister();
                        }
                    }}>
                        {userLoginMethod ? "Login" : "Register"}
                    </div>
                </div>

            </div>
            <div
        
            onClick={()=>{
                
                setUserLoginMethod(!userLoginMethod)
            }} className={styles.cardContainer__right}>
                <img width={400} src="images/—Pngtree—fingerprint unlock login server_5044948.png" alt="" />
                    <div className={styles.cardContainer__right_text}>
                        <p>{userLoginMethod ? "New User? Register Now" : "Already have an account? Login"}</p>
                    </div>
            </div>
       </div>
      </div>
    </UserLayout>
  )
}
