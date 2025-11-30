import { BASE_URL, clientServer } from '@/config';
import DashboardLayout from '@/layout/DashboardLayout';
import UserLayout from '@/layout/UserLayout';
import { useSearchParams } from 'next/navigation';
import React, { use, useEffect, useState } from 'react'
import styles from "./style.module.css"
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { getAllPosts } from '@/config/redux/action/postAction';
import { getConnectionRequest, getMyConnectionRequest, sendConnectionRequest } from '@/config/redux/action/authAction';

export default function ViewPageProfile({userProfile}) {

    const router = useRouter();
    const searchParamers = useSearchParams();
    const authState = useSelector((state)=>state.auth);
    const postReducer = useSelector((state)=>state.posts);
    const [userPosts, setUserPosts] = useState([]);
    const dispatch = useDispatch();
    const [isCurrentUserInConnections, setIsCurrentUserInConnections] = useState(false);
    const [isConnectionNull , setIsConnectionNull] = useState(true);

    const getUsersPost = async()=>{
        await dispatch(getAllPosts());
        await dispatch(getConnectionRequest({token: localStorage.getItem("token")}));
        await dispatch(getMyConnectionRequest({token: localStorage.getItem("token")}));
    }

    useEffect(()=>{
        let post = postReducer.posts.filter((post)=>{
            return post.userId.username === router.query.username
        })
        setUserPosts(post);
    },[postReducer.posts]);

    useEffect(()=>{
        if(Array.isArray(authState.connections) && authState.connections.some(user => user.connectionId._id === userProfile.userId._id)){
            setIsCurrentUserInConnections(true);

            if(Array.isArray(authState.connections) && authState.connections.some(user => user.connectionId._id === userProfile.userId._id && user.status_accepted === true)){
            setIsConnectionNull(false);
        }
        }
        if(Array.isArray(authState.connectionRequest) && authState.connections.some(user => user.connectionId._id === userProfile.userId._id)){
            setIsCurrentUserInConnections(true);
            
            if(Array.isArray(authState.connectionRequest) && authState.connections.some(user => user.connectionId._id === userProfile.userId._id && user.status_accepted === true)){
            setIsConnectionNull(false);
        }
        }
       
    },[authState.connections]);
    

    useEffect(()=>{
        if(authState.isTokenThere){
            getUsersPost();
        }
    },[authState.isTokenThere]);    
  
  return (
    <UserLayout>
        <DashboardLayout>
            <div className={styles.container}>
                <div className={styles.backDropContainer}>
                    <img className={styles.backDrop} src={`${BASE_URL}/${userProfile.userId.profilePicture}`} alt="" />
                </div>
                <div className={styles.profileContainer_details}>
                    <div style={{display:"flex",gap:"0.7"}}>
                        <div style={{flex:"0.8"}}>
                            <div style={{display:"flex",width:"fit-content",alignItems:"center",gap:"1.2rem"}}>
                                <h1>{userProfile.userId.name}</h1>
                                <p style={{color:"gray"}}>{userProfile.userId.username}</p>
                            </div>
                            {isCurrentUserInConnections ? <button className={styles.connectedButton}>{isConnectionNull ? "Pending" : "Connected" }</button> :
                         <button
                                onClick={()=>{
                                    dispatch(sendConnectionRequest({token: localStorage.getItem("token"),user_id: userProfile.userId._id }))
                                }} className={styles.connectButton}>Connect</button>}

                            <div>
                                <p>{userProfile.bio}</p>

                            </div>

                        </div>
                        
                        <div style={{flex:"0.2"}}>
                            <h3>Recent Activity</h3>
                            {userPosts.map((post)=>{
                                return <div key={post._id} className={styles.postCard}>
                                    <div className={styles.card}>
                                        <div className={styles.card__profileContainer}>
                                            {post.media !== "" && <img src={`${BASE_URL}/${post.media}`} alt="" />}
                                           
                                        </div>
                                         <p>{post.body}</p>
                                    </div>
                                </div>
                            })}

                        </div>
                    </div>
                </div>
                <div className={styles.workHistory}>
                    <h4>Work History</h4>
                    <div className={styles.workHistory__container}>
                        {userProfile.pastWork.map((work)=>{
                            return <div key={work._id} className={styles.workHistory__container__card}>
                                <p style={{fontWeight:"bold",display:"flex",alignItems:"center",gap:"0.8rem"}}>{work.company}-{work.position}</p>
                                <p>{work.years}</p>
                            </div>
                        })}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    </UserLayout>
  )
}



export async function getServerSideProps(context) {
    console.log(context.query.username);

    const request = await clientServer.get("/user/get_profile_based_on_username",{
        params: {
            username: context.query.username,
        }
    });

    const response = await request.data;
    console.log(response);

    return { props:{ userProfile: request.data.profiile} };

  }