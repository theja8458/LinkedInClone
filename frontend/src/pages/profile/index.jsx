import UserLayout from "@/layout/UserLayout";
import React, { useEffect, useState } from "react";
import Dashboard from "../dashboard";
import { useDispatch, useSelector } from "react-redux";
import { getAboutUser } from "@/config/redux/action/authAction";
import styles from "./styles.module.css";
import { BASE_URL, clientServer } from "@/config";
import DashboardLayout from "@/layout/DashBoardLayout";
import { getAllPosts } from "@/config/redux/action/postAction";
import { useRouter } from "next/router";

export default function ProfilePage() {


   const authState = useSelector((state) => state.auth);
   const router = useRouter();
     const postReducer = useSelector((state) => state.postReducer);
   const [userProfile , setUserProfile] = useState({});

   const [userPost , setUserPost] = useState([]);

     const dispatch = useDispatch();

     const [isModalOpen , setIsModalOpen] = useState(false);
     const[inputData , setInputData] = useState({company: '' , position: '' , years: ''});

 
     const handleWorkInputChange = (e) =>{

      const {name , value} = e.target;
      setInputData({...inputData , [name]: value});


     }   

    useEffect(()=>{
      dispatch(getAboutUser({token: localStorage.getItem("token")}));
      dispatch(getAllPosts());

    } , []);

    useEffect(()=>{

        if (authState.user !== undefined) {
      setUserProfile(authState.user);
        
         let post  = postReducer.posts.filter((post)=>{
           return post.userId.username === authState.user.userId.username;
        })
         setUserPost(post);
    }
    
       

    } , [authState.user , postReducer.posts])

   ;

//       if (!userProfile?.userId) {
//     return <p>Loading profile...</p>;
//   }

const updateProfilePicture = async(file) =>{

  const formData = new FormData();
  formData.append("profile_picture" , file);
  formData.append("token" , localStorage.getItem("token"));
  
  const response = await clientServer.post("/update_profile_data" , formData , {
    headers:{
      'Content-Type' : 'multipart/form-data',

    }
  });

  dispatch(getAboutUser({token: localStorage.getItem("token")}));

}

const updateProfileData = async()=>{
  const request = await clientServer.post("/user_update", {
    token: localStorage.getItem("token"),
    name: userProfile.userId.name,
  });

  const response = await clientServer.post("/update_profile_data" , {
    token: localStorage.getItem("token"),
    bio: userProfile.bio,
    currentPost: userProfile.currentPost,
    pastwork: userProfile.pastwork,

  });

  dispatch(getAboutUser({token: localStorage.getItem("token")}));
}


  return (
    <UserLayout>
      <DashboardLayout>
        {authState.user && userProfile.userId && 
        

        
        <div className={styles.container}>

          <div className={styles.backDropContainer}>
              <label htmlFor="profilePirctureUpload" className={styles.backDrop_overlay}>
                <p>
                  Edit
                </p>
              </label>
              <input onChange={(e)=>{
                updateProfilePicture(e.target.files[0]);
              }} style={{visibility: "hidden"}} type="file" name="" id="profilePirctureUpload" />
             <img
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
                 <input className={styles.nameEdit} type="text" value={userProfile.userId.name} onChange={(e) =>{
                  setUserProfile({...userProfile , userId: {...userProfile.userId, name: e.target.value}})
                 }} />
                 <p style={{color: "gray"}}>@{userProfile.userId.username}</p>
                 
                </div>

           

                <div>
                 <textarea name="" id="" value={userProfile.bio} onChange={(e)=>{
                  setUserProfile({...userProfile , bio: e.target.value});

                 }}

                 rows={Math.max(3 , Math.ceil(userProfile.bio.length / 80))}
                 style={{width: "100%"}}
                 
                 
                 >

                 </textarea>
                </div>



               </div>

               <div style={{flex : "0.2"}}>
                   <h3>Recent Activity</h3>
                   {userPost.map((post)=>{
                    return(
                      <div key={post._id} className={styles.postCard}>

                        <div className={styles.card_profileContainer}>

                          {post.media !== "" ? (
  <img
    src={
      post.media.startsWith("http")
        ? post.media
        : `${BASE_URL}/uploads/${post.media}`
    }
    alt="PostImage"
  />
) : (
  <div style={{ width: "3.4rem", height: "3.4rem" }}></div>
)}


                        </div>
                        <p>{post.body}</p>
                      </div>
                    )
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

                <button  className={styles.addWorkButton} onClick={()=>{
                    setIsModalOpen(true);
                }}>Add Work

                </button>
              </div>
          </div>


          {userProfile !== authState.user && 
          
          <div onClick={()=>{
            updateProfileData();
          }} className={styles.updateProfileBtn}>
            Update Profile
            


             </div>
             
          
          }
           
        </div>
        }

         {
        isModalOpen  && 
        <div 
        onClick={()=>{
          setIsModalOpen(false)
        }}
        className={styles.commentsContainer}>
           
           <div onClick={(e) =>{
            e.stopPropagation();
           }}
           className={styles.allCommentsContainer}>

          <input onChange={handleWorkInputChange} name="company" className={styles.inputField} type="text" placeholder='Enter Company'/>
          <input onChange={handleWorkInputChange} name="position" className={styles.inputField} type="text" placeholder='Enter Postion'/>
          <input onChange={handleWorkInputChange} name ="years" className={styles.inputField} type="number" placeholder='Enter Years'/>

          <div onClick={() =>{
            setUserProfile({...userProfile , pastwork:[...userProfile.pastwork , inputData]})
            setIsModalOpen(false);
          }} className={styles.updateProfileBtn}>
             Add Work
          </div>



           
           </div>
          
        </div>
       }
      </DashboardLayout>
    </UserLayout>
  );
}
