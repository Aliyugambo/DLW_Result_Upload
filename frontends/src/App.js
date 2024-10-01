import React from 'react';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import FileUpload from './components/FileUpload';
import Login from './components/Login';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<FileUpload />} />
                <Route path="/files" element={<FileUpload />} />
                <Route path="/admin/login" element={<Login />} />
            </Routes>
        </Router>
    );
}

export default App;
