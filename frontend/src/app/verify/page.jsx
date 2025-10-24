'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function VerifyOTP() {
    const [otp, setOtp] = useState(new Array(6).fill(''));
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const inputRefs = useRef([]);
    const router = useRouter();

    const handleVerify = async () => {
        const code = otp.join('');
        const email = localStorage.getItem('pendingEmail');
        setLoading(true);
        setError('');

        if (code.length === 6 && email) {
            try {
                const res = await fetch('http://localhost:5000/api/auth/verify-otp', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, otp: code }),
                });

                const data = await res.json();
                if (res.ok) {
                    setSuccess(true);
                    setTimeout(() => router.push('/login'), 2000);
                } else {
                    setSuccess(false);
                    setError(data?.message || 'Invalid or expired OTP');
                    setTimeout(() => router.push('/signup'), 1500);
                }
            } catch (err) {
                setSuccess(false);
                setError('Network error. Try again.');
                setTimeout(() => router.push('/signup'), 1500);
            }
        } else {
            setError('Please enter the complete 6-digit OTP.');
        }
        setLoading(false);
    };

    const handleChange = (element, index) => {
        const value = element.value.replace(/[^a-zA-Z0-9]/g, '');
        const newOtp = [...otp];

        if (value) {
            newOtp[index] = value;
            setOtp(newOtp);
            if (index < 5) {
                inputRefs.current[index + 1].focus();
            }
        } else {
            newOtp[index] = '';
            setOtp(newOtp);
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace') {
            if (otp[index]) {
                const newOtp = [...otp];
                newOtp[index] = '';
                setOtp(newOtp);
            } else if (index > 0) {
                inputRefs.current[index - 1].focus();
                const newOtp = [...otp];
                newOtp[index - 1] = '';
                setOtp(newOtp);
            }
        } else if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs.current[index - 1].focus();
        } else if (e.key === 'ArrowRight' && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handlePaste = (e) => {
        const pasteData = e.clipboardData.getData('Text').replace(/[^a-zA-Z0-9]/g, '').slice(0, 6);
        if (pasteData.length) {
            const pasteArr = pasteData.split('');
            const newOtp = [...otp];
            pasteArr.forEach((char, idx) => {
                if (idx < 6) newOtp[idx] = char;
            });
            setOtp(newOtp);
            if (pasteArr.length < 6) {
                inputRefs.current[pasteArr.length].focus();
            } else {
                inputRefs.current[5].focus();
            }
        }
        e.preventDefault();
    };

    const handleResend = async () => {
        setLoading(true);
        setError('');
        const email = localStorage.getItem('pendingEmail');
        try {
            const res = await fetch('/api/auth/resend-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            if (res.ok) {
                alert('OTP resent!');
            } else {
                setError('Failed to resend OTP.');
            }
        } catch {
            setError('Network error. Try again.');
        }
        setLoading(false);
    };

    return (
        <main className="min-h-screen bg-black text-white flex items-center justify-center px-4">
            <div className="bg-gray-900 border border-red-600 rounded-lg p-8 w-full max-w-md shadow-md">
                <h2 className="text-2xl font-bold text-center text-red-600 mb-6">
                    Verify OTP
                </h2>

                <p className="text-gray-400 text-center mb-4">
                    Enter the 6-digit code sent to your email.
                </p>

                <div className="flex justify-center space-x-3 mb-6">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            type="text"
                            maxLength="1"
                            value={digit}
                            onChange={(e) => handleChange(e.target, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            onPaste={index === 0 ? handlePaste : undefined}
                            ref={(el) => (inputRefs.current[index] = el)}
                            className="w-12 h-12 text-center text-xl border border-gray-700 rounded bg-black text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                            pattern="[a-zA-Z0-9]"
                            autoComplete="one-time-code"
                        />
                    ))}
                </div>

                <button
                    onClick={handleVerify}
                    disabled={loading}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded transition mb-3 disabled:opacity-50"
                >
                    {loading ? 'Verifying...' : 'Verify Code'}
                </button>

                {success && (
                    <p className="text-green-400 text-center mt-2">
                        ✅ OTP Verified Successfully!
                    </p>
                )}
                {error && (
                    <p className="text-red-400 text-center mt-2">
                        {error}
                    </p>
                )}

                <p className="text-center text-sm text-gray-500 mt-4">
                    Didn’t get the code?{' '}
                    <span
                        onClick={handleResend}
                        className="text-red-500 hover:underline cursor-pointer"
                    >
                        Resend OTP
                    </span>
                </p>
            </div>
        </main>
    );
}
