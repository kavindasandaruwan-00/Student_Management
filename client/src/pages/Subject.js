import React, { useState, useEffect } from 'react';
import { Button, Container, Table, Card, InputGroup, Form, Modal, Toast, ToastContainer } from 'react-bootstrap';
import axios from 'axios';

export default function Subject() {
    const [subjects, setSubjects] = useState([]);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({ Subject_key: '', Subject_name: '' });
    const [toast, setToast] = useState({ show: false, message: '', bg: '' });

    const fetchSubjects = async () => {
        try {
            const res = await axios.get('https://student-management-5yl2.onrender.com/api/subjects');
            setSubjects(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => { fetchSubjects(); }, []);

    const handleShow = () => setShowModal(true);
    const handleClose = () => {
        setShowModal(false);
        setEditId(null);
        setFormData({ Subject_key: '', Subject_name: '' });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                await axios.put(`https://student-management-5yl2.onrender.com/api/subjects/${editId}`, formData);
                setToast({ show: true, message: 'Subject updated successfully', bg: 'success' });
            } else {
                await axios.post('https://student-management-5yl2.onrender.com/api/subjects', formData);
                setToast({ show: true, message: 'Subject added successfully', bg: 'success' });
            }
            handleClose();
            fetchSubjects();
        } catch (err) {
            setToast({ show: true, message: 'Error saving subject', bg: 'danger' });
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to Delete this subject?')) {
            try {
                await axios.delete(`https://student-management-5yl2.onrender.com/api/subjects/${id}`);
                setToast({ show: true, message: 'Subject deleted successfully', bg: 'success' });
                fetchSubjects();
            } catch (err) {
                setToast({ show: true, message: 'Error deleting subject', bg: 'danger' });
            }
        }
    };

    const handleEdit = (subject) => {
        setEditId(subject._id);
        setFormData({ Subject_key: subject.Subject_key, Subject_name: subject.Subject_name });
        setShowModal(true);
    };

    const filteredSubjects = subjects.filter(sub =>
        sub.Subject_name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Container style={{ marginTop: '3%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Card style={{ width: '90%', padding: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', borderRadius: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ color: '#1e3a8a', fontWeight: 600 }}>📘 Subjects</h2>
                    <Button variant="success" onClick={handleShow}>+ Add New Subject</Button>
                </div>

                <Table striped bordered hover responsive>
                    <thead style={{ backgroundColor: '#1e3a8a', color: 'white', textAlign: 'center' }}>
                        <tr>
                            <th>Subject Key</th>
                            <th>Subject Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody style={{ textAlign: 'center' }}>
                        {filteredSubjects.map(sub => (
                            <tr key={sub._id}>
                                <td>{sub.Subject_key}</td>
                                <td>{sub.Subject_name}</td>
                                <td>
                                    <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEdit(sub)}>Edit</Button>
                                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(sub._id)}>Delete</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Card>

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{editId ? 'Edit Subject' : 'Add New Subject'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Subject Key</Form.Label>
                            <Form.Control type="text" name="Subject_key" value={formData.Subject_key} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Subject Name</Form.Label>
                            <Form.Control type="text" name="Subject_name" value={formData.Subject_name} onChange={handleChange} required />
                        </Form.Group>
                        <Button variant="primary" type="submit">{editId ? 'Update Subject' : 'Add Subject'}</Button>
                    </Form>
                </Modal.Body>
            </Modal>

            <ToastContainer position="top-end" className="p-3">
                <Toast show={toast.show} bg={toast.bg} onClose={() => setToast({ ...toast, show: false })} delay={3000} autohide>
                    <Toast.Body style={{ color: 'white' }}>{toast.message}</Toast.Body>
                </Toast>
            </ToastContainer>
        </Container>
    );
}
