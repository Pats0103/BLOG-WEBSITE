import React from 'react'

function UserCard({content:{personal_info:{username,fullname,profile_img}}}) {    


  return (
    
    <>
    <div className="flex items-center gap-3">
      <img src={profile_img} alt="profile" className="w-12 h-12 rounded-full" />
      <div>
        <h1 className="text-lg font-bold">{fullname}</h1>
        <p className="text-dark-grey">@{username}</p>
      </div>
    </div>
    </>
  )
}

export default UserCard