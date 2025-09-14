import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <div className="max-w-5xl w-full text-center">
        <h1 className="text-4xl font-bold mb-6">Investment Portfolio Tracker</h1>
        <p className="text-xl mb-8">Track and manage your investments with ease</p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/login" 
            className="px-6 py-3 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Login
          </Link>
          <Link 
            href="/register" 
            className="px-6 py-3 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/90"
          >
            Register
          </Link>
        </div>
      </div>
    </main>
  );
}
