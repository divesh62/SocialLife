import React, { useEffect } from 'react'
import UserLayout from '@/layout/UserLayout'
import DashboardLayout from '@/layout/DashboardLayout'
import { useDispatch, useSelector } from 'react-redux'
import { getAllUsers } from '@/config/redux/action/authAction';
import styles from './styles.module.css'
import { BASE_URL } from '@/config';
import { useRouter } from 'next/router';
export default function Discover() {

const authState = useSelector((state)=>state.auth);
const dispatch = useDispatch();
const router = useRouter()

useEffect(()=>{
    if(!authState.all_profiles_fetched){
        dispatch(getAllUsers())
    }
})

  return (
     <UserLayout>
            <DashboardLayout>
                <div><h1>Discover</h1></div>

                <div className={styles.allUserProfile}>
                  {
                    authState.all_profiles_fetched && authState.all_users.map((user)=>{
                      
                        return <div onClick={()=>{
                            router.push(`/view_profile/${user.userId.username} `)
                        }}   key={user._id} className={styles.userProfile}>
                            <img width={100} src={`${BASE_URL}/${user.userId.profilePicture}`} alt="" />
                            <div style={{display:"flex",flexDirection:"column"}}>
                              <h2>{user.userId.name}</h2>
                              <p>{user.userId.email}</p>
                            </div>
                        </div>
                    })
                  }
                </div>
            </DashboardLayout>
    </UserLayout>
  )
}
