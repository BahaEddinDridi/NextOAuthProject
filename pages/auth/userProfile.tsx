import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
import Link from "next/link";

const UserProfile = () => {
    const [userInfo, setUserInfo] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const storedUserInfo = sessionStorage.getItem('userInfo');
        if (storedUserInfo) {
            setUserInfo(JSON.parse(storedUserInfo));
        } else {
            router.push('/auth/signin');
        }
    }, [router]);

    if (!userInfo) {
        return <div>Loading...</div>;
    }

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
                <div className="max-w-lg w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6">
                    <div className="flex flex-col items-center">
                        <div className="w-24 h-24 mb-4">
                            <img
                                src={userInfo.image}
                                alt={userInfo.firstName}
                                className="rounded-full object-cover w-full h-full"
                            />
                        </div>
                        <h2 className="text-xl font-semibold mb-1">
                            {userInfo.firstName} {userInfo.lastName}
                        </h2>
                        <p className="text-gray-400 mb-4">
                            {userInfo.email}
                        </p>

                        <div className="w-full text-left mb-4">
                            <p className="text-sm text-gray-400"><strong>Date de Naissance:</strong> {userInfo.birthdate}</p>
                            <p className="text-sm text-gray-400"><strong>Adresse:</strong> {userInfo.address}</p>
                            <p className="text-sm text-gray-400"><strong>Numéro de Téléphone:</strong> + {userInfo.phone}</p>
                        </div>

                        <button
                            onClick={() => signOut({callbackUrl: '/auth/signin'})}
                            className="mt-4 py-2 px-4 w-full bg-blue-600 text-white rounded-md hover:bg-blue-500 transition duration-200"
                        >
                            Se déconnecter
                        </button>
                    </div>
                </div>
            </main>
            <footer className="bg-gray-800 text-white py-4 text-center">
                <div className="container mx-auto">
                </div>
            </footer>
        </div>
    );
};

export default UserProfile;
