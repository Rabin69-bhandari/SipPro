'use client'



import LandingPage from "@/components/Landing/LandingPage";
import { useUser,UserButton,Show } from "@clerk/nextjs";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {

  const {user,isLoaded} = useUser()
  const router = useRouter()


  useEffect(() => {
    if(isLoaded && user){
      router.replace("/home")
    }
  }, [user,router,isLoaded])


  if(!isLoaded){
    return <h2>Loading......</h2>
  }

  if(user){
    return null
  }



  return (
    <>
     <LandingPage />
    
      
    </>
  );
}
