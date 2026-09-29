function Footer () {
    return (
        <footer className="ui md:pl-72 border-t border-rule bg-canvas text-ink">
            <div className="px-5 sm:px-8 lg:px-14 py-12 flex flex-col gap-8">
                <p className="font-extrabold tracking-[-0.03em] leading-[1.05] text-[clamp(1.5rem,1.1rem+1.6vw,2.25rem)] max-w-[28ch]">
                    Thank you for making this useful to yourself - Adi
                </p>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-graphite">
                    <a className="ui-link text-ink" href="https://docs.google.com/forms/d/1nrMo-pQyDj7xVBtlR6fEyH4dOeR_JL1UXcFht_b6rFc/preview" target="_blank" rel="noreferrer">Send feedback</a>
                    <a className="ui-link text-ink" href="https://aditya-sharma-webportfolio.vercel.app" target="_blank" rel="noreferrer">More from the creator</a>
                    <span>&copy; Aditya Sharma {new Date().toLocaleDateString("en-IN", { year: "numeric" })}</span>
                    <span>Version 1.3.0</span>
                </div>
            </div>
        </footer>
    )
}

export default Footer
