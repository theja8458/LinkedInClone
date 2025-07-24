import { AcceptConnection, getMyConnectionRequest } from '@/config/redux/action/authAction';
import DashboardLayout from '@/layout/DashBoardLayout'
import UserLayout from '@/layout/UserLayout'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from "./styles.module.css";
import { BASE_URL } from '@/config';
import { useRouter } from 'next/router';
import { connection } from 'next/server';

export default function MyConnectionsPage() {

  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const router = useRouter();

  useEffect(()=>{
    dispatch(getMyConnectionRequest({token: localStorage.getItem("token")}));
  } , [])

  useEffect(()=>{

    if(authState.connectionRequest.length !== 0){
      console.log(authState.connectionRequest);
    }
  },[authState.connectionRequest])
  return (
     <UserLayout>
  
     <DashboardLayout>
      <div style={{display: 'flex' , flexDirection: "column" , gap: "1.7rem"}}>
         
        <h4>My Connections</h4>
         {authState.connectionRequest.length === 0 && <h1>No Connection Request Pending</h1>}

         {authState.connectionRequest.length !== 0 && authState.connectionRequest.filter((connection) => connection.status_accepted === null ).map((user,index)=>{
          return(
            <div onClick={()=>{
              router.push(`/view_profile/${user.userId.username}`)
            }} key={user._id} className={styles.userCard}>
              <div style={{display : "flex" , alignItems: "center" , gap: "1.2rem" , justifyContent: "space-between"}}>
                 <div className={styles.profilePicture}>
                  
                  <img src={`${BASE_URL}/uploads/${user.userId.profilePicture}`} alt="" />
              </div>
                <div className={styles.userInfo}>
                <h1>{user.userId.name}</h1>
                <p>{user.userId.username}</p>
              </div>

              <button onClick={(e)=>{
                e.stopPropagation();

                dispatch(AcceptConnection({
                  connection_id: user._id,
                  token: localStorage.getItem("token"),
                  action: "accept"
                }))
              }} className={styles.connectedBtn}>Accept</button>

                 </div>
              </div>
              

            
          )
         })}


         <h4>My Network</h4>

     {authState.connectionRequest.filter((connection) => connection.status_accepted !== null ).map((user,index)=>{
      return(
        <div style={{cursor: "pointer"}} onClick={()=>{
              router.push(`/view_profile/${user.userId.username}`)
            }} key={user._id} className={styles.userCard}>
              <div style={{display : "flex" , alignItems: "center" , gap: "1.2rem" , justifyContent: "space-between"}}>
                 <div className={styles.profilePicture}>
                  
                  <img src={`${BASE_URL}/uploads/${user.userId.profilePicture}`} alt="" />
              </div>
                <div className={styles.userInfo}>
                <h1>{user.userId.name}</h1>
                <p>{user.userId.username}</p>
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
