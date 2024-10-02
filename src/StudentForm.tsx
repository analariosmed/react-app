import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Alert, Form, Button, Table } from 'react-bootstrap';

type FormData = {
  name: string;
  surname: string;
  dob: string;
  course: string;
};

type Student = {
  id: number;
  name: string;
  surname: string;
  dob: string;
  course: string;
};

const StudentForm = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [formData, setFormData] = useState<FormData>({
    name: 's',
    surname: 's',
    dob: '1987-12-27',
    course: 's',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('/api/lasalle-student');
      if (Array.isArray(response.data.students)) {
        setStudents(response.data.students); // Access the students array from the response
      } else {
        console.error('Expected an array of students, received:', response.data);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      setError('Failed to fetch students. Please try again later.'); // Display a user-friendly error message
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const { name, surname, dob, course } = formData;

    if (!name || !surname || !dob || !course) {
      setError('All fields are required.');
      return;
    }

    try {
      // CORS issue workaround
      const response = await axios.post('/api/lasalle-student/', formData, {
        // maxRedirects: 0,  // Empêche les redirections automatiques
        headers: {
          // 'Host': 'api.barcelos.dev',
          'Content-Type': 'application/json', // Ensure the content type is set
          // 'Access-Control-Allow-Origin': 'http://localhost:5173', // Allow CORS,
          // 'Origin': 'https://api.barcelos.dev'
        }
      });
      console.log('Response from API:', response); // Log the response for debugging
      setSuccess('Student added successfully!');
      fetchStudents(); // Refresh the student list
      setFormData({ name: '', surname: '', dob: '', course: '' }); // Reset form
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
        setError('Failed to add student: ' + errorMessage);
      } else {
        setError('An unexpected error occurred. Please try again later.');
      }
      // console.error('Error adding student:', error); // Log the error for debugging
    }
  };

  return (
    <div>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formName">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required />
        </Form.Group>
        <Form.Group controlId="formSurname">
          <Form.Label>Surname</Form.Label>
          <Form.Control type="text" name="surname" value={formData.surname} onChange={handleChange} required />
        </Form.Group>
        <Form.Group controlId="formDob">
          <Form.Label>Date of Birth</Form.Label>
          <Form.Control type="date" name="dob" value={formData.dob} onChange={handleChange} required />
        </Form.Group>
        <Form.Group controlId="formCourse">
          <Form.Label>Course</Form.Label>
          <Form.Control type="text" name="course" value={formData.course} onChange={handleChange} required />
        </Form.Group>
        <Button variant="primary" type="submit">Submit</Button>
      </Form>

      <h2 className="mt-5">Students List</h2>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Surname</th>
            <th>Date of Birth</th>
            <th>Course</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.id}</td>
              <td>{student.name}</td>
              <td>{student.surname}</td>
              <td>{new Date(student.dob).toLocaleDateString()}</td>
              <td>{student.course}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default StudentForm;
