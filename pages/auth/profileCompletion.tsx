import { useSession } from "next-auth/react";
import { FC, useEffect, useState } from "react";
import { useRouter } from "next/router";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { getDistance } from 'geolib';
import Link from "next/link";

const ProfileCompletion: FC = () => {
    const { data: session } = useSession();
    const router = useRouter();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [address, setAddress] = useState('');
    const [addressSuggestions, setAddressSuggestions] = useState<string[]>([]);
    const [phone, setPhone] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (session?.user?.name) {
            const [first, ...rest] = session.user.name.split(' ');
            setFirstName(first || '');
            setLastName(rest.join(' ') || '');
        }
    }, [session]);

    const handleAddressChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setAddress(value);

        if (value) {
            try {
                const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${value}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                const suggestions = data.features.map((feature: { properties: { label: string } }) => feature.properties.label);
                setAddressSuggestions(suggestions);
            } catch (error) {
                console.error("Failed to fetch address suggestions:", error);
                setAddressSuggestions([]);
            }
        } else {
            setAddressSuggestions([]);
        }
    };

    const handleAddressSelect = (suggestion: string) => {
        setAddress(suggestion);
        setAddressSuggestions([]);
    };

    const validateAddress = async (selectedAddress: string) => {
        const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${selectedAddress}`);
        const data = await response.json();

        if (data.features.length > 0) {
            const { geometry } = data.features[0];
            const { coordinates } = geometry;
            const parisCoordinates = { latitude: 48.8566, longitude: 2.3522 };
            const distance = getDistance(
                { latitude: coordinates[1], longitude: coordinates[0] },
                { latitude: parisCoordinates.latitude, longitude: parisCoordinates.longitude }
            );

            const valid = distance <= 50000;
            return valid;
        } else {
            setErrorMessage('Adresse invalide. Veuillez réessayer.');
            return false;
        }
    };


    const validateBirthdate = (date: string) => {
        const currentDate = new Date();
        const inputDate = new Date(date);
        return inputDate <= currentDate;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateBirthdate(birthdate)) {
            setErrorMessage('Date de naissance invalide. Elle ne peut pas être dans le futur.');
            return;
        }

        const isValid = await validateAddress(address);

        if (isValid) {
            const userInfo = {
                firstName,
                lastName,
                birthdate,
                address,
                phone,
                email: session?.user?.email || '',
                image: session?.user?.image || '',
            };

            sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
            router.push('/auth/userProfile');
        } else {
            setErrorMessage(isValid ? '' : 'Votre adresse doit être à moins de 50 km de Paris.');
        }
    };


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
                <div className="max-w-lg p-8 bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
                    <h1 className="text-2xl font-semibold mb-6 text-center">Complétez Votre Profil</h1>
                    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block mb-1" htmlFor="firstName">Prénom</label>
                                <input
                                    id="firstName"
                                    type="text"
                                    placeholder="Prénom"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                    className="p-2 rounded border border-gray-600 bg-gray-700 text-white"
                                />
                            </div>
                            <div>
                                <label className="block mb-1" htmlFor="lastName">Nom</label>
                                <input
                                    id="lastName"
                                    type="text"
                                    placeholder="Nom"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    required
                                    className="p-2 rounded border border-gray-600 bg-gray-700 text-white"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block mb-1" htmlFor="birthdate">Date de Naissance</label>
                            <input
                                id="birthdate"
                                type="date"
                                placeholder="Date de Naissance"
                                value={birthdate}
                                onChange={(e) => setBirthdate(e.target.value)}
                                required
                                className="p-2 rounded border border-gray-600 bg-gray-700 text-white"
                            />
                        </div>
                        <div>
                            <label className="block mb-1" htmlFor="address">Adresse</label>
                            <input
                                id="address"
                                type="text"
                                placeholder="Adresse"
                                value={address}
                                onChange={handleAddressChange}
                                required
                                className="p-2 rounded border border-gray-600 bg-gray-700 text-white"
                            />
                            {addressSuggestions.length > 0 && (
                                <ul className="bg-gray-800 border border-gray-600 mt-1 rounded-md">
                                    {addressSuggestions.map((suggestion) => (
                                        <li
                                            key={suggestion}
                                            onClick={() => handleAddressSelect(suggestion)}
                                            className="p-2 cursor-pointer hover:bg-gray-700"
                                        >
                                            {suggestion}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <div>
                            <label className="block mb-1" htmlFor="phone">Numéro de Téléphone</label>
                            <PhoneInput
                                country={'fr'}
                                value={phone}
                                onChange={setPhone}
                                placeholder="Phone Number"
                                inputStyle={{
                                    width: '100%',
                                    paddingLeft: '48px',
                                    padding: '10px',
                                    borderRadius: '5px',
                                    border: '1px solid #4a5568',
                                    backgroundColor: '#2d3748',
                                    color: 'white',
                                }}
                                buttonStyle={{
                                    backgroundColor: '#4a5568',
                                    border: '1px solid #4a5568'
                                }}
                                dropdownStyle={{
                                    backgroundColor: '#2d3748',
                                    color: 'white'
                                }}
                                containerStyle={{
                                    width: '100%',
                                }}
                            />
                        </div>

                        <button
                            type="submit"
                            className="bg-blue-600 text-white rounded-md p-2 hover:bg-blue-500 transition duration-200"
                        >
                            Soumettre
                        </button>
                        {errorMessage &&
                            <p className="text-red-500 text-center">{errorMessage}</p>} {/* Error message display */}
                    </form>
                </div>
            </main>

            <footer className="bg-gray-800 text-white py-4 text-center">
                <div className="container mx-auto">
                </div>
            </footer>
        </div>);
};

export default ProfileCompletion;
