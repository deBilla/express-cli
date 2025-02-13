# Cloud Functions Init CLI With Boilerplate (`express-deploy`)

A simple CLI tool to initialize a Express project with a custom boilerplate, add modules, and add Express services.

## 🚀 Features

- Initializes a Express project with a predefined boilerplate.
- Adds modules to an existing Express project.
- Adds Express services (e.g., Firestore, Functions) to the project.
- Fully written in TypeScript.

---

## 📦 Installation

### **Install Globally**
To install the CLI globally, run:

```bash
npm install -g express-deploy
```

## 🔧 Usage
Run the CLI by using the following command:

```
express-deploy <command> [options]
```

## Commands:
Initialize the project

```
express-deploy init <project-name>
```

Go inside the project to functions folder

```
cd <project-name>/functions
```

Install dependencies

```
yarn install
```

Add a Module

```
express-deploy add module user
```



# express-deploy
