'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Login.module.scss';
import { FiUser, FiLock, FiEyeOff } from 'react-icons/fi';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (data.success) {
        router.push('/gallery');
      } else {
        setError(data.error || 'Incorrect password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>

      <main className={styles.loginCard}>
        <div className={styles.characterHeader}>
          {/* We crop the generated image into a nice circle floating above the card */}
          <img src="/login-character.png" alt="Welcome Character" />
        </div>

        <div className={styles.titleArea}>
          <h1>Welcome Back!</h1>
          <p>Login to continue</p>
        </div>
        
        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Dummy field for aesthetics to match the design */}
          <div className={styles.inputGroup}>
            <FiUser className={styles.icon} />
            <input
              type="text"
              placeholder="Username / Email"
              disabled={loading}
              value="Guest"
              readOnly
            />
          </div>

          <div className={styles.inputGroup}>
            <FiLock className={styles.icon} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            <FiEyeOff className={styles.icon} style={{ position: 'absolute', right: '5px', margin: 0, cursor: 'pointer' }} />
          </div>

          <div className={styles.forgotText}>Forgot Password?</div>

          {error && <div className={styles.error}>{error}</div>}
          
          <button type="submit" disabled={loading || !password}>
            {loading ? 'Entering...' : 'Login'}
          </button>
        </form>

        <div className={styles.orDivider}>
          or continue with
        </div>
      </main>
    </div>
  );
}
