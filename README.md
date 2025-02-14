# Express Init CLI With Boilerplate (`express-deploy`)

A simple CLI tool to initialize an Express project with a structured boilerplate, add modules dynamically, and extend Express services—**originally built for PostgreSQL integration**.

## 🚀 Features  

- Initializes an Express project with a predefined **PostgreSQL-connected** boilerplate.
- Joi integreated for request validation 
- Adds modules dynamically while auto-configuring necessary files.  
- Supports adding Express services (e.g., Firestore, Redis, Auth).  
- Fully written in **TypeScript** for scalability and maintainability.  

---

## 📦 Installation  

### **Install Globally**  
To install the CLI globally, run:  

```bash
npm install -g express-deploy
```

---

## 🔧 Usage  

Run the CLI using the following command:  

```bash
express-deploy <command> [options]
```

### Commands:  

#### **Initialize a New Project**  
Creates a new Express project with PostgreSQL integration:  

```bash
express-deploy init <project-name>
```

Navigate to the project folder:  

```bash
cd <project-name>
```

Install dependencies:  

```bash
yarn install
```

#### **Add a New Module**  
Easily extend your app by adding a new module (e.g., `user`):  

```bash
express-deploy add module user
```

---  

🚀 Get started today and streamline your Express + PostgreSQL development!  

#express #nodejs #typescript #postgres #cli #npm