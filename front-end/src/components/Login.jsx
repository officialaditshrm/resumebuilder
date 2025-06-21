import { useState } from 'react'


function Login ({setLoggedInUser, setShowLogin, url, setToken}) {
    const [showSignUp, setShowSignUp] = useState(false)
    const [alertmessage, setalertmessage] = useState(null)


    const loginUser = async (email, password) => {
        try{
            const response = await fetch(`${url}/api/users/login`, {
                method: "POST",
                body: JSON.stringify({email, password}),
                headers: {
                    "Content-Type" : "application/json"
                }
            })
            const actualresponse = await response.json()
            setToken(actualresponse.token)
            setalertmessage(actualresponse.message)
            localStorage.setItem("resoluteToken", actualresponse.token)
            {actualresponse.success === true && 
                setShowLogin(false)
                setShowSignUp(false)
            }
        } catch (error) {
            setToken("")
            setalertmessage(error.message)
        }
    }

    const registerUser = async (name, email, password) => {
        try{
            const response = await fetch(`${url}/api/users/register`, {
                method: "POST",
                body: JSON.stringify({name, email, password}),
                headers: {
                    "Content-Type" : "application/json"
                }
            })
            const actualresponse = await response.json()
            setToken(actualresponse.token)
            setalertmessage(actualresponse.message)
            localStorage.setItem("resoluteToken", actualresponse.token)
            if (actualresponse.success === true) { 
                setalertmessage(null)
                setShowLogin(false)
                setShowSignUp(false)
            }
        } catch (error) {
            setToken("")
            setalertmessage(error.message)
        }
    }

    const handleLogin = (event) => {
        const email = event.target.elements.email.value
        const password = event.target.elements.password.value
        loginUser(email, password)
    }

    const handleSignUp = (event) => {
        const name = event.target.elements.signupname.value
        const email = event.target.elements.signupemail.value
        const password = event.target.elements.signuppassword.value
        registerUser(name, email, password)
    }

    return (
        <div className = "dark:bg-neutral-950/30 p-5 sm:p-10 bg-neutral-100/30 backdrop-blur-sm flex items-center justify-center fixed top-0 z-50 left-0 h-screen w-screen">
            <div className = "lg:w-2/5 md:w-3/5 sm:w-full bg-neutral-100 relative p-5 sm:p-10 rounded-xl items-center shadow-[0_0_5px_1px_rgba(0,0,0,0.25)] flex flex-col">
                <button
                onClick = {() => {setShowLogin(false); setShowSignUp(false)}}
                className = "absolute right-5 top-5"><img src = "/close.svg" /></button>
                {!showSignUp ?
                    <form onSubmit = {(event) => {event.preventDefault(); handleLogin(event)}} className = "flex flex-col gap-4 sm:gap-8 items-center">
                        <h1 className = "font-extrabold text-3xl text-neutral-600">LOGIN</h1>
                        <div className = "flex flex-col sm:text-lg gap-2 w-full">
                            <label className = "font-semibold">Email:</label>
                            <input name = "email" autoComplete='email' type = "text" className = "p-1 sm:p-2 rounded-lg shadow-[0_0_5px_1px_rgba(0,0,0,0.15)] border border-neutral-950/30 w-full"/>
                        </div>
                        <div className = "flex flex-col sm:text-lg gap-2 w-full">
                            <label className = "font-semibold">Password:</label>
                            <input name = "password" autoComplete='current-password' type = "password" className = "p-1 sm:p-2 rounded-lg shadow-[0_0_5px_1px_rgba(0,0,0,0.15)] border border-neutral-950/30 w-full"/>
                        </div>
                        <input type = "submit" value = "LOGIN" className = "cursor-pointer bg-blue-900 text-white py-2 px-4 font-bold rounded-md "/>
                        <button type = "button" className = "hover:text-blue-600" onClick = {() => setShowSignUp(true)}>Sign-up Instead?</button>
                    </form>
                    :
                    <form onSubmit = {(event) => {event.preventDefault(); handleSignUp(event)}} className = "flex flex-col gap-4 sm:gap-8 items-center">
                        <h1 className = "font-extrabold text-3xl text-neutral-600">SIGNUP</h1>
                        <div className = "flex flex-col sm:text-lg gap-2 w-full">
                            <label className = "font-semibold">Name:</label>
                            <input name = "signupname" autoComplete='name' type = "text" className = "p-1 sm:p-2 rounded-lg shadow-[0_0_5px_1px_rgba(0,0,0,0.15)] border border-neutral-950/30 w-full"/>
                        </div>
                        <div className = "flex flex-col sm:text-lg gap-2 w-full">
                            <label className = "font-semibold">Email:</label>
                            <input name = "signupemail" autoComplete='email' type = "text" className = "p-1 sm:p-2 rounded-lg shadow-[0_0_5px_1px_rgba(0,0,0,0.15)] border border-neutral-950/30 w-full"/>
                        </div>
                        <div className = "flex flex-col sm:text-lg gap-2 w-full">
                            <label className = "font-semibold">Password:</label>
                            <input name = "signuppassword" autoComplete='new-password' type = "password" className = "p-1 sm:p-2 rounded-lg shadow-[0_0_5px_1px_rgba(0,0,0,0.15)] border border-neutral-950/30 w-full"/>
                        </div>
                        <input type = "submit" value = "SIGNUP" className = "cursor-pointer bg-green-900 text-white py-2 px-4 font-bold rounded-md "/>
                        <button type = "button" className = "hover:text-blue-600" onClick = {() => setShowSignUp(false)}>Log-in Instead?</button>
                    </form>
                }
                <p className = "flex flex-wrap text-red-500">{alertmessage}</p>
            </div>
        </div>
    )
}

export default Login