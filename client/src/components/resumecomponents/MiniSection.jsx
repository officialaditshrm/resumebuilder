

function MiniSection ({minisection}) {
    return (
        <div className = 'p-5 flex flex-col px-2 gap-3 items-center'>
            <div className = "minisectionhead flex gap-2 w-full items-center">
                <label className = "font-bold">
                    Mini-Section Head:
                </label>
                <input type = "text" className ="p-2 rounded-md flex-1" value={minisection.head} />
            </div>
            <div className = "minisectionhead flex flex-col gap-2 items-center w-full">
                <label className = "font-bold">
                    Mini-Section Content:
                </label>
                <textarea className ="p-2 rounded-md w-full" value={minisection.content} />
            </div>
        </div>
    )
}

export default MiniSection