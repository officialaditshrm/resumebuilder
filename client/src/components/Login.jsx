import { useState } from 'react'

function Login({setShowLogin, setToken, url}) {
    const [showRegister, setShowRegister] = useState(false)
    const [validEmail, setValidEmail] = useState(false)
    const [emailTouched, setEmailTouched] = useState(false)
    const [validPassword, setValidPassword] = useState(false)
    const [passwordTouched, setPasswordTouched] = useState(false)

    // FORM VALIDATION
    const validateEmail = (event) => {
        const emailPattern = /^[a-zA-Z0-9.%+_]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        setValidEmail(emailPattern.test(event.target.value))
    }
    const validatePassword = (event) => {
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,}$/
        setValidPassword(passwordPattern.test(event.target.value))
    }


    // FORM SUBMISSION HANDLING
    const handleLogin = async (event) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        const email = formData.get("email")
        const password = formData.get("password")

        try {
            const response = await fetch(`${url}/api/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            })
            if (!response.ok) {
                throw new Error(`Login failed: ${response.status}`)
            }
            const data = await response.json()
            setToken(data.token)
            localStorage.setItem("resumeBuilderToken", data.token)
            alert(data.message)
            setShowLogin(false)
        } catch(error) {
            console.log('Error Fetching login API:', error)
        }
    }
    const handleRegister = async (event) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        const name = formData.get("name")
        const email = formData.get("email")
        const password = formData.get("password")

        try {
            const response = await fetch(`${url}/api/users/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({name, email, password})
            })
            if (!response.ok) {
                throw new Error(`Signup failed: ${response.status}`)
            }
            const data = await response.json()
            setToken(data.token)
            localStorage.setItem("resumeBuilderToken", data.token)
            alert(data.message)
            setShowLogin(false)
        } catch(error) {
            console.log(`Error loading register API: ${error}`)
        }
    }

    return (
        <div 
        className = "text-white fixed top-0 left-0 text-arial bg-white/20 backdrop-blur h-screen w-screen flex flex-col justify-center items-center">
            {!showRegister &&
            <form 
            id = "loginform"
            onSubmit={handleLogin}
            className = {`rounded-2xl bg-black p-10 flex flex-col gap-10 w-1/3 relative items-center`}>
                <h1 className = {`font-extrabold text-4xl`}>Login</h1>
                <div className = "flex items-center gap-3 w-full">
                    <label>Email</label>
                    <input type = "text" 
                    name = "email"
                    className = "p-2 flex-1 rounded-md bg-white/20"/>
                </div>
                <div className = "flex items-center gap-3 w-full">
                    <label>Password</label>
                    <input type = "password" 
                    name = "password"
                    className = "p-2 flex-1 rounded-md bg-white/20"/>
                </div>
                <input type = "submit" className = "py-2 px-3 font-bold text-black rounded-md bg-white"/>
                
                <button 
                onClick = {() => setShowRegister(true)}
                className = "text-white underline">
                    Sign-Up
                </button>

                <button id = "close" 
                onClick={() => setShowLogin(false)}
                className = "absolute right-4 top-4 size-[10%]">
                    <img src = "/closewhite.svg" className = "size-full"/>
                </button>
            </form>
            }
            {showRegister &&
            <form 
            id = "registerform"
            onSubmit={handleRegister}
            className = {`rounded-2xl bg-black p-10 flex flex-col gap-6 w-1/3 relative items-center`}>
                <h1 className = {`font-extrabold text-4xl`}>Signup</h1>
                <div className = "flex flex-col gap-1 w-full">
                    <label>Name</label>
                    <input type = "text" 
                    name = "name"
                    className = "p-2 flex-1 rounded-md bg-white/20"/>
                </div>
                <div className = "flex w-full text-center items-start flex-col gap-1">
                    <label>Email</label>
                    <input type = "text" 
                    name = "email"
                    onChange = {validateEmail}
                    onClick = {() => setEmailTouched(true)}
                    className = "p-2 w-full rounded-md bg-white/20"/>
                    {emailTouched && !validEmail && 
                    <div className = "w-full">
                        Invalid Email
                    </div>
                    }
                </div>
                <div className = "flex flex-col items-start text-center gap-1 w-full">
                    <label>Password</label>
                    <input type = "password" 
                    name = "password"
                    onClick = {() => setPasswordTouched(true)}
                    onChange = {validatePassword}
                    className = "w-full p-2 flex-1 rounded-md bg-white/20"/>
                    {passwordTouched && !validPassword &&
                        <div className = "w-full">
                            Invalid Password
                        </div>
                    }
                </div>
                <input type = "submit" className = "py-2 px-3 font-bold text-black rounded-md bg-white"/>
                <button 
                onClick = {() => {
                    setShowRegister(false);
                    setEmailTouched(false)
                }}
                className = "text-white underline">
                    Login
                </button>
                <button id = "close" 
                onClick={() => {
                    setShowLogin(false);
                    setShowRegister(false)
                    setEmailTouched(false)
                }}
                className = "absolute right-4 top-4 size-[10%]">
                    <img src = "/closewhite.svg" className = "size-full"/>
                </button>
            </form>
            }
        </div>
    )
}


export default Login