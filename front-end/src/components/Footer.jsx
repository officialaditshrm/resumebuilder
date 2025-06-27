function Footer () {
    return (
        <div className = "sm:p-10 dark:text-black dark:bg-sky-200 max-sm:text-sm p-4 bg-sky-950 text-neutral-100 gap-4 flex flex-col justify-center items-center shadow-[0_-2px_5px_1px_rgba(0,0,0,0.15)]">
            <p>Version 1.0.0</p>
            <p>Provide your feedback at <a href = "https://docs.google.com/forms/d/1nrMo-pQyDj7xVBtlR6fEyH4dOeR_JL1UXcFht_b6rFc/preview">Feedback</a></p>
            <p className = "break-words">
                &copy; Aditya Sharma {new Date().toLocaleDateString("en-IN", {
                year: "numeric"
            })}
            </p>
            <p className = "break-words">More from the Creator: <a className = "font-bold hover:underline" href = "https://officialaditshrm.github.io/portfolio" target = "_blank">Portfolio</a></p>
            
        </div>
    )
}

export default Footer