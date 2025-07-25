import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase/config';
import { doc, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import Navbar from '../../components/Navbar';
import ChatInterface from '../../components/ChatInterface';

// --- Static Generation Functions (Unchanged) ---
export async function getStaticPaths() {
    const path = require('path');
    const fs = require('fs');
    const filePath = path.join(process.cwd(), 'public', 'projects.json');
    const jsonData = fs.readFileSync(filePath, 'utf8');
    const projects = JSON.parse(jsonData) || [];
    const paths = projects.map(project => ({ params: { id: project.id.toString() } }));
    return { paths, fallback: true };
}

export async function getStaticProps({ params }) {
    const path = require('path');
    const fs = require('fs');
    const filePath = path.join(process.cwd(), 'public', 'projects.json');
    const jsonData = fs.readFileSync(filePath, 'utf8');
    const projects = JSON.parse(jsonData) || [];
    const project = projects.find(p => p.id == params.id);
    if (!project) { return { notFound: true }; }
    return { props: { project }, revalidate: 60 };
}

// --- NEW Content Renderer Component ---
// This component knows how to render different types of content blocks.
const ContentRenderer = ({ block }) => {
    switch (block.type) {
        case 'paragraph':
            return <p style={{ fontSize: '1rem', color: '#4b5563', lineHeight: '1.7', margin: '0 0 16px 0' }}>{block.value}</p>;
        case 'subheader':
            return <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1f2937', margin: '32px 0 16px 0', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px' }}>{block.value}</h3>;
        case 'code':
            return (
                <pre style={{ background: '#1f2937', color: '#e5e7eb', padding: '20px', borderRadius: '10px', margin: '0 0 16px 0', whiteSpace: 'pre-wrap', fontFamily: 'Menlo, Monaco, Consolas, "Courier New", monospace', fontSize: '14px' }}>
                    <code>{block.value}</code>
                </pre>
            );
        case 'image':
            return (
                <img src={block.src} alt={block.alt || 'Project visual'} style={{ maxWidth: '100%', borderRadius: '10px', margin: '16px 0', border: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
            );
        default:
            return null;
    }
};

// --- REDESIGNED Project Components ---

const ProjectHeader = ({ project }) => (
    <div style={{ background: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)', border: '1px solid #e5e7eb', padding: '40px', marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', marginBottom: '24px' }}>
            <div style={{ width: '56px', height: '56px', background: '#3b82f6', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '24px', flexShrink: 0 }}>🚀</div>
            <div style={{ flex: 1 }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#1f2937', margin: 0 }}>{project.title}</h1>
                <p style={{ fontSize: '1.125rem', color: '#6b7280', margin: '8px 0 0 0' }}>{project.tagline}</p>
            </div>
            {project.sourceCodeUrl && (
                <a href={project.sourceCodeUrl} target="_blank" rel="noopener noreferrer" style={{ background: '#f3f4f6', color: '#374151', textDecoration: 'none', padding: '10px 16px', borderRadius: '8px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>View Code</span>
                </a>
            )}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            <span style={{ background: '#3b82f6', color: 'white', padding: '8px 16px', borderRadius: '8px', fontSize: '0.875rem', fontWeight: '500' }}>{project.domain}</span>
            <span style={{ background: '#10b981', color: 'white', padding: '8px 16px', borderRadius: '8px', fontSize: '0.875rem', fontWeight: '500' }}>{project.difficulty}</span>
            <span style={{ background: '#8b5cf6', color: 'white', padding: '8px 16px', borderRadius: '8px', fontSize: '0.875rem', fontWeight: '500' }}>{project.estimatedHours} Hours</span>
        </div>
    </div>
);

const ProjectWorkspace = ({ project, activeMilestoneIndex, onMilestoneSelect, isCompleted, onCompleteProject }) => {
    const [submissionUrl, setSubmissionUrl] = useState('');
    const activeMilestone = project.milestones[activeMilestoneIndex];

    const handleFinalSubmit = () => { if (!submissionUrl || !submissionUrl.startsWith('http')) { alert('Please enter a valid, live URL.'); return; } onCompleteProject(submissionUrl); };
    const getButtonStyle = (index) => { const base = { width: '100%', display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '16px', borderRadius: '10px', border: '1px solid transparent', marginBottom: '8px', textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s ease', background: '#f9fafb', color: '#374151' }; if (index === activeMilestoneIndex) return { ...base, background: '#3b82f6', color: 'white', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)' }; if (index < activeMilestoneIndex || isCompleted) return { ...base, background: '#f0fdf4', color: '#15803d', borderColor: '#bbf7d0' }; return base; };
    const getButtonNumberStyle = (index) => { const base = { width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', fontSize: '14px', flexShrink: 0, marginTop: '2px', transition: 'all 0.2s ease', background: '#e5e7eb', color: '#4b5563' }; if (index === activeMilestoneIndex) return { ...base, background: 'white', color: '#3b82f6' }; if (index < activeMilestoneIndex || isCompleted) return { ...base, background: '#22c55e', color: 'white' }; return base; };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '32px' }}>
            <aside style={{ position: 'sticky', top: '24px', alignSelf: 'start' }}>
                <div style={{ background: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)', border: '1px solid #e5e7eb', padding: '24px' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', margin: 0, marginBottom: '20px' }}>Project Phases</h3>
                    <nav>{project.milestones.map((milestone, index) => (<button key={milestone.id} onClick={() => onMilestoneSelect(index)} style={getButtonStyle(index)}><div style={getButtonNumberStyle(index)}>{index < activeMilestoneIndex || isCompleted ? '✓' : index + 1}</div><span style={{ fontWeight: '500' }}>{milestone.title}</span></button>))}</nav>
                </div>
                {project.resources && project.resources.length > 0 && (
                     <div style={{ background: '#ffffff', borderRadius: '12px', padding: '24px', marginTop: '24px', border: '1px solid #e5e7eb' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', margin: 0, marginBottom: '16px' }}>📚 Further Reading</h3>
                        {project.resources.map(res => (
                            <a key={res.url} href={res.url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', color: '#3b82f6', textDecoration: 'none', marginBottom: '8px' }}>{res.title}</a>
                        ))}
                    </div>
                )}
            </aside>
            <main>
                <div style={{ background: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)', border: '1px solid #e5e7eb', padding: '32px' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937', margin: 0, marginBottom: '12px' }}>{activeMilestone.title}</h2>
                    <div style={{ padding: '16px', background: '#eef2ff', borderRadius: '10px', border: '1px solid #c7d2fe', marginBottom: '24px' }}>
                        <p style={{ fontSize: '1rem', color: '#4338ca', lineHeight: '1.6', margin: 0 }}><strong>🎯 Goal:</strong> {activeMilestone.goal}</p>
                    </div>

                    {/* --- THE NEW RICH CONTENT RENDERER --- */}
                    <div>
                        {activeMilestone.content && activeMilestone.content.map((block, index) => (
                            <ContentRenderer key={index} block={block} />
                        ))}
                    </div>
                    
                    {activeMilestoneIndex === project.milestones.length - 1 && !isCompleted && (
                        <div style={{ marginTop: '32px', padding: '24px', background: '#f0fdf4', borderRadius: '10px', border: '1px solid #86efac' }}>
                            <h4 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#166534', margin: 0, marginBottom: '12px' }}>🚀 Final Step: Deploy & Showcase!</h4>
                            <div>
                                <label>
                                    <input type="radio" value="summary" checked={answerType === 'summary'} onChange={() => setAnswerType('summary')} />
                                    Summary
                                </label>
                                <label>
                                    <input type="radio" value="link" checked={answerType === 'link'} onChange={() => setAnswerType('link')} />
                                    Link
                                </label>
                            </div>
                            {answerType === 'summary' && (
                                <textarea value={submissionSummary} onChange={(e) => setSubmissionSummary(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #a7f3d0' }} />
                            )}
                            {answerType === 'link' && (
                                <input type="url" placeholder="https://my-project.vercel.app" value={submissionUrl} onChange={(e) => setSubmissionUrl(e.target.value)} style={{ flex: 1, padding: '12px 16px', borderRadius: '8px', border: '1px solid #a7f3d0' }} />
                            )}
                            <button onClick={handleFinalSubmit} style={{ background: '#22c55e', color: 'white', fontWeight: '600', padding: '12px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>Submit for Review</button>
                            {validationResult && (
                                <div>
                                    <p>Your score: {validationResult.percentage}%</p>
                                    {validationResult.percentage < 75 && <p>Please try again.</p>}
                                </div>
                            )}
                        </div>
                    )}
                    {isCompleted && (
                        <div style={{ marginTop: '32px', padding: '24px', background: '#f0fdf4', borderRadius: '10px', textAlign: 'center' }}>
                            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
                            <h4 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#166534', margin: 0 }}>Congratulations!</h4>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

// --- Main Page Component ---
export default function ProjectPage({ project }) {
    const router = useRouter();
    const { user } = useAuth();
    
    const [hasStarted, setHasStarted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [activeMilestoneIndex, setActiveMilestoneIndex] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);

    if (router.isFallback || !project) { return ( <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><h2>Loading Project...</h2></div> ); }

    useEffect(() => {
        if (!user) { setIsLoading(false); return; }
        const checkProgress = async () => {
            const completionRef = doc(db, "completions", `${user.uid}_${project.id}`);
            const completionSnap = await getDoc(completionRef);
            if (completionSnap.exists()) {
                setIsCompleted(true); setHasStarted(true); setActiveMilestoneIndex(project.milestones.length - 1);
            } else {
                const progressRef = doc(db, "progress", `${user.uid}_${project.id}`);
                const progressSnap = await getDoc(progressRef);
                if (progressSnap.exists()) { setHasStarted(true); setActiveMilestoneIndex(progressSnap.data().activeMilestoneIndex || 0); }
            }
            setIsLoading(false);
        };
        checkProgress();
    }, [user, project.id]);

    const handleStartProject = async () => { if (!user) { router.push('/login'); return; } setHasStarted(true); setActiveMilestoneIndex(0); const progressRef = doc(db, "progress", `${user.uid}_${project.id}`); await setDoc(progressRef, { activeMilestoneIndex: 0 }); };
    const handleMilestoneSelect = async (index) => { if (isCompleted) return; setActiveMilestoneIndex(index); if (user) { const progressRef = doc(db, "progress", `${user.uid}_${project.id}`); await updateDoc(progressRef, { activeMilestoneIndex: index }); } };
    const handleCompleteProject = async (submissionUrl) => { if (!user) return; setIsCompleted(true); const completionRef = doc(db, "completions", `${user.uid}_${project.id}`); await setDoc(completionRef, { submissionUrl }); const progressRef = doc(db, "progress", `${user.uid}_${project.id}`); await deleteDoc(progressRef); };

    if (isLoading) { return ( <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><h2>Checking your progress...</h2></div> ); }

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '24px 16px' }}>
            <Navbar />
            <div style={{ maxWidth: '1800px', margin: '0 auto' }}>
                <ProjectHeader project={project} />
                
                {/* The new unified view */}
                <ProjectWorkspace
                    project={project}
                    activeMilestoneIndex={activeMilestoneIndex}
                    onMilestoneSelect={handleMilestoneSelect}
                    isCompleted={isCompleted}
                    onCompleteProject={handleCompleteProject}
                />
                
                {/* Community Chat Section */}
                <div style={{ marginTop: '60px', padding: '40px', background: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)', border: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                        <div style={{ width: '48px', height: '48px', background: '#dbeafe', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1e40af', fontSize: '24px' }}>💬</div>
                        <div>
                            <h2 style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937', margin: 0 }}>Community Discussion</h2>
                            <p style={{ color: '#6b7280', margin: '4px 0 0 0' }}>Ask questions, share progress, and get help from other builders working on this project.</p>
                        </div>
                    </div>
                    <ChatInterface channelId={`project_${project.id}`} user={user} />
                </div>
            </div>
        </div>
    );
}