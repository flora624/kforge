import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import Navbar from '../../components/Navbar';
import ProjectCard from '../../components/ProjectCard';

export default function Portfolio() {
  const router = useRouter();
  const { id } = router.query;
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchUserData = async () => {
        const userDoc = await getDoc(doc(db, 'users', id));
        if (userDoc.exists()) {
          setUser(userDoc.data());
          // Assuming completed projects are stored as an array of project IDs
          const completedProjects = userDoc.data().completedProjects || [];
          const projectPromises = completedProjects.map(projectId => getDoc(doc(db, 'projects', projectId)));
          const projectDocs = await Promise.all(projectPromises);
          setProjects(projectDocs.map(doc => ({ id: doc.id, ...doc.data() })));
        }
        setLoading(false);
      };
      fetchUserData();
    }
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <h1>{user.displayName}'s Portfolio</h1>
        <div className="projects-grid">
          {projects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </>
  );
}
