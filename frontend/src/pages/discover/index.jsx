import { BASE_URL } from '@/config';
import { getAllUsers } from '@/config/redux/action/authAction';
import DashboardLayout from '@/layout/DashBoardLayout';
import UserLayout from '@/layout/UserLayout';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from "./styles.module.css";
import { useRouter } from 'next/router';

export default function DiscoverPage() {

  const authState = useSelector((state) => state.auth)
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() =>{
    if(!authState.all_profiles_fetched){
       dispatch(getAllUsers());
    }
  }, [])
  return (
    <UserLayout>
  
     <DashboardLayout>
      <div>
         <h1>Discover</h1>

         <div className={styles.allUserProfiles}>
          {authState.all_profiles_fetched && authState.all_users.map((user)=>{
            return (
              <div onClick={()=>{
               router.push(`/view_profile/${user.userId.username}`)
              }} key={user._id} className={styles.userCard}>
                <img className={styles.userCard_image} src={`${BASE_URL}/uploads/${user.userId.profilePicture}`} alt="" />
                <div>
                <h1>{user.userId.name}</h1>
                <p>{user.userId.email}</p>
                </div>
              </div>
            )
          })}
         </div>
      </div>
     </DashboardLayout>

    </UserLayout>
  )
}
