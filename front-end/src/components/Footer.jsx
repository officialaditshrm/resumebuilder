function Footer () {
    return (
        <div className = "sm:p-10 p-4 bg-zinc-800 text-neutral-100 gap-4 flex flex-col justify-center items-center shadow-[0_-2px_5px_1px_rgba(0,0,0,0.15)]">
            <p className = "break-all">
                &copy; Aditya Sharma {new Date().toLocaleDateString("en-IN", {
                year: "numeric"
            })}
            </p>
            <p className = "break-all">More from the Creator: <a className = "font-bold hover:underline" href = "https://officialaditshrm.github.io/portfolio" target = "_blank">Portfolio</a></p>
        </div>
    )
}

export default Footer