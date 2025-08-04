import { BASE_URL, clientServer } from '@/config';
import DashboardLayout from '@/layout/DashBoardLayout';
import UserLayout from '@/layout/UserLayout';
import React, { useEffect, useState } from 'react'
import styles from "./styles.module.css"
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPosts } from '@/config/redux/action/postAction';
import { getConnectionsRequest, getMyConnectionRequest, sendConnectionRequest } from '@/config/redux/action/authAction';

export default function ViewProfilePage({userProfile}) {



  const router = useRouter();
  const postReducer = useSelector((state) => state.postReducer);
  const dispatch = useDispatch();


  const authState = useSelector((state) => state.auth);

  const [userPost , setUserPost] = useState([]);

  const [isCurrentUserInConnection , setIsCurrentUserInConnection] = useState(false);

  const [isConnectionNull , setIsConnectionNull] = useState(true);


  const getUserPost = async ()=>{
    await dispatch(getAllPosts());
    await dispatch(getConnectionsRequest({token: localStorage.getItem("token")}));
    await dispatch(getMyConnectionRequest({token: localStorage.getItem("token")}));
  };


  useEffect(()=>{
    let post  = postReducer.posts.filter((post)=>{
       return post.userId.username === router.query.username;
    })

    setUserPost(post);
}, [postReducer.posts]);

useEffect(() =>{
  console.log(authState.connections , userProfile.userId._id);
  if(authState.connections.some(user => user.connectionId._id === userProfile.userId._id)){
    setIsCurrentUserInConnection(true);
    if(authState.connections.find(user => user.connectionId._id === userProfile.userId._id).status_accepted === true){
      setIsConnectionNull(false);
    }
  }
    
   if(authState.connectionRequest.some(user => user.userId._id === userProfile.userId._id)){
    setIsCurrentUserInConnection(true);
    if(authState.connectionRequest.find(user => user.userId._id === userProfile.userId._id).status_accepted === true){
      setIsConnectionNull(false);
    }
  }
} , [authState.connections , authState.connectionRequest])

useEffect(()=>{
  getUserPost();
}, [])



  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.container}>

          <div className={styles.backDropContainer}>
            <img
  className={styles.backDrop}
  src={
    userProfile.userId.profilePicture?.startsWith("http")
      ? userProfile.userId.profilePicture
      : `${BASE_URL}/uploads/${userProfile.userId.profilePicture}`
  }
  alt="Profile"
/>

          </div>

          <div className={styles.profileContainer_details}>
             <div className={styles.profileContainer_flex}>
                
               <div style={{flex: "0.8"}}>

                <div style={{display: "flex" , width: "fit-content" , alignItems: "center" , gap: "1.2rem"}}>
                 <h2>{userProfile.userId.name}</h2>
                 <p style={{color: "gray"}}>@{userProfile.userId.username}</p>
                 
                </div>

               <div style={{display: "flex", alignItems: "center" , gap: "1.2rem"}}>
                 {isCurrentUserInConnection
                   ? <button className={styles.connectedBtn}>{isConnectionNull ? "Pending" : "Connected"}</button>
                   : <button className={styles.connectBtn} onClick={  () => {
                       dispatch(sendConnectionRequest({
                         token: localStorage.getItem("token"),
                         user_id: userProfile.userId._id
                       }));
                     }}>Connect</button>}

                     <div style={{cursor : "pointer"}} onClick={async ()=>{
                        const response = await clientServer.get(`/user/download_resume?id=${userProfile.userId._id}`);
                        window.open(`${response.data.message}` , "_blank");
                     }}>
                      <svg style={{width: "1.2em"}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
</svg>

                     </div>
               </div>

                <div>
                  <p>{userProfile.bio}</p>
                </div>



               </div>

               <div style={{ flex: "0.2" }}>
  <h3>Recent Activity</h3>
  {userPost.map((post) => {
    return (
      <div key={post._id} className={styles.postCard}>
        <div className={styles.card_profileContainer}>
          {post.media && (
            <img
              src={
                post.media.startsWith("http")
                  ? post.media
                  : `${BASE_URL}/uploads/${post.media}`
              }
              alt="Post Media"
            />
          )}
        </div>
        <p>{post.body}</p>
      </div>
    );
  })}
</div>


             </div>
          </div>

          <div className={styles.workHistory}>
              <h4>Work History</h4>
              <div className={styles.workHistoryContainer}>
                {
                  userProfile.pastwork.map((work , index)=>{
                    return(
                      <div className={styles.workHistoryCard} key={index}>

                        <p style={{display: "flex" , fontWeight: "bold" , alignItems: "center" , gap: "0.8rem"}}>
                          {work.company} - {work.position}
                        </p>
                        <p>{work.years}</p>
                      </div>
                    )
                  })
                }
              </div>
          </div>
           
        </div>
      </DashboardLayout>
    </UserLayout>
  )
}
export async function  getServerSideProps(context) {

  console.log(context.query.username);
  const request = await clientServer.get("/user/get_profile_based_on_username",{
    params: {
      username: context.query.username,
    }
  });

    const response = await request.data;
    // console.log(response);

    return {props: {userProfile: request.data.profile}}

  
}