import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Preview from '../components/Preview.jsx';
import HiddenResume from '../components/HiddenResume.jsx'
import html2pdf from 'html2pdf.js';

function Resume({currResumeData, setAiResult, showAllSuggestions, setShowAllSuggestions, handleAIAnalysis, setJobDescription, setCurrResumeData, aiError, aiLoading, aiResult, jobDescription, loggedInUser, updateResume, deleteResume, fetchResumes }) {
    
    const [showDeleteWarning, setShowDeleteWarning] = useState(false);
    const navigate = useNavigate();
    const printRef = useRef();

    useEffect(() => {
        if (!currResumeData) {
            navigate('/');
        }
        setJobDescription('')
        setShowAllSuggestions(false)
        setAiResult(null)
    }, []);


    const handleExportPDF1 = () => {
        const element = printRef.current;
        html2pdf()
            .set({
                margin: [18 , 0, 28, 0], // 0.5 inch bottom margin
                filename: `${currResumeData?.username}_${currResumeData?.name || "resume"}.pdf`,
                image: { type: 'jpeg', quality: 1 },
                html2canvas: {
                    scale: 1.5,
                    useCORS: true
                },
                jsPDF: {
                    unit: 'pt',
                    format: 'a4',
                    orientation: 'portrait'
                }
            })
            .from(element)
            .save()
            .finally(() => {
                // Clean up injected styles
                document.head.removeChild(style);
            }
        );
    };
    
    
    const handleExportPDF2 = () => {
        const element = printRef.current;
        html2pdf()
            .set({
                margin: [18 , 0, 28, 0], // 0.5 inch bottom margin
                filename: `${currResumeData?.username}_${currResumeData?.name || "resume"}.pdf`,
                image: { type: 'jpeg', quality: 1 },
                html2canvas: {
                    scale: 2,
                    useCORS: true
                },
                jsPDF: {
                    unit: 'pt',
                    format: 'a4',
                    orientation: 'portrait'
                }
            })
            .from(element)
            .save()
            .finally(() => {
                // Clean up injected styles
                document.head.removeChild(style);
            }
        );
    };


    const handleExportPDF3 = () => {
        const element = printRef.current;
        html2pdf()
            .set({
                margin: [18 , 0, 28, 0], // 0.5 inch bottom margin
                filename: `${currResumeData?.username}_${currResumeData?.name || "resume"}.pdf`,
                image: { type: 'jpeg', quality: 1 },
                html2canvas: {
                    scale: 3.125,
                    useCORS: true
                },
                jsPDF: {
                    unit: 'pt',
                    format: 'a4',
                    orientation: 'portrait'
                }
            })
            .from(element)
            .save()
            .finally(() => {
                // Clean up injected styles
                document.head.removeChild(style);
            }
        );
    }; 

    return (
        <div className={`md:ml-72 md:mt-[25vh] mt-[20vh] min-h-screen flex flex-col items-center`}>
            {currResumeData && (
                <div className="w-full flex flex-col items-center gap-10 p-5">
                    <div className="w-full relative flex flex-col justify-center items-center">
                        <h1 className="font-extrabold break-all text-3xl max-sm:text-sm">{currResumeData.name}</h1>
                            {loggedInUser && loggedInUser._id === currResumeData.user_id && (
                                <div className="flex items-center p-5 justify-center gap-2">
                                    <button
                                        onClick={() => {
                                            const resumeCopy = { ...currResumeData };
                                            resumeCopy.private = !currResumeData.private;
                                            updateResume(currResumeData._id, resumeCopy);
                                            fetchResumes();
                                            setCurrResumeData(resumeCopy);
                                        }}
                                        className={`w-[50px] shadow-[0_0_3px_1px_rgba(0,0,0,0.25)] rounded-full h-[30px] flex ${
                                            currResumeData.private ? 'bg-green-500' : 'bg-red-500'
                                        } items-center`}
                                    >
                                        <div
                                            className={`${
                                                currResumeData.private && 'translate-x-[20px]'
                                            } rounded-full w-[26px] ml-[2px] h-[26px] bg-white shadow-[0_0_3px_1px_rgba(0,0,0,0.15)]`}
                                        ></div>
                                    </button>
                                    <label className="font-bold text-sm text-neutral-500">
                                        {currResumeData.private ? 'PRIVATE' : 'PUBLIC'}
                                    </label>
                                </div>
                            )}
                            {loggedInUser && loggedInUser._id === currResumeData.user_id && (
                                <button
                                onClick = {() => {navigate("/editResume")}}
                                className="max-sm:text-xs items-center text-white py-2 px-3 font-extrabold flex gap-1 rounded-md bg-blue-900">
                                    <img src="/edit.svg" alt="edit" />
                                    EDIT RESUME
                                </button>
                            )}
                    </div>

                    <label className="text-sm text-neutral-500 font-extrabold">{currResumeData._id}</label>

                    <div className = "hidden">
                        <div
                            ref={printRef}
                            style={{
                                fontFamily: "'Times New Roman', Times, serif",
                                backgroundColor: 'white',
                                boxSizing: 'border-box',
                            }}
                        >
                            <HiddenResume resumeInView={currResumeData} />
                        </div>

                        
                    </div>
                    <div>
                        <div
                            style={{
                                fontFamily: "'Times New Roman', Times, serif",
                                backgroundColor: 'white',
                                boxSizing: 'border-box',
                            }}
                        >
                            <Preview resumeInView={currResumeData} />
                        </div>

                        
                    </div>
                    
                    {/* ATS Analysis Section */}
                    <div className="w-full max-w-2xl bg-zinc-200 dark:bg-zinc-800 rounded-xl shadow p-4 max-sm:p-2 flex flex-col gap-3 border border-blue-200">
                        <h2 className="font-bold text-lg dark:text-blue-200 text-blue-900">ATS & AI Resume Analysis</h2>
                        <textarea
                            className="w-full border p-2 text-black rounded mb-2 text-sm"
                            rows={3}
                            placeholder="Paste job description or title here..."
                            value={jobDescription}
                            onChange={e => setJobDescription(e.target.value)}
                        />
                        <button
                            className="bg-blue-700 text-white px-4 py-2 rounded font-bold disabled:opacity-60"
                            onClick={() => handleAIAnalysis(currResumeData)}
                            disabled={aiLoading || !jobDescription.trim()}
                        >
                            {aiLoading ? 'Analyzing...' : 'Analyze with AI'}
                        </button>
                        {aiError && <div className="text-red-600 text-sm">{aiError}</div>}
                        {aiResult && (
                            <div className="mt-2 text-sm max-sm:text-xs flex flex-col gap-3 items-center">
                                {aiResult.score !== undefined && (
                                    <div className="flex flex-col items-center mb-2">
                                        <div className="relative w-24 h-24 sm:w-32 sm:h-32">
                                            <svg viewBox="0 0 100 100" className="w-full h-full">
                                                <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                                                <circle
                                                    cx="50" cy="50" r="45" fill="none"
                                                    stroke="#2563eb"
                                                    strokeWidth="10"
                                                    strokeDasharray={2 * Math.PI * 45}
                                                    strokeDashoffset={2 * Math.PI * 45 * (1 - aiResult.score / 100)}
                                                    strokeLinecap="round"
                                                    style={{ transition: 'stroke-dashoffset 0.7s' }}
                                                />
                                                <text x="50" y="56" textAnchor="middle" fontSize="2.2em" fontWeight="bold" fill="#2563eb">{aiResult.score}</text>
                                            </svg>
                                        </div>
                                        <div className="font-bold text-lg mt-1">ATS Score</div>
                                    </div>
                                )}
                                {loggedInUser && currResumeData.user_id === loggedInUser._id && !showAllSuggestions && (
                                    <button
                                        className="text-blue-400 font-extrabold underline text-xl mt-1"
                                        onClick={() => setShowAllSuggestions(true)}
                                    >
                                        View more
                                    </button>
                                )}
                                {loggedInUser && currResumeData.user_id === loggedInUser._id && showAllSuggestions && (
                                    <div className="w-full flex flex-col items-center">
                                        {aiResult.missingKeywords && (
                                            <div><b>Missing/Weak Keywords:</b> {aiResult.missingKeywords.join(', ')}</div>
                                        )}
                                        {aiResult.rewrites && aiResult.rewrites.length > 0 && (
                                            <div className="mt-2">
                                                <b>Suggested Rewrites:</b>
                                                <ul className="list-disc pl-5">
                                                    {aiResult.rewrites.map((rw, i) => (
                                                        <li key={i}><span className="text-red-600">Old:</span> {rw.old}<br /><span className="text-green-700">New:</span> {rw.new}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        {aiResult.suggestions && aiResult.suggestions.length > 0 && (
                                            <div className="mt-2">
                                                <b>Suggestions:</b>
                                                <ul className="list-disc pl-5">
                                                    {aiResult.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                                                </ul>
                                            </div>
                                        )}
                                        {aiResult.raw && (
                                            <div className="mt-2 text-xs text-gray-500 whitespace-pre-wrap">{aiResult.raw}</div>
                                        )}
                                        <button
                                            className="text-blue-400 font-extrabold underline text-xl mt-2"
                                            onClick={() => setShowAllSuggestions(false)}
                                        >
                                            View less
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {loggedInUser._id === currResumeData.user_id && <div className = "w-full flex flex-col gap-4 bg-sky-900 p-5 rounded-xl items-center">
                        <h1 className = "text-2xl text-sky-100 font-extrabold">Download</h1>
                        <div className = "flex flex-wrap justify-evenly w-full">
                            <button
                                onClick={handleExportPDF1}
                                className="mt-4 font-bold bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Low Resolution
                            </button>
                            <button
                                onClick={handleExportPDF2}
                                className="mt-4 font-bold bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Decent Resolution
                            </button>
                            <button
                                onClick={handleExportPDF3}
                                className="mt-4 font-bold bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                High Resolution
                            </button>
                        </div>
                    </div>}

                    

                    {loggedInUser && loggedInUser._id === currResumeData.user_id && (
                        <button
                            onClick={() => setShowDeleteWarning(true)}
                            className="max-sm:text-xs text-white py-2 px-3 font-extrabold flex gap-1 rounded-md bg-red-900"
                        >
                            DELETE RESUME
                        </button>
                    )}
                </div>
            )}

            {showDeleteWarning && (
                <DeleteWarning
                    navigate={navigate}
                    deleteResume={deleteResume}
                    id={currResumeData._id}
                    setShowDeleteWarning={setShowDeleteWarning}
                />
            )}
        </div>
    );
}

export default Resume;

function DeleteWarning({ deleteResume, navigate, setShowDeleteWarning, id }) {
    return (
        <div className="bg-neutral-100/50 backdrop-blur-sm fixed top-0 bottom-0 left-0 right-0 z-50 flex flex-col items-center justify-center">
            <div className="rounded-xl flex flex-col gap-8 bg-neutral-100 p-10 shadow-[0_0_10px_1px_rgba(0,0,0,0.25)]">
                <p className="text-xl">Are you sure you want to delete this Resume?</p>
                <div className="w-full flex justify-evenly items-center">
                    <button
                        onClick={() => {
                            deleteResume(id);
                            navigate('/');
                            setShowDeleteWarning(false);
                        }}
                        className="rounded-md bg-red-600 text-white px-3 py-2 font-bold"
                    >
                        DELETE
                    </button>
                    <button
                        onClick={() => setShowDeleteWarning(false)}
                        className="rounded-md bg-neutral-600 text-white px-3 py-2 font-bold"
                    >
                        CANCEL
                    </button>
                </div>
            </div>
        </div>
    );
}
