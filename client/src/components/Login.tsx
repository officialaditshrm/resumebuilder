import { useState } from 'react'

interface LoginProps {
    setShowLogin: React.Dispatch<React.SetStateAction<boolean>>
}
function Login({setShowLogin}: LoginProps) {
    const [showRegister, setShowRegister] = useState(false)
    const [validEmail, setValidEmail] = useState(false)
    const [emailTouched, setEmailTouched] = useState(false)
    const [validPassword, setValidPassword] = useState(false)
    const [passwordTouched, setPasswordTouched] = useState(false)

    const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
    }

    const handleRegister = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
    }

    const validateEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
        const emailPattern = /^[a-zA-Z0-9.%+_]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        setValidEmail(emailPattern.test(event.target.value))
    }

    const validatePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,}$/
        setValidPassword(passwordPattern.test(event.target.value))
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
                    <input type = "text" className = "p-2 flex-1 rounded-md bg-white/20"/>
                </div>
                <div className = "flex items-center gap-3 w-full">
                    <label>Password</label>
                    <input type = "password" className = "p-2 flex-1 rounded-md bg-white/20"/>
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
                    <input type = "text" className = "p-2 flex-1 rounded-md bg-white/20"/>
                </div>
                <div className = "flex w-full text-center items-start flex-col gap-1">
                    <label>Email</label>
                    <input type = "text" 
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