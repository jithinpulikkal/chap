import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeOff, Loader2, Lock, Mail, AlertTriangle } from "lucide-react";
import AuthImagePattern from "../components/AuthImagePattern";
import { Link } from "react-router-dom";

const UserVerificationPage = () => {
    const { isLoggingIn, verify } = useAuthStore();
    const [showOtp, setShowOtp] = useState(false);

    const [otp, setOtp] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await verify({ email, otp });
        } catch (err) {
            setError(err.response?.data?.message || "Verification failed. Please try again.");
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* LEFT SIDE */}
            <div className="flex flex-col justify-center items-center p-6 sm:p-12">
                <div className="w-full max-w-md space-y-8">
                    {/* LOGO */}
                    <div className="text-center mb-8">
                        <div className="flex flex-col items-center gap-2 group">
                            <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                <img src="/favicon.png" alt="" className="w-40 text-primary" />
                            </div>
                            <h1 className="text-2xl font-bold mt-2">Account Verification</h1>
                            <p className="text-base-content/60">Enter the OTP sent to your email.</p>
                        </div>
                    </div>

                    {/* FORM */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* EMAIL */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Email</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="size-5 text-base-content/40 z-10" />
                                </div>
                                <input
                                    type="text"
                                    className={`input input-bordered w-full pl-10`}
                                    placeholder="johndoe@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* OTP */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">OTP</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="size-5 text-base-content/40 z-10" />
                                </div>
                                <input
                                    type={showOtp ? "text" : "password"}
                                    className={`input input-bordered w-full pl-10`}
                                    placeholder="* * * * * *"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                />

                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowOtp(!showOtp)}
                                >
                                    {showOtp ? (
                                        <EyeOff className="size-5 text-base-content/40" />
                                    ) : (
                                        <Eye className="size-5 text-base-content/40" />
                                    )}
                                </button>
                            </div>
                        </div>
                        {error && (
                            <div className="alert alert-error">
                                <AlertTriangle className="size-6" />
                                <span>{error}</span>
                            </div>
                        )}

                        <button type="submit" className="btn btn-primary w-full" disabled={isLoggingIn}>
                            {isLoggingIn ? (
                                <>
                                    <Loader2 className="size-5 animate-spin" />
                                    Loading...
                                </>
                            ) : (
                                "Verify"
                            )}
                        </button>
                    </form>

                    <div className="text-center">
                        <p className="text-base-content/60">
                            Don&apos;t have an account?{" "}
                            <Link to="/signup" className="link-primary">
                                Create account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE */}
            <AuthImagePattern
                title="Join our Community"
                subtitle="Connect with friends, and stay in touch with your loved ones"
            />
        </div>
    );
};

export default UserVerificationPage;
