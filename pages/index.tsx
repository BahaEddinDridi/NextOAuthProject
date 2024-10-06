import { FC } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

const HomePage: FC = () => {
    const router = useRouter();

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
                <div className="max-w-lg w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6 flex flex-col items-center">
                    <h2 className="text-xl mb-4">Bienvenue dans notre application !</h2>
                    <button
                        onClick={() => router.push('/auth/userProfile')}
                        className="bg-blue-600 text-white rounded-md p-2 hover:bg-blue-500 transition duration-200"
                    >
                        Accéder à mon profil
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

export default HomePage;
