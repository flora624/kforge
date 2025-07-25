import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth } from '../firebase/config';
import Navbar from '../components/Navbar';
import ProjectCard from '../components/ProjectCard';

export async function getStaticProps() {
  const path = require('path');
  const fs = require('fs');
  const filePath = path.join(process.cwd(), 'public', 'projects.json');
  const jsonData = fs.readFileSync(filePath);
  const allProjects = JSON.parse(jsonData);
  return { props: { allProjects } };
}

export default function Profile({ allProjects }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [completedProjects, setCompletedProjects] = useState([]);
  const [inProgressProjects, setInProgressProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchUserProjects = async () => {
      try {
        // Fetch Completed Projects
        const completionsQuery = query(collection(db, 'completions'), where('userId', '==', user.uid));
        const completionSnap = await getDocs(completionsQuery);
        const completedData = completionSnap.docs.map(doc => ({ ...doc.data(), id: doc.data().projectId }));
        setCompletedProjects(completedData);

        // Fetch In-Progress Projects
        const progressQuery = query(collection(db, 'progress'), where('userId', '==', user.uid));
        const progressSnap = await getDocs(progressQuery);
        const inProgressIds = progressSnap.docs.map(doc => doc.data().projectId);
        const inProgressData = allProjects.filter(project => inProgressIds.includes(project.id));
        setInProgressProjects(inProgressData);

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching user projects:', error);
        setIsLoading(false);
      }
    };

    fetchUserProjects();
  }, [user, loading, router, allProjects]);

  if (loading || isLoading) {
    return <div className="loading-screen">Loading Dashboard...</div>;
  }

  // --- THIS IS THE CORRECTED SHARE FUNCTION ---
  const handleShare = (userId, projectId) => {
    // We construct the correct URL for our new share page
    const shareableLink = `${window.location.origin}/share/${userId}/${projectId}`;
    navigator.clipboard.writeText(shareableLink);
    alert('Shareable link copied to clipboard!');
  };

  return (
    <>
      <Navbar />
      <main className="container">
        <section className="dashboard-header">
          <h1>My Dashboard</h1>
          <p>Welcome back, <strong>{user?.email || ''}</strong>!</p>
          <Link href={`/portfolio/${user?.uid}`}>
            <a className="btn btn-primary">View My Portfolio</a>
          </Link>
          <button onClick={handleLogout} className="btn btn-logout" style={{marginTop: '10px'}}>
            Logout
          </button>
        </section>

        <section className="dashboard-content">
          <h2>In Progress</h2>
          {inProgressProjects.length > 0 ? (
            <div className="dashboard-grid">
              {inProgressProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  actionButtons={[
                    {
                      label: 'Resume Project',
                      onClick: () => router.push(`/project/${project.id}`),
                      className: 'btn-primary',
                    },
                  ]}
                />
              ))}
            </div>
          ) : (
            <p className="no-projects-message">No projects in progress. <Link href="/#projects">Find a new challenge!</Link></p>
          )}
        </section>

        <section className="dashboard-content">
          <h2>Completed</h2>
          {completedProjects.length > 0 ? (
            <div className="dashboard-grid">
              {completedProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  actionButtons={[
                    {
                      label: 'Share',
                      onClick: () => handleShare(user.uid, project.id),
                    },
                    {
                      label: 'View',
                      onClick: () => router.push(`/project/${project.id}`),
                      className: 'btn-secondary',
                    },
                  ]}
                />
              ))}
            </div>
          ) : (
            <p className="no-projects-message">You haven't completed any projects yet.</p>
          )}
        </section>
      </main>
    </>
  );
}
