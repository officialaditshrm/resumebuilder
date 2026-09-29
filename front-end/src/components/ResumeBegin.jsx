import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, Field, Notice, Spinner } from './ui.jsx'

function ResumeBegin ({untitledResume, setUntitledResume, createResume, setResumeBegin}) {
    const navigate = useNavigate()
    const [pending, setPending] = useState(false)
    const [error, setError] = useState(null)
    const cancel = () => {if (pending) return; setUntitledResume(null); setResumeBegin(false)}
    const setPrivate = (value) => {const updateUR = {...untitledResume}; updateUR.private = value; setUntitledResume(updateUR)}
    return (
        <Dialog title="New resume" description="You can change all of this later." onClose={cancel} size="md" dismissible={!pending}>
            <form
            onSubmit = {async (event) => {
                event.preventDefault();
                if (pending) return;
                setPending(true);
                setError(null);
                // Stay on this dialog until the server confirms, then move on.
                const created = await createResume(untitledResume);
                setPending(false);
                if (!created) {
                    setError("Couldn't create the resume. Check your connection and try again.");
                    return;
                }
                setUntitledResume(null);
                setResumeBegin(false);
                navigate("/myresumes")
            }}
            className = "flex flex-col gap-5">
                <fieldset disabled = {pending} className = "contents">
                <Field label="Resume name" htmlFor="rb-name" help="Only you see this. Name it after the role, like “Backend internship 2027”.">
                    <input
                    id = "rb-name"
                    autoFocus
                    required
                    type = "text"
                    name = "name"
                    className = "ui-input"
                    value = {untitledResume.name}
                    onChange = {(event) => {const updatedUR = {...untitledResume}; updatedUR.name = event.target.value; setUntitledResume(updatedUR)}}
                    />
                </Field>
                <Field label="Applicant name" htmlFor="rb-username" help="Printed at the top of the resume.">
                    <input
                    id = "rb-username"
                    required
                    type = "text"
                    name = "username"
                    className = "ui-input"
                    value = {untitledResume.username}
                    onChange = {(event) => {const updatedUR = {...untitledResume}; updatedUR.username = event.target.value; setUntitledResume(updatedUR)}}
                    />
                </Field>
                <fieldset>
                    <legend className="ui-label">Who can see it</legend>
                    <div className="grid grid-cols-2 gap-1 p-1 rounded-[10px] bg-ink/[0.06]">
                        {[{value: false, label: 'Public'}, {value: true, label: 'Private'}].map(option => {
                            const selected = Boolean(untitledResume.private) === option.value
                            return (
                                <button
                                key = {option.label}
                                type = "button"
                                aria-pressed = {selected}
                                onClick = {() => setPrivate(option.value)}
                                className = {`h-10 rounded-lg text-[15px] font-semibold ${selected ? 'bg-sheet text-ink shadow-[0_1px_3px_rgba(0,0,0,0.18)]' : 'text-graphite hover:text-ink'}`}>
                                    {option.label}
                                </button>
                            )
                        })}
                    </div>
                    <p className="ui-help mt-2">
                        {untitledResume.private ? "Only you can open it." : "Listed under your name in Community, where anyone can view and copy it."}
                    </p>
                </fieldset>
                </fieldset>
                {error && <Notice tone = "error">{error}</Notice>}
                <div className = "flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-1">
                    <button type = "button" disabled = {pending} className = "ui-btn ui-btn-secondary" id = "cancelresumebegin" onClick={cancel}>
                        Cancel
                    </button>
                    <button type = "submit" disabled = {pending} className = "ui-btn ui-btn-primary min-w-[9.5rem]">
                        {pending ? <><Spinner />Creating…</> : "Create resume"}
                    </button>
                </div>
            </form>
        </Dialog>
    )
}

export default ResumeBegin
