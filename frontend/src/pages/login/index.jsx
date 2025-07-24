import UserLayout from '@/layout/UserLayout'
import React, { useEffect, useState } from 'react'
import styles from "./styles.module.css"
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, registerUser } from '@/config/redux/action/authAction';
import { emptyMessage } from '@/config/redux/reducer/authReducer';

export default function LoginComponent() {
  const authState = useSelector((state)=> state.auth)
  const router  = useRouter();

  const dispatch = useDispatch();

  const [userLoignMethod , setuserLoginMethod] = useState(false);
   const [email , setEmailAdress] = useState("");
   const [password , setPassword] = useState("");
   const [username , setUsername] = useState("");
   const [name , setName] = useState("");
  useEffect(()=>{
    if(authState.loggedIn){
      router.push('/dashboard');
    }
  } , [authState.loggedIn]);


// useEffect(() => {
//   if (authState.isSuccess && !userLoignMethod) {
//     // just registered
//     setuserLoginMethod(true); // switch to login
//   }
// }, [authState.isSuccess]);
useEffect(()=>{
  if(localStorage.getItem("token")){
    router.push("/dashboard");
  }
});

  useEffect(()=>{
   dispatch(emptyMessage());
  }, [userLoignMethod])

  const handleRegister = ()=>{
    console.log("Registering");
    dispatch(registerUser({username,password , email , name}))
  }

  
  const handleLogin = () =>{
    console.log("login..");
    dispatch(loginUser({email,password}));
  } 
 

  return (
    <UserLayout>
    

      <div className={styles.container} >
       
       <div className={styles.cardContainer}>
        
        <div className={styles.cardContainer_left}>
         
          <p className={styles.cardLeft_heading}>{userLoignMethod ? "Sign In" : "Sign Up"}</p>
          
          
            <p style={{color: authState.isError ? "red" : "green"}}>{authState.message.message}</p>


          <div className={styles.inputContainers}>
          {!userLoignMethod &&  <div className={styles.inputRow}>
           <input onChange={(e) =>setUsername(e.target.value)} className={styles.inputField} type="text" placeholder='Username'/>
           <input onChange={(e)=> setName(e.target.value)} className={styles.inputField} type="text" placeholder='Name'/>

           </div> }
            <input onChange={(e)=> setEmailAdress(e.target.value)} className={styles.inputField} type="text" placeholder='Email'/>
            <input onChange={(e) => setPassword(e.target.value)} className={styles.inputField} type="text" placeholder='Password'/>

            <div onClick={()=>{
              if(userLoignMethod){
                handleLogin();
              }else{
                handleRegister();
              }
            }} className={styles.buttonWithOutline}>
              <p >{userLoignMethod ? "Sign In" : "Sign Up"}</p>
            </div>
          </div>
         
        </div>
        <div className={styles.cardContainer_right}>
          
            {userLoignMethod ? <p>Don't Have an Account?</p> : <p>Alreday have an Account?</p>}
            <div onClick={()=>{
              setuserLoginMethod(!userLoignMethod)
            }} style={{color: "black" , textAlign: "center"}} className={styles.buttonWithOutline}>
              <p >{userLoignMethod ? "Sign Up" : "Sign In"}</p>
              </div>
            
        </div>

       </div>
       </div>

    </UserLayout>
  )
}
