import { signIn } from "next-auth/react";
import { FC } from "react";
import { FcGoogle } from "react-icons/fc";
import Link from 'next/link';

const SignIn: FC = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-900 text-white">
            <nav className="bg-gray-800 text-white py-4 shadow-lg">
                <div className="container mx-auto px-6">
                    <Link href="/">
                        <h1 className="text-2xl font-semibold cursor-pointer">Next.Js OAuth2</h1>
                    </Link>
                </div>
            </nav>
            <main className="flex-grow flex items-center justify-center">
                <div
                    className="max-w-lg p-8 bg-gray-800 border border-gray-700 rounded-lg shadow-lg"
                >
                    <h2 className="text-2xl font-semibold mb-6 text-center">Connecter</h2>
                    <button
                        onClick={() => signIn('google', {callbackUrl: '/auth/profileCompletion'})}
                        className="flex items-center justify-center bg-blue-600 text-white rounded-md p-4 w-full hover:bg-blue-500 transition duration-200"
                    >
                        <FcGoogle style={{marginRight: '8px', fontSize: '24px'}}/>
                        Connecter avec Google
                    </button>
                </div>
            </main>
            <footer className="bg-gray-800 text-white py-4 text-center">
                <div className="container mx-auto">
                </div>
            </footer>
        </div>
    );
};

export default SignIn;
