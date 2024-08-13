import React, { useEffect, useState } from "react";
import axios from "axios";
import './SuperadminDashboard.css'; // Custom styles for the Superadmin dashboard

const SuperadminDashboard = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:3000/api/superadmin/users")
            .then(response => setUsers(response.data))
            .catch(error => console.error("Error fetching users:", error));
    }, []);

    const handleApprove = (id) => {
        axios.post(`http://localhost:3000/api/superadmin/approve/${id}`)
            .then(response => setUsers(users.map(user => user.id === id ? response.data : user)))
            .catch(error => console.error("Error approving user:", error));
    };

    const handleBlock = (id) => {
        axios.post(`http://localhost:3000/api/superadmin/block/${id}`)
            .then(response => setUsers(users.map(user => user.id === id ? response.data : user)))
            .catch(error => console.error("Error blocking user:", error));
    };

    const handleUnblock = (id) => {
        axios.post(`http://localhost:3000/api/superadmin/unblock/${id}`)
            .then(response => setUsers(users.map(user => user.id === id ? response.data : user)))
            .catch(error => console.error("Error unblocking user:", error));
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Superadmin Dashboard</h1>
            <table className="table table-striped table-bordered">
                <thead className="thead-dark">
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.isApproved ? "Approved" : "Pending"} - {user.isBlocked ? "Blocked" : "Active"}</td>
                            <td>
                                <button className="btn btn-success btn-sm" onClick={() => handleApprove(user.id)}>Approve</button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleBlock(user.id)}>Block</button>
                                <button className="btn btn-warning btn-sm" onClick={() => handleUnblock(user.id)}>Unblock</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SuperadminDashboard;
