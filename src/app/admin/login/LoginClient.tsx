'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';


export function AdminLoginClient() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@amanamart.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {

    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push('/admin');
        router.refresh();
      }
    } catch (err: any) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex">
      {/* Left — Brand Panel */}
      <div className="hidden lg:flex flex-col items-center justify-center w-[480px] shrink-0 bg-[var(--secondary)] text-white p-12">
        <div className="text-center">
          <div className="w-20 h-20 rounded-[var(--radius-xl)] bg-white/10 flex items-center justify-center text-white font-black text-3xl mx-auto mb-6">
            AM
          </div>
          <h1 className="text-3xl font-bold mb-3">Amana Mart</h1>
          <p className="text-white/70 text-[15px] leading-relaxed mb-8">
            Bangladesh&apos;s leading multi-module marketplace platform for groceries, pharmacy, ecommerce, food delivery, and more.
          </p>

          <div className="grid grid-cols-2 gap-4 text-left">
            {[
              { label: 'Products', value: '2,847+' },
              { label: 'Active Stores', value: '347+' },
              { label: 'Customers', value: '38K+' },
              { label: 'Orders', value: '14K+' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/10 rounded-[var(--radius-md)] p-4">
                <p className="text-xl font-bold">{stat.value}</p>
                <p className="text-[12px] text-white/60 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — Login Form */}
      <div className="flex-1 flex items-center justify-center bg-[var(--page-background)] p-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-[var(--radius-md)] bg-[var(--primary)] flex items-center justify-center text-white font-bold text-sm">
              AM
            </div>
            <p className="text-[16px] font-bold text-[var(--foreground)]">Amana Mart Admin</p>
          </div>

          <div className="bg-white rounded-[var(--radius-xl)] border border-[var(--border)] shadow-[var(--shadow-lg)] p-8">
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-5 h-5 text-[var(--primary)]" />
              <h2 className="text-[20px] font-bold text-[var(--foreground)]">Admin Sign In</h2>
            </div>
            <p className="text-[13px] text-[var(--muted-foreground)] mb-6">Sign in to access the admin dashboard</p>

            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                id="admin-email"
                label="Email Address"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4" />}
                placeholder="admin@amanamart.com"
              />
              <Input
                id="admin-password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4" />}
                rightIcon={
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="hover:text-[var(--foreground)] transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                placeholder="Enter your password"
                error={error}
              />
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-[var(--border)] accent-[var(--primary)]" />
                  <span className="text-[13px] text-[var(--foreground)]">Remember me</span>
                </label>
                <button type="button" className="text-[13px] text-[var(--primary)] hover:underline">
                  Forgot password?
                </button>
              </div>
              <Button
                type="submit"
                variant="secondary"
                size="lg"
                fullWidth
                loading={loading}
              >
                Sign In to Admin Panel
              </Button>
            </form>

            <div className="mt-4 p-3 bg-[var(--muted)] rounded-[var(--radius-md)]">
              <p className="text-[12px] text-[var(--muted-foreground)] font-medium">Demo credentials:</p>
              <p className="text-[12px] text-[var(--muted-foreground)] mt-0.5">Email: admin@amanamart.com · Password: admin123</p>
            </div>

            <div className="mt-4 text-center">
              <Link href="/store" className="text-[13px] text-[var(--primary)] hover:underline">
                ← Back to Storefront
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
