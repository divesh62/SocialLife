import UserLayout from '@/layout/UserLayout'
import React, { useEffect } from 'react'
import Dashboard from '../dashboard'
import DashboardLayout from '@/layout/DashboardLayout'
import { useDispatch, useSelector } from 'react-redux'

import { BASE_URL } from '@/config'
import styles from "./styles.module.css"
import { AcceptConnection, getMyConnectionRequest } from '@/config/redux/action/authAction'
import { useRouter } from 'next/router'

export default function MyConnection() {

  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    dispatch(getMyConnectionRequest({token: localStorage.getItem("token")}));
  }, []);


  useEffect(() => {

    if(authState.connectionRequest.length !== 0){
      console.log(authState.connectionRequest);
    }
   
  }, []);

  return (
    <UserLayout>
        <DashboardLayout>
            <div >
              <h3>My-Connection</h3>
              {authState.connectionRequest.length !== 0 && <p>No Connection Request</p>}
              { console.log("Connection Request",authState.connectionRequest)}
              
              {
              authState.connectionRequest.length != 0 && authState.connectionRequest.filter((connection) => connection.status_accepted === null).map((user) => {
                return (
                 <div onClick={() => {router.push(`/view_profile/${user.connectionId.username}`)}}   key={user} className={styles.userCard}>
                  {console.log(user)}
                  
                    <div style={{display:"flex",alignItems:"center"}}>
                      <div  className={styles.profilePicture}>
                        <img src={`${BASE_URL}/${user.connectionId.profilePicture}`} alt="" />
                      </div>
                      <div className={styles.userDetails}>
                        <h2>{user.connectionId.name}</h2>
                        <p>{user.connectionId.username}</p>
                      </div>
                      <div onClick={(e)=>{
                        e.stopPropagation();
                        dispatch(AcceptConnection({
                          connectionId:user._id,
                          token: localStorage.getItem("token"),
                          action: "accept"
                        }))
                      }} className={styles.acceptButton}>Accept</div>
                    </div>
                 </div>
                );
              })
            }

            <h3>My-Network</h3>
           
           {authState.connectionRequest.filter((connection) => connection.status_accepted !== null).map((user) => {
            
             return (
              
              <div>
                
                <div onClick={() => {router.push(`/view_profile/${user.connectionId.username}`)}}   key={user} className={styles.userCard}>
                
                
                  <div style={{display:"flex",alignItems:"center"}}>
                    <div  className={styles.profilePicture}>
                      <img src={`${BASE_URL}/${user.connectionId.profilePicture}`} alt="" />
                    </div>
                    <div className={styles.userDetails}>
                      <h2>{user.connectionId.name}</h2>
                      <p>{user.connectionId.username}</p>
                    </div>
                  </div>
               </div>
              </div>
             )
           })}
            </div>
        </DashboardLayout>
    </UserLayout>
  )
}
