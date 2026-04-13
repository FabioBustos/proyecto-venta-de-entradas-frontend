import Link from 'next/link';

export default function Home() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6001';
  
  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>Welcome to MVP</h1>
      <p>This is the frontend application running on port 6000</p>
      <div style={{ marginTop: '2rem' }}>
        <h2>Services:</h2>
        <ul>
          <li><Link href={`${apiUrl}/api`}>Backend API</Link></li>
          <li><Link href={`${apiUrl}/api/health`}>Health Check</Link></li>
        </ul>
      </div>
    </main>
  );
}
