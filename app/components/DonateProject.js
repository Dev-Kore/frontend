import { useState, useEffect } from 'react';
import { useContractOperations } from '../hooks/useContractOperations';

export default function DonateProject({ projectId }) {
    const { donateToProject, getProjectDetails, getDonationHistory, loading, error } = useContractOperations();
    const [amount, setAmount] = useState('');
    const [project, setProject] = useState(null);
    const [donations, setDonations] = useState([]);

    useEffect(() => {
        loadProjectData();
    }, [projectId]);

    const loadProjectData = async () => {
        const projectData = await getProjectDetails(projectId);
        setProject(projectData);
        const donationHistory = await getDonationHistory(projectId);
        setDonations(donationHistory);
    };

    const handleDonate = async (e) => {
        e.preventDefault();
        const success = await donateToProject(projectId, amount);
        if (success) {
            setAmount('');
            await loadProjectData(); // Refresh data
        }
    };

    if (!project) return <div>Loading project...</div>;

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="bg-white shadow rounded-lg p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4">{project.name}</h2>
                <p className="text-gray-600 mb-4">{project.description}</p>
                <p className="text-sm text-gray-500">
                    Total Donations: {project.totalDonations} ETH
                </p>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleDonate} className="bg-white shadow rounded-lg p-6 mb-6">
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                        Donation Amount (ETH)
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                        loading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                    {loading ? 'Processing...' : 'Donate'}
                </button>
            </form>

            <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Donation History</h3>
                <div className="space-y-4">
                    {donations.map((donation, index) => (
                        <div key={index} className="border-b pb-4">
                            <p className="text-sm text-gray-600">
                                From: {donation.donor}
                            </p>
                            <p className="text-sm text-gray-600">
                                Amount: {donation.amount} ETH
                            </p>
                            <p className="text-sm text-gray-500">
                                {donation.timestamp.toLocaleString()}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
