import React, { useEffect } from 'react'
import styles from './styles.module.css'
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { setTokenIsThere } from '@/config/redux/reducer/authReducer';

export default function DashboardLayout({children}) {
    const router = useRouter();
    const dispatch = useDispatch();
    const authState = useSelector((state)=>state.auth)

      useEffect(() => {
            if(localStorage.getItem("token") === null){
                router.push("/login");
            }
        dispatch(setTokenIsThere());
        }
        , []);

  return (
    <div className={styles.container}>
            <div className={styles.homeContainer}>
                <div className={styles.homeContainer__leftBar}> 
                    <div onClick={()=>{
                        router.push("/dashboard");
                    }} className={styles.sideBarOptions}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                        </svg>

                        <p>Home</p>   
                    </div> 
                    <div onClick={()=>{ router.push("/discover")}} className={styles.sideBarOptions}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                        <p>Discover</p>
                    </div>  
                    <div onClick={()=>{ router.push("/my_connections")}} className={styles.sideBarOptions}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M8.288 15.038a5.25 5.25 0 0 1 7.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 0 1 1.06 0Z" />
                        </svg>

                        <p>My-Connections</p>
                    </div>          
                </div>
                
            
                <div className={styles.homeContainer__feedConatiner}>
                    {children}
                </div>
                <div className={styles.homeContainer__extraContainer}>
                    <h2>Top Profile</h2>
                    {authState.all_profiles_fetched && authState.all_users?.map((profile)=>{
                        return(
                            <div key = { profile._id}  className={styles.extraContainer__profiles}>
                                <p>{profile.userId.name}</p>
                            </div>
                        )
                    })}

                </div>
            </div>
            <div className={styles.mobileNavbarView}>

                <div onClick={()=>{
                    router.push("/dashboard")
                }} className={styles.singleNavItemHolder_mobileView}>
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                    </svg>
                    
                </div>
                <div onClick={()=>{
                    router.push("/discover")
                }} className={styles.singleNavItemHolder_mobileView}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                      
                </div>
                <div onClick={()=>{
                    router.push("/my_connections")
                }} className={styles.singleNavItemHolder_mobileView}>
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M8.288 15.038a5.25 5.25 0 0 1 7.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 0 1 1.06 0Z" />
                        </svg>

                        
                </div>

            </div>
    </div>
  )
}
