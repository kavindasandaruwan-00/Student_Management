import React, { useState, useEffect } from 'react';
import { Button, Container, Table, Card, InputGroup, Form, Modal, Toast, ToastContainer } from 'react-bootstrap';
import axios from 'axios';

export default function Student() {
    const [students, setStudents] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('All'); // Added filter state
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({
        Student_key: '',
        Student_name: '',
        Subject_key: '',
        Grade: '',
        Remarks: ''
    });
    const [toast, setToast] = useState({ show: false, message: '', bg: 'success' });

    const fetchStudents = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/students');
            setStudents(response.data);
        } catch (err) {
            console.error('Error fetching students:', err);
        }
    };

    const fetchSubjects = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/subjects');
            setSubjects(res.data);
        } catch (err) {
            console.error('Error fetching subjects:', err);
        }
    };

    useEffect(() => {
        fetchStudents();
        fetchSubjects();
    }, []);

    const handleShow = () => setShowModal(true);

    const handleClose = () => {
        setShowModal(false);
        setEditId(null);
        setFormData({ Student_key: '', Student_name: '', Subject_key: '', Grade: '', Remarks: '' });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const showToast = (message, bg = 'success') => {
        setToast({ show: true, message, bg });
        setTimeout(() => setToast({ ...toast, show: false }), 3000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                await axios.put(`http://localhost:8080/api/students/${editId}`, formData);
                showToast('Student Updated Successfully!');
            } else {
                await axios.post('http://localhost:8080/api/students', formData);
                showToast('Student Added Successfully!');
            }
            handleClose();
            fetchStudents();
        } catch (err) {
            showToast('Error saving student.', 'danger');
            console.log('Error saving student:', err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            try {
                await axios.delete(`http://localhost:8080/api/students/${id}`);
                fetchStudents();
                showToast('Student Deleted Successfully!');
            } catch (err) {
                showToast('Error deleting student.', 'danger');
                console.error('Error deleting student:', err);
            }
        }
    };

    const handleEdit = (student) => {
        setEditId(student._id);
        setFormData({
            Student_key: student.Student_key,
            Student_name: student.Student_name,
            Subject_key: student.Subject_key,
            Grade: student.Grade,
            Remarks: student.Remarks
        });
        setShowModal(true);
    };

    const filteredStudents = students
        .filter(student =>
            student.Student_name.toLowerCase().includes(search.toLowerCase())
        )
        .filter(student =>
            filter === 'All' ? true : student.Remarks === filter
        );

    return (
        <Container style={{ marginTop: '3%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Card style={{ width: '90%', padding: '30px', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)', borderRadius: '20px', backgroundColor: '#ffffff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ fontWeight: '600', color: '#1e3a8a' }}>🎓 Student Management</h2>
                    <Button variant="success" style={{ fontWeight: 500 }} onClick={handleShow}>+ Add New</Button>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                    <InputGroup style={{ maxWidth: '400px' }}>
                        <Form.Control
                            placeholder="Search by student name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Button variant="primary">Search</Button>
                    </InputGroup>

                    <Form.Select style={{ maxWidth: '150px' }} value={filter} onChange={(e) => setFilter(e.target.value)}>
                        <option value="All">All</option>
                        <option value="PASS">PASS</option>
                        <option value="FAIL">FAIL</option>
                    </Form.Select>
                </div>

                <Table striped bordered hover responsive>
                    <thead style={{ backgroundColor: '#1e3a8a', color: 'white', textAlign: 'center' }}>
                        <tr>
                            <th>Student Name</th>
                            <th>Subject Name</th>
                            <th>Grade</th>
                            <th>Remarks</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                        {filteredStudents.map(student => {
                            const subject = subjects.find(sub => sub.Subject_key === student.Subject_key);
                            const subjectName = subject ? subject.Subject_name : student.Subject_key;
                            return (
                                <tr key={student._id}>
                                    <td>{student.Student_name}</td>
                                    <td>{subjectName}</td>
                                    <td>{student.Grade}</td>
                                    <td>{student.Remarks}</td>
                                    <td>
                                        <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEdit(student)}>Edit</Button>
                                        <Button variant="outline-danger" size="sm" onClick={() => handleDelete(student._id)}>Delete</Button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            </Card>

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{editId ? 'Edit Student' : 'Add New Student'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="Student_key">
                            <Form.Label>Student Key</Form.Label>
                            <Form.Control type="text" name="Student_key" value={formData.Student_key} onChange={handleChange} required />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="Student_name">
                            <Form.Label>Student Name</Form.Label>
                            <Form.Control type="text" name="Student_name" value={formData.Student_name} onChange={handleChange} required />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="Subject_key">
                            <Form.Label>Subject Name</Form.Label>
                            <Form.Select name="Subject_key" value={formData.Subject_key} onChange={handleChange} required>
                                <option value="">Select Subject</option>
                                {subjects.map(sub => (
                                    <option key={sub._id} value={sub.Subject_key}>
                                        {sub.Subject_name} ({sub.Subject_key})
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="Grade">
                            <Form.Label>Grade</Form.Label>
                            <Form.Control type="number" name="Grade" value={formData.Grade} onChange={(e) => {
                                const value = e.target.value;
                                let remarks = '';
                                if (value !== '') remarks = Number(value) >= 75 ? 'PASS' : 'FAIL';
                                setFormData({ ...formData, Grade: value, Remarks: remarks });
                            }} required />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="Remarks">
                            <Form.Label>Remarks</Form.Label>
                            <Form.Control type="text" name="Remarks" value={formData.Remarks} readOnly />
                        </Form.Group>

                        <Button variant="primary" type="submit">{editId ? 'Update Student' : 'Add Student'}</Button>
                    </Form>
                </Modal.Body>
            </Modal>

            <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999 }}>
                <Toast show={toast.show} bg={toast.bg} onClose={() => setToast({ ...toast, show: false })} delay={3000} autohide>
                    <Toast.Body className="text-white">{toast.message}</Toast.Body>
                </Toast>
            </ToastContainer>
        </Container>
    );
}
