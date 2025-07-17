import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { signInWithEmailAndPassword } from 'firebase/auth';
import SignInWithGoogle from '../components/SignInWithGoogle';
import { auth } from '../firebase/config';
import Navbar from '../components/Navbar';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/');
    } catch (err) { // <-- THIS IS THE CORRECTED LINE
      setError(err.message.replace('Firebase: ', ''));
    }
  };

  return (
    <>
      <Navbar />
      <section>
        <div className="auth-page">
          <div className="auth-container">
            <div className="auth-box">
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <i className="fas fa-user-circle" style={{ 
                  fontSize: '3rem', 
                  background: 'var(--gradient-primary)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  marginBottom: '1rem'
                }}></i>
              </div>
              <h2>Welcome Back</h2>
              <p style={{ color: 'var(--grey-color)', marginBottom: '2rem' }}>
                Sign in to continue building your portfolio.
              </p>
              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label htmlFor="email">
                    <i className="fas fa-envelope" style={{ marginRight: '0.5rem' }}></i>
                    Email
                  </label>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    placeholder="you@example.com"
                    style={{
                      background: 'white',
                      border: '2px solid var(--light-grey)',
                      borderRadius: 'var(--border-radius)',
                      padding: '1rem',
                      fontSize: '1rem',
                      transition: 'var(--transition-smooth)',
                      width: '100%'
                    }}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">
                    <i className="fas fa-lock" style={{ marginRight: '0.5rem' }}></i>
                    Password
                  </label>
                  <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    placeholder="Your password"
                    style={{
                      background: 'white',
                      border: '2px solid var(--light-grey)',
                      borderRadius: 'var(--border-radius)',
                      padding: '1rem',
                      fontSize: '1rem',
                      transition: 'var(--transition-smooth)',
                      width: '100%'
                    }}
                  />
                </div>
                {error && (
                  <div style={{ 
                    background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                    color: 'white',
                    padding: '1rem',
                    borderRadius: 'var(--border-radius)',
                    marginBottom: '1rem',
                    textAlign: 'center',
                    fontWeight: '600'
                  }}>
                    <i className="fas fa-exclamation-triangle" style={{ marginRight: '0.5rem' }}></i>
                    {error}
                  </div>
                )}
                <button type="submit" className="btn btn-primary" style={{ 
                  width: '100%', 
                  marginBottom: '1.5rem',
                  padding: '1rem',
                  fontSize: '1.1rem',
                  fontWeight: '600'
                }}>
                  <i className="fas fa-sign-in-alt" style={{ marginRight: '0.5rem' }}></i>
                  Sign In
                </button>
              </form>

              <div style={{ margin: '1.5rem 0', textAlign: 'center' }}>
                <div style={{ 
                  height: '1px', 
                  background: 'var(--light-grey)', 
                  position: 'relative',
                  margin: '1rem 0'
                }}>
                  <span style={{ 
                    background: 'white', 
                    padding: '0 1rem', 
                    color: 'var(--grey-color)',
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)'
                  }}>
                    or
                  </span>
                </div>
              </div>

              <SignInWithGoogle />

              <p className="auth-switch" style={{ 
                textAlign: 'center', 
                marginTop: '2rem',
                color: 'var(--grey-color)'
              }}>
                Don't have an account? {' '}
                <Link href="/signup" style={{ 
                  background: 'var(--gradient-primary)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textDecoration: 'none',
                  fontWeight: '600'
                }}>
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}