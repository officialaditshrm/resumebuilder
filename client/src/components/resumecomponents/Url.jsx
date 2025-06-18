

function Url ({url}) {
    return (
        <div className = "relative flex flex-col gap-3 p-5">
            <div className = "urlname flex gap-2 items-center">
                <label className = "font-bold">URL Name:</label>
                <input name = "name" type = "text" placeholder = "LinkedIn" value = {url.name} className = "flex-1 p-2 rounded-md"/>
            </div>
            <div className = "urllink flex gap-2 items-start">
                <label className = "font-bold">URL link:</label>
                <textarea name = "name" placeholder = "https://linkedin.com/in/aditshrm" value = {url.url} className = "p-2 flex-1 rounded-md"/>
            </div>
        </div>
    )
}

export default Url