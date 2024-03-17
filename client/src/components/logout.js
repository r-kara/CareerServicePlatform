import React from "react";

const handleLogout=()=>{
    localStorage.clear();
    window.location.href="/";
}

export default handleLogout;