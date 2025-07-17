import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase/config';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';

// Static generation functions (getStaticPaths, getStaticProps) are correct and remain the same.
export async function getStaticPaths() {
    const path = require('path');
    const fs = require('fs');
    const filePath = path.join(process.cwd(), 'public', 'projects.json');
    const jsonData = fs.readFileSync(filePath, 'utf8');
    const projects = JSON.parse(jsonData) || [];
    const paths = projects.map(project => ({ params: { id: project.id.toString() } }));
    return { paths, fallback: false };
}
export async function getStaticProps({ params }) {
    const path = require('path');
    const fs = require('fs');
    const filePath = path.join(process.cwd(), 'public', 'projects.json');
    const jsonData = fs.readFileSync(filePath, 'utf8');
    const projects = JSON.parse(jsonData) || [];
    const project = projects.find(p => p.id.toString() === params.id);
    return { props: { project } };
}

export default function ProjectPage({ project }) {
    const { user } = useAuth();
    const [activeMilestoneIndex, setActiveMilestoneIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isCompleted, setIsCompleted] = useState(false);
    
    const [submissionText, setSubmissionText] = useState('');
    const [submissionFile, setSubmissionFile] = useState(null);

    const [aiResult, setAiResult] = useState(null);
    const router = useRouter();

    // The useEffect for loading progress is correct.
    useEffect(() => {
        const loadProgress = async () => {
            if (!user) { setIsLoading(false); return; }
            const completionRef = doc(db, "completions", `${user.uid}_${project.id}`);
            const completionSnap = await getDoc(completionRef);
            if (completionSnap.exists()) {
                setIsCompleted(true);
                setSubmissionText(completionSnap.data().submissionSummary);
                setActiveMilestoneIndex(project.milestones.length - 1);
            } else {
                const progressRef = doc(db, "progress", `${user.uid}_${project.id}`);
                const progressSnap = await getDoc(progressRef);
                if (progressSnap.exists()) {
                    setActiveMilestoneIndex(progressSnap.data().activeMilestoneIndex);
                }
            }
            setIsLoading(false);
        };
        loadProgress();
    }, [user, project.id]);

    const saveProgress = async (newIndex) => {
        if (user) {
            const progressRef = doc(db, "progress", `${user.uid}_${project.id}`);
            await setDoc(progressRef, {
                userId: user.uid,
                projectId: project.id,
                activeMilestoneIndex: newIndex
            });
        }
    };

    const handleMilestoneSelect = (index) => {
        if (!isCompleted) {
            setActiveMilestoneIndex(index);
            saveProgress(index);
        }
    };

    const handleNextMilestone = () => {
        if (activeMilestoneIndex < project.milestones.length - 1) {
            const newIndex = activeMilestoneIndex + 1;
            setActiveMilestoneIndex(newIndex);
            saveProgress(newIndex);
        }
    };

    // --- THIS IS THE FULLY CORRECTED SUBMISSION FUNCTION ---
    const handleFinalSubmit = async () => {
        if (!user) return alert("Please log in to submit.");
        
        let finalSubmissionSummary = submissionText;
        if (submissionFile) {
            finalSubmissionSummary = `File submitted: ${submissionFile.name}. Notes: ${submissionText}`;
        }

        if (finalSubmissionSummary.trim().length < 20) {
            return alert("Please provide a valid URL, file, or a more detailed summary (at least 20 characters).");
        }

        setIsLoading(true);
        setAiResult(null);

        try {
            // 1. CALL THE AI BRAIN (THE BACKEND API)
            const response = await fetch('/api/validate-answer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    studentSummary: finalSubmissionSummary,
                    // We combine all milestone goals to give the AI context of the whole project
                    originalSolution: project.milestones.map(m => m.goal).join(' '),
                }),
            });

            if (!response.ok) {
                throw new Error('The AI server could not be reached. Please try again later.');
            }

            // 2. GET THE AI'S VERDICT FROM THE RESPONSE
            const data = await response.json();
            setAiResult(data); // This makes the verdict appear in the UI

            // 3. ONLY PROCEED IF THE VERDICT IS "Correct"
            if (data.verdict === 'Correct') {
                const completionRef = doc(db, "completions", `${user.uid}_${project.id}`);
                await setDoc(completionRef, {
                    userId: user.uid,
                    projectId: project.id,
                    projectTitle: project.title,
                    submissionSummary: finalSubmissionSummary,
                    completedAt: new Date()
                });

                const progressRef = doc(db, "progress", `${user.uid}_${project.id}`);
                await deleteDoc(progressRef);
                
                setIsCompleted(true);
            }
        } catch (error) {
            console.error("Error submitting project:", error);
            alert(error.message);
        } finally {
            setIsLoading(false);
        }
    };
    
    // The rest of the file (the JSX rendering part) is identical to the last correct version.
    // ... all the JSX from the return statement goes here ...
    const activeMilestone = project.milestones[activeMilestoneIndex];
    const isLastMilestone = activeMilestoneIndex === project.milestones.length - 1;
    const finalSubmissionType = project.milestones[project.milestones.length - 1].submissionType || 'text';

    return (
        <>
            {/* The Navbar is now in _app.js, so we don't need it here */}
            <div className="project-page-container">
                <div className="project-header">
                    <h1>{project.title}</h1>
                    <h3 className="problem-statement-label">Problem Statement</h3>
                    <p className="project-problem-statement" dangerouslySetInnerHTML={{ __html: project.problemStatement.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                    <style jsx>{`
                      .problem-statement-label {
                        font-weight: 700;
                        font-size: 1.1rem;
                        margin-top: 1rem;
                        color: #444;
                      }
                      .project-problem-statement {
                        font-weight: 700;
                        font-size: 1.2rem;
                        color: #222;
                        background-color: #f0f4f8;
                        padding: 1rem;
                        border-radius: 8px;
                        box-shadow: 0 2px 6px rgba(0,0,0,0.1);
                        margin-top: 0.25rem;
                      }
                    `}</style>
                </div>
                <div className="project-page-layout redesigned-layout" style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem' }}>
                    <aside className="milestone-sidebar redesigned-sidebar" style={{ width: '300px', flexShrink: 0, borderRight: '1px solid #ddd', paddingRight: '1rem' }}>
                        <h2 className="sidebar-title">Milestones</h2>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {project.milestones.map((milestone, index) => (
                                <li key={milestone.id} className={`milestone-item ${index < activeMilestoneIndex || isCompleted ? 'completed' : ''} ${index === activeMilestoneIndex ? 'active' : ''}`}
                                    onClick={() => handleMilestoneSelect(index)} style={{ cursor: 'pointer', padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
                                    <div className="milestone-marker" style={{ display: 'inline-block', width: '24px', textAlign: 'center', marginRight: '0.5rem' }}>
                                        {index < activeMilestoneIndex || isCompleted ? <i className="fas fa-check" /> : index + 1}
                                    </div>
                                    <span>{milestone.title}</span>
                                </li>
                            ))}
                        </ul>
                    </aside>

                    <main className="project-main-content redesigned-main-content" style={{ flexGrow: 1, paddingLeft: '1rem' }}>
                        <div className="milestone-card active-card redesigned-milestone-card" style={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', padding: '1.5rem' }}>
                            <div className="milestone-card-header" style={{ borderBottom: '1px solid #eee', marginBottom: '1rem' }}>
                                    <div className="milestone-header-title">
                                        <h3>{activeMilestone.title}</h3>
                                    </div>
                                </div>
                                <div className="milestone-card-body">
                                    <div className="milestone-box goal-box" style={{ marginBottom: '1rem' }}>
                                        <h4>Goal</h4>
                                        <p style={{ fontWeight: '700', fontSize: '1.1rem', color: '#222', backgroundColor: '#f0f4f8', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
                                            {activeMilestone.goal}
                                        </p>
                                    </div>
                                <div className="milestone-box" style={{ marginBottom: '1rem' }}>
                                    <h4>Step-by-Step Instructions</h4>
                                    <p style={{ whiteSpace: 'pre-wrap' }}>{activeMilestone.instructions}</p>
                                </div>

                                <div className="milestone-box example-box" style={{ marginBottom: '1rem' }}>
                                    <h4>Example</h4>
                                    <pre style={{ whiteSpace: 'pre-wrap', backgroundColor: '#e8f0fe', padding: '1rem', borderRadius: '6px', overflowX: 'auto' }}>
                                        {activeMilestone.example || "No example provided for this milestone."}
                                    </pre>
                                </div>

                                <div className="milestone-box constraints-box" style={{ marginBottom: '1rem' }}>
                                    <h4>Constraints</h4>
                                    <p>{activeMilestone.constraints || "No constraints specified for this milestone."}</p>
                                </div>

                                <div className="milestone-box tags-box" style={{ marginBottom: '1rem' }}>
                                    <h4>Tags</h4>
                                    <div className="tags-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                        {(activeMilestone.tags && activeMilestone.tags.length > 0) ? (
                                            activeMilestone.tags.map((tag, idx) => (
                                                <span key={idx} className="tag" style={{ backgroundColor: '#d1e7ff', color: '#0b69ff', padding: '0.3rem 0.7rem', borderRadius: '12px', fontSize: '0.85rem', userSelect: 'none' }}>
                                                    {tag}
                                                </span>
                                            ))
                                        ) : (
                                            <span>No tags available</span>
                                        )}
                                    </div>
                                </div>

                                {activeMilestone.resources && activeMilestone.resources.length > 0 && (
                                    <div className="milestone-box" style={{ marginBottom: '1rem' }}>
                                        <h4>Resources</h4>
                                        <ul>
                                            {activeMilestone.resources.map((resource, idx) => (
                                                <li key={idx}><a href={resource.url} target="_blank" rel="noopener noreferrer">{resource.title}</a></li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {activeMilestone.finalSolution && (
                                    <div className="milestone-box" style={{ marginBottom: '1rem' }}>
                                        <h4>Final Solution</h4>
                                        <pre style={{ whiteSpace: 'pre-wrap', backgroundColor: '#f6f8fa', padding: '1rem', borderRadius: '6px', overflowX: 'auto' }}>
                                            {activeMilestone.finalSolution}
                                        </pre>
                                    </div>
                                )}

                                        {isLastMilestone ? (
                                            isCompleted ? (
                                                <>
                                                    <div className="milestone-box submission-box" style={{ marginBottom: '1rem' }}>
                                                        <h4>Your Completed Submission</h4>
                                                        <p className="completed-submission-text">{submissionText}</p>
                                                    </div>
                                                    <div className="resume-box" style={{ marginBottom: '1rem' }}>
                                                        <h3><i className="fas fa-id-card"></i> Add to Your Resume</h3>
                                                        <p>Congratulations! Copy this text for your resume or LinkedIn.</p>
                                                        <div className="resume-text-content">{project.resumeText}</div>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="milestone-box submission-box" style={{ marginBottom: '1rem' }}>
                                                    <h4>Final Submission & AI Review</h4>

                                            {/* Smart Submission UI */}
                                            {finalSubmissionType === 'file' ? (
                                                <div className="submission-input-group">
                                                    <p>This project requires a file submission (e.g., PDF, ZIP, image).</p>
                                                    <input type="file" onChange={(e) => setSubmissionFile(e.target.files[0])} />
                                                    <textarea placeholder="Add any notes about your submission here..." value={submissionText} onChange={(e) => setSubmissionText(e.target.value)} />
                                                </div>
                                            ) : finalSubmissionType === 'link' ? (
                                                <div className="submission-input-group">
                                                    <p>This project requires a URL submission (e.g., GitHub repo, live website, Figma prototype).</p>
                                                    <input type="url" placeholder="https://github.com/your-username/project" value={submissionText} onChange={(e) => setSubmissionText(e.target.value)} />
                                                </div>
                                            ) : (
                                                <div className="submission-input-group">
                                                    <p>Summarize your complete approach and how you achieved the project goals.</p>
                                                    <textarea placeholder="e.g., I designed the system by first modeling the data schemas..." value={submissionText} onChange={(e) => setSubmissionText(e.target.value)} />
                                                </div>
                                            )}
                                            <button className="btn btn-secondary btn-large" onClick={handleFinalSubmit} disabled={isLoading}>{isLoading ? 'AI is Reviewing...' : 'Submit Project for Review'}</button>

                                            {/* This block will now work correctly */}
                                            {aiResult && (
                                                <>
                                                    <div className={`verdict-box verdict-${aiResult.verdict.toLowerCase()}`}><strong>AI Verdict: {aiResult.verdict}</strong></div>
                                                    {aiResult.verdict === 'Correct' && (
                                                        <div className="resume-box">
                                                            <h3><i className="fas fa-id-card"></i> Add to Your Resume</h3>
                                                            <p>Congratulations! Copy this text for your resume or LinkedIn.</p>
                                                            <div className="resume-text-content">{project.resumeText}</div>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    )
                                ) : (
                                    <div className="milestone-navigation"><button className="btn btn-primary" onClick={handleNextMilestone}>Next Milestone <i className="fas fa-arrow-right"></i></button></div>
                                )}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
