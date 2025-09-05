-- Create database
CREATE DATABASE IF NOT EXISTS students;
USE students;

-- Students table
CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    department VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Complaints table
CREATE TABLE IF NOT EXISTS complaints (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category ENUM('hostel', 'classroom', 'teacher', 'administrative', 'other') NOT NULL,
    status ENUM('Pending', 'In Progress', 'Resolved') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- Insert sample data (optional)
INSERT INTO students (student_id, name, email, department, password) VALUES
('STU001', 'John Doe', 'john@example.com', 'Computer Science', '$2a$10$example_hashed_password'),
('STU002', 'Jane Smith', 'jane@example.com', 'Mathematics', '$2a$10$example_hashed_password');

INSERT INTO complaints (student_id, title, description, category, status) VALUES
(1, 'Wi-Fi Issue in Hostel', 'Internet connection is very slow in room 201', 'hostel', 'Pending'),
(1, 'Broken Projector', 'Projector in classroom 305 is not working', 'classroom', 'In Progress'),
(2, 'Late Response from Professor', 'Professor not responding to emails timely', 'teacher', 'Resolved');
