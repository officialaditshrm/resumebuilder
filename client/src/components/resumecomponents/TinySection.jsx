

function TinySection ({tinysection}) {
    return (
        <div className = 'p-5 flex flex-col px-2 gap-3 items-center'>
            <div className = "tinysectionhead flex gap-2 w-full items-center">
                <label className = "font-bold">
                    Tiny-Section Head:
                </label>
                <input type = "text" className ="p-2 rounded-md flex-1" value={tinysection.head} />
            </div>
            <div className = "tinysectionhead flex flex-col gap-2 items-center w-full">
                <label className = "font-bold">
                    Tiny-Section Content:
                </label>
                <textarea className ="p-2 rounded-md w-full" value={tinysection.content} />
            </div>
        </div>
    )
}

export default TinySection