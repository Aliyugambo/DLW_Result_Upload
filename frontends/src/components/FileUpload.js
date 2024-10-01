import React, { useState, useEffect } from 'react';

import axios from 'axios';

import './FileUpload.css';

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    // const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchFiles();
        checkAdminStatus(); // Check if user is logged in as admin
    }, []);

    const checkAdminStatus = () => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAdmin(true); // If token exists, user is an admin
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleFileUpload = async () => {
        if (!file) return alert('Please select a file');

        const formData = new FormData();
        formData.append('file', file);

        try {
            // Make the POST request to upload the file
            const res = await axios.post('https://dlw-result-upload.onrender.com/api/files/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            // Check if the response status is 201 (Created)
            if (res.status === 201) {
                alert('File uploaded successfully');
                setFile(null);  // Reset file input after successful upload
                fetchFiles();    // Fetch the updated list of files
            } else {
                alert(`Error uploading file: ${res.data.message}`);
            }
        } catch (err) {
            // Catch any network or server-related errors
            console.error('Error uploading file', err);
            if (err.response) {
                // If the server responds with an error status
                alert(`Error uploading file: ${err.response.data.message}`);
            } else if (err.request) {
                // If the request was made but no response was received
                alert('Error uploading file: No response received');
            } else {
                // Some other error occurred during request setup
                alert('Error uploading file: ' + err.message);
            }
        }
    };

    const fetchFiles = async () => {
        try {
            const res = await axios.get('https://dlw-result-upload.onrender.com/api/files/upload');
            setUploadedFiles(res.data);
        } catch (err) {
            console.error('Error fetching files', err);
        }
    };

    const handleFileDownload = async (fileId) => {
        const token = localStorage.getItem('token');
        if (!token) return alert('Admin access required for download');

        try {
            const res = await axios.get(`https://dlw-result-upload.onrender.com/api/files/download/${fileId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                responseType: 'blob', // Important to handle file download
            });

            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'file.pdf'); // or use the filename from the response
            document.body.appendChild(link);
            link.click();
        } catch (err) {
            console.error('Error downloading file', err);
            alert('Error downloading file');
        }
    };

    const handleFileEdit = async (fileId, newFilename) => {
        const token = localStorage.getItem('token');
        if (!token) return alert('Admin access required for editing');

        try {
            const res = await axios.put(`https://dlw-result-upload.onrender.com/api/files/edit/${fileId}`, { filename: newFilename }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            alert('File edited successfully');
            fetchFiles(); // Fetch the updated list of files
        } catch (err) {
            console.error('Error editing file', err);
            alert('Error editing file');
        }
    };
    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAdmin(false);
        alert('Logged out successfully');
    };
    return (
        <div className="file-upload-container">
            <h2>Upload a File</h2>
            {/* {isLoading && <p>Uploading file...</p>} */}
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleFileUpload}>Upload File</button>

            <h3>Uploaded Files:</h3>
            <ul>
                {uploadedFiles.map((file) => (
                    <li key={file._id}>
                        {file.filename}
                        {isAdmin && (
                            <>
                                <button onClick={() => handleFileDownload(file._id)}>Download</button>
                                <button onClick={() => handleFileEdit(file._id, prompt('Enter new filename:'))}>Edit</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
            {isAdmin && <button onClick={handleLogout}>Logout</button>}
        </div>
    );
};

export default FileUpload;
