# 🚀 SkillSync-Coding

> **A Coding-based Skill Sharing & Learning Platform**  
> _Empower your learning journey, share your skills, and track your progress!_

--- Technologies Used:
  * Java SpringBoot
  * React + Vite
  * MongoDB cloud

## ✨ Features

### 🏠 Modern Dashboard
- **Beautiful Navbar** with quick access to all main features.
- **Responsive Design** using Tailwind CSS for a seamless experience on all devices.

### 👤 User Management
- **Sign Up / Login / OAuth2** (Google, GitHub)
- **Profile View & Edit**  
- **Avatar Customization**  
- **Secure Logout**

### 📝 Skill Posts
- **Create, Edit, and Delete Posts**  
- **Upload Images & Videos**  
- **Like ❤️, Comment 💬, and Follow Users**  
- **My Posts** section for easy management

### 📚 Learning Plans (Courses)
- **Add, Edit, and Delete Courses**  
- **Course Cards** with details, images, and links  
- **Track your learning plans and progress**

### 📈 Learning Progress
- **Track your learning journey**  
- **Add, Edit, and Delete Progress Updates**  
- **Share achievements and milestones**

### 🔔 Real-Time Notifications
- **Notification Bell** in Navbar with unread count badge  
- **Right-side Notification Sidebar** for all your alerts  
- **Events Tracked:**  
  - Profile updated or deleted  
  - New post/course/progress added  
  - Post/course/progress deleted  
- **Persistent notifications** (localStorage)  
- **Mark all as read / Clear all** options

### 💬 Comments & Interactivity
- **Threaded Comments** on posts  
- **Reply, Edit, and Delete Comments**  
- **Engage with the community**

### 🧭 Navigation & UX
- **Left Sidebar** (menu) for quick navigation  
- **Click logo for menu, click SkillSync name for home**  
- **Profile dropdown** for quick access to profile and settings

---

## 🛠️ Tech Stack

- **Frontend:** React, Tailwind CSS, Lucide Icons, Toastify, React Router
- **Backend:** Java Spring Boot (REST API)
- **Database:** (Your DB here, e.g., MySQL/PostgreSQL/MongoDB)
- **Other:** LocalStorage for notifications, OAuth2 for authentication

---

## 📦 Project Structure

```
Skillsync-Coding/
  frontend/
    src/
      components/
        main-main/      # Navbar, Home, Notifications, Footer
        users/          # Auth, Profile
        skill-posts/    # Posts, MyPosts
        courses/        # Courses, CourseForm, CourseCard
        learning-progress/ # Progress tracking
        interactivity/  # Comments
  backend/
    src/
      main/
        java/com/skillsync/backend/
          controllers/  # API endpoints
          services/     # Business logic
          models/       # Data models
          repositories/ # Data access
```

---

## 🚦 How to Run

1. **Clone the repo:**  
   ```bash
   git clone https://github.com/yourusername/Skillsync-Coding.git
   cd Skillsync-Coding
   ```

2. **Backend:**  
   - Navigate to `backend/`  
   - Configure your DB in `application.properties`  
   - Run with Maven or your IDE

3. **Frontend:**  
   - Navigate to `frontend/`  
   - Install dependencies: `npm install`  
   - Start: `npm start`

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📧 Contact

For questions, suggestions, or feedback, open an issue or contact the maintainer.

---

> Made with ❤️ by the EnithHassa & 
    My collaberaters: chathula
                      Vidumini Chalanika
                      Kaushika Abeysinghe

