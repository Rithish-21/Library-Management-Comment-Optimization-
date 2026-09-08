export const initialBooks = [
    {
        id: 1,
        title: "Android Development",
        author: "Dawn Griffiths",
        category: "Mobile",
        shelf: "C2",
        status: "Available",
        isbn: "978-1491956625",
        description: "A brain-friendly guide to building native Android applications using Kotlin and Jetpack.",
        publishedYear: 2022,
        tags: ["Mobile", "Kotlin", "Android"]
    },
    {
        id: 2,
        title: "Cloud Computing",
        author: "Thomas Erl",
        category: "Cloud & DevOps",
        shelf: "D1",
        status: "Available",
        isbn: "978-0133387520",
        description: "Concepts, technology and architecture of distributed cloud systems and microservices.",
        publishedYear: 2021,
        tags: ["Cloud", "AWS", "Architecture"]
    },
    {
        id: 3,
        title: "Data Science",
        author: "Joel Grus",
        category: "Data Science",
        shelf: "C1",
        status: "Available",
        isbn: "978-1492041139",
        description: "Principles of data science from scratch using Python, linear algebra, and machine learning.",
        publishedYear: 2023,
        tags: ["Data Science", "Python", "ML"]
    },
    {
        id: 4,
        title: "Data Structures & Algorithms",
        author: "Robert Lafore",
        category: "Computer Science",
        shelf: "A3",
        status: "Available",
        isbn: "978-0672324536",
        description: "Classic foundations of algorithmic problem solving, trees, graphs, and optimization.",
        publishedYear: 2020,
        tags: ["Algorithms", "Data Structures", "CS"]
    },
    {
        id: 5,
        title: "Database",
        author: "Abraham Silberschatz",
        category: "Systems",
        shelf: "B2",
        status: "Lost",
        isbn: "978-0078022159",
        description: "Fundamental concepts of relational database management, SQL, normalization, and ACID properties.",
        publishedYear: 2019,
        tags: ["Database", "SQL", "Systems"]
    },
    {
        id: 6,
        title: "Docker & Kubernetes",
        author: "Nigel Poulton",
        category: "Cloud & DevOps",
        shelf: "D2",
        status: "Available",
        isbn: "978-1916585003",
        description: "Master containerization, container orchestration, and production DevOps workflows.",
        publishedYear: 2023,
        tags: ["DevOps", "Docker", "Kubernetes"]
    },
    {
        id: 7,
        title: "Java",
        author: "Joshua Bloch",
        category: "Programming",
        shelf: "A2",
        status: "Issued",
        isbn: "978-0134685991",
        description: "Best practices for the Java programming platform covering concurrency, generics, and lambdas.",
        publishedYear: 2018,
        tags: ["Java", "OOP", "Backend"]
    },
    {
        id: 8,
        title: "Machine Learning",
        author: "Aurélien Géron",
        category: "AI & ML",
        shelf: "C3",
        status: "Issued",
        isbn: "978-1492032649",
        description: "Hands-on machine learning with Scikit-Learn, Keras, and TensorFlow for deep neural networks.",
        publishedYear: 2022,
        tags: ["AI", "Machine Learning", "Python"]
    },
    {
        id: 9,
        title: "Node.js Design Patterns",
        author: "Mario Casciaro",
        category: "Programming",
        shelf: "B3",
        status: "Available",
        isbn: "978-1839214110",
        description: "Design and implement production-grade, asynchronous Node.js backend services.",
        publishedYear: 2020,
        tags: ["Node.js", "Backend", "JavaScript"]
    },
    {
        id: 10,
        title: "Python",
        author: "Luciano Ramalho",
        category: "Programming",
        shelf: "A1",
        status: "Available",
        isbn: "978-1491946008",
        description: "Fluent Python: Clear, concise, and effective programming with Python standard libraries.",
        publishedYear: 2022,
        tags: ["Python", "Programming", "Core"]
    },
    {
        id: 11,
        title: "React Essentials",
        author: "Alex Banks",
        category: "Web Development",
        shelf: "B1",
        status: "Available",
        isbn: "978-1492051725",
        description: "Modern web frontend development using React 18, hooks, state machines, and modern CSS.",
        publishedYear: 2023,
        tags: ["React", "Frontend", "JavaScript"]
    },
    {
        id: 12,
        title: "Spring Boot",
        author: "Craig Walls",
        category: "Programming",
        shelf: "A4",
        status: "Available",
        isbn: "978-1617297571",
        description: "Building microservices and robust enterprise web backends with Spring Boot and Spring Data.",
        publishedYear: 2021,
        tags: ["Java", "Spring Boot", "Microservices"]
    }
];
export const initialInventory = {
    "Android Development": 4,
    "Cloud Computing": 6,
    "Data Science": 5,
    "Data Structures & Algorithms": 7,
    "Database": 8,
    "Docker & Kubernetes": 5,
    "Java": 0, // currently 0 available since issued
    "Machine Learning": 0, // currently 0 available since issued
    "Node.js Design Patterns": 4,
    "Python": 10,
    "React Essentials": 3,
    "Spring Boot": 6,
};
export const initialBorrowRecords = [
    {
        id: "rec-001",
        student: "Rahul",
        studentId: "101",
        book: "Python",
        bookId: 10,
        issueDate: "2026-02-15",
        dueDate: "2026-03-01",
        returnDate: "2026-03-01",
        finePaid: 0,
        status: "returned"
    },
    {
        id: "rec-002",
        student: "Rahul",
        studentId: "101",
        book: "Java",
        bookId: 7,
        issueDate: "2026-02-20",
        dueDate: "2026-03-08", // Due in 2 days from simulated date 2026-03-06 (triggers Due Soon reminder!)
        status: "active"
    },
    {
        id: "rec-003",
        student: "Anu",
        studentId: "102",
        book: "Machine Learning",
        bookId: 8,
        issueDate: "2026-02-10",
        dueDate: "2026-02-24", // Overdue by 10 days! (triggers overdue fine calculation demo)
        status: "overdue"
    },
    {
        id: "rec-004",
        student: "Vikram",
        studentId: "103",
        book: "Database",
        bookId: 5,
        issueDate: "2026-01-10",
        dueDate: "2026-01-24",
        returnDate: "2026-01-29",
        finePaid: 25,
        status: "returned"
    }
];
export const initialReservations = [
    {
        id: "res-001",
        student: "Anu",
        studentId: "102",
        book: "Machine Learning",
        date: "2026-03-01",
        queuePosition: 1,
        status: "waiting"
    },
    {
        id: "res-002",
        student: "David",
        studentId: "105",
        book: "Machine Learning",
        date: "2026-03-02",
        queuePosition: 2,
        status: "waiting"
    },
    {
        id: "res-003",
        student: "Priya",
        studentId: "104",
        book: "Java",
        date: "2026-03-03",
        queuePosition: 1,
        status: "waiting"
    }
];
export const initialRecommendations = {
    "Python": ["Machine Learning", "Data Science", "React Essentials"],
    "Java": ["Spring Boot", "Android Development", "Data Structures & Algorithms"],
    "Database": ["Node.js Design Patterns", "Cloud Computing", "Python"],
    "Machine Learning": ["Data Science", "Python", "Cloud Computing"],
    "React Essentials": ["Node.js Design Patterns", "Python", "Cloud Computing"],
    "Cloud Computing": ["Docker & Kubernetes", "Database", "Node.js Design Patterns"],
    "Docker & Kubernetes": ["Cloud Computing", "Node.js Design Patterns", "Database"],
    "Data Science": ["Machine Learning", "Python", "Database"],
    "Android Development": ["Java", "React Essentials", "Node.js Design Patterns"],
    "Spring Boot": ["Java", "Database", "Cloud Computing"],
    "Data Structures & Algorithms": ["Java", "Python", "Data Science"],
    "Node.js Design Patterns": ["React Essentials", "Database", "Docker & Kubernetes"]
};
export const initialBorrowCounts = {
    "Python": 20,
    "Java": 15,
    "Database": 25, // Top borrowed
    "Machine Learning": 18,
    "Cloud Computing": 12,
    "React Essentials": 14,
    "Docker & Kubernetes": 9,
    "Data Science": 16,
    "Android Development": 7,
    "Spring Boot": 11,
    "Data Structures & Algorithms": 13,
    "Node.js Design Patterns": 8
};
export const initialMembers = [
    {
        id: "101",
        name: "Rahul",
        email: "rahul@student.edu",
        role: "student",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
        joinedDate: "2024-09-01",
        department: "Computer Science"
    },
    {
        id: "102",
        name: "Anu",
        email: "anu@student.edu",
        role: "student",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80",
        joinedDate: "2024-09-01",
        department: "Data Science & AI"
    },
    {
        id: "103",
        name: "Vikram",
        email: "vikram@student.edu",
        role: "student",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
        joinedDate: "2025-01-15",
        department: "Information Systems"
    },
    {
        id: "104",
        name: "Priya",
        email: "priya@student.edu",
        role: "student",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
        joinedDate: "2024-11-20",
        department: "Software Engineering"
    },
    {
        id: "105",
        name: "David",
        email: "david@student.edu",
        role: "student",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
        joinedDate: "2025-02-01",
        department: "Cloud Computing"
    },
    {
        id: "901",
        name: "Dr. Sarah Jenkins",
        email: "librarian@lib.com",
        role: "librarian",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
        joinedDate: "2020-05-10",
        department: "Library & Archives"
    }
];
