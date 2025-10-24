require("dotenv").config(); //REQUIRE DOTENV TO USE ENV VARIABLESq

const express = require("express"); //REQUIRE EXPRESS
const app = express();
const mongoose = require("mongoose"); //REQUIRE MONGOOSE
const dbConnect = require("./config/db"); //REQUIRE DB CONNECT
const UserModel = require("./model/user.model"); //REQUIRE USER MODEL
const adminlogin =  require('./model/adminlogin')
const StudentModel = require('./model/data.model') //REQUIRE STD_DATA MODEL
const upload = require("./utils/multer.config");
const path = require("path"); //REQUIRE PATH
const cors = require('cors')
const fs = require("fs"); 
const { body, validationResult } = require("express-validator"); //REQUIRE EXPRESS VALIDATOR
const bcrypt = require("bcrypt"); //REQUIRE BCRYPT FOR HASHING PASSWORDS
const { get } = require("http");
const { isLength } = require("validator");
const jwt = require("jsonwebtoken"); //REQUIRE JWT FOR AUTHENTICATION
const cookieParser = require("cookie-parser"); //REQUIRE COOKIE PARSER
app.set("view engine", "ejs"); //SET VIEW ENGINE TO EJS
app.use(express.json({limit:'50mb'})); //USE JSON
app.use(express.urlencoded({ limit:'50mb' ,extended: true })); //USE URL ENCODED
app.use(express.static(path.join(__dirname, "public"))); //USE STATIC FILES
app.use(cors()); //USE CORS
app.use(cookieParser()); //USE COOKIE PARSER
app.get("/", (req, res) => {
  res.render("home"); //RENDER INDEX.EJS FILE
});
app.post("/", (req, res) => {
  const { support, admin } = req.body;
  if (support) res.render("supportLogin");
  else if (admin) res.render("adminLogin");
});

app.get("/support-department-signup", (req, res) => {
  res.render("signup");
});

app.get("/support-department-login", (req, res) => {
  res.render("supportLogin"); //RENDER SUPPORT LOGIN PAGE
});
app.get("/admin-login", (req, res) => {
  res.render("adminLogin"); //RENDER SUPPORT LOGIN PAGE
});
app.get("/support-department", (req, res) => {
  res.render("supportdepartment");
});
app.get("/change-password", (req, res) => {
  res.render("changepassword");
});

app.get("/admin-show-data", (req, res) => {
  res.render("adminShowdata");
});
app.get("/admin-sign-up", (req, res) => {
  res.render("adminsignup");
});
app.get("/admin-change-password", (req, res) => {
  res.render("forgotpass");
});
app.get("/delete-student-record", (req, res) => {
  res.render("delete-record");
});
app.get("/authorized", (req, res) => {
  res.render("authorized");
});



app.delete("/student-record-delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await StudentModel.deleteOne({ student_id: id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json({ message: `Student ${id} deleted successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting student" });
  }
});



app.post("/authorized", (req, res) => {
  const { username, password } = req.body;
  let AdminUserName = "nimtt@admin2004";
  let AdminPassword = "admin@remove";

  try {
    if (username === AdminUserName && password === AdminPassword) {
      // Success message + redirect after 2 seconds
      res.send(`
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Login Success</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
              }
              .animate-fadeIn {
                animation: fadeIn 0.5s ease-out;
              }
              .spinner {
                border: 4px solid rgba(0, 0, 0, 0.1);
                border-left-color: #22c55e;
                border-radius: 50%;
                width: 24px;
                height: 24px;
                animation: spin 1s linear infinite;
              }
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            </style>
          </head>
          <body class="bg-gray-100 flex items-center justify-center min-h-screen">
            <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center animate-fadeIn">
              <div class="flex justify-center mb-4">
                <svg class="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h2 class="text-2xl font-bold text-green-600 mb-2">Login Successful!</h2>
              <p class="text-gray-600 mb-4">Please wait, opening the Remove Details page...</p>
              <div class="flex justify-center">
                <div class="spinner"></div>
              </div>
              <script>
                setTimeout(function(){
                  window.location.href = "/delete-student-record";
                }, 2000);
              </script>
            </div>
          </body>
        </html>
      `);
    } else {
      // Error message + redirect after 2 seconds
      res.send(`
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Login Failed</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
              }
              .animate-fadeIn {
                animation: fadeIn 0.5s ease-out;
              }
              .spinner {
                border: 4px solid rgba(0, 0, 0, 0.1);
                border-left-color: #ef4444;
                border-radius: 50%;
                width: 24px;
                height: 24px;
                animation: spin 1s linear infinite;
              }
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            </style>
          </head>
          <body class="bg-gray-100 flex items-center justify-center min-h-screen">
            <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center animate-fadeIn">
              <div class="flex justify-center mb-4">
                <svg class="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
              <h2 class="text-2xl font-bold text-red-600 mb-2">Invalid Username or Password!</h2>
              <p class="text-gray-600 mb-4">Redirecting back...</p>
              <div class="flex justify-center">
                <div class="spinner"></div>
              </div>
              <script>
                setTimeout(function(){
                  window.history.back();
                }, 2000);
              </script>
            </div>
          </body>
        </html>
      `);
    }
  } catch (error) {
    console.error("Error during authorization:", error);
    res.status(500).send(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Server Error</title>
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-gray-100 flex items-center justify-center min-h-screen">
          <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
            <h2 class="text-2xl font-bold text-red-600 mb-2">Internal Server Error</h2>
            <p class="text-gray-600">Something went wrong. Please try again later.</p>
          </div>
        </body>
      </html>
    `);
  }
});


app.post("/admin-update-data", async (req, res) => {
  try {
    const {
      student_id,
      name,
      course,
      course_type,
      university_board,
      admission_date,
      session,
      exam_time,
      father_name,
      mother_name,
      dob,
      present_address,
      permanent_address,
      contact_no,
      contact_no_2,
      email,
      counsellor,
      aadhar_no,
      status,
      remarks,
      university_regd_no
    } = req.body;

    // Validate required fields
    if (!student_id) {
      return res.status(400).json({ message: "Student ID is required" });
    }

    // Validate email format if provided
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Validate contact numbers if provided (10 digits)
    if (contact_no && !/^\d{10}$/.test(contact_no)) {
      return res
        .status(400)
        .json({ message: "Contact Number must be a valid 10-digit number" });
    }
    if (contact_no_2 && !/^\d{10}$/.test(contact_no_2)) {
      return res
        .status(400)
        .json({ message: "Contact Number 2 must be a valid 10-digit number" });
    }

    // Validate Aadhar number if provided (12 digits)
    if (aadhar_no && !/^\d{12}$/.test(aadhar_no)) {
      return res
        .status(400)
        .json({ message: "Aadhar Number must be a valid 12-digit number" });
    }

    // Validate dates if provided
    if (admission_date && isNaN(Date.parse(admission_date))) {
      return res.status(400).json({ message: "Invalid admission date format" });
    }
    if (dob && isNaN(Date.parse(dob))) {
      return res.status(400).json({ message: "Invalid date of birth format" });
    }

    // Find the student
    const student = await StudentModel.findOne({ student_id });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Update student document with provided fields
    const updatedStudent = await StudentModel.findOneAndUpdate(
      { student_id },
      {
        $set: {
          name: name || student.name,
          course: course || student.course,
          course_type: course_type || student.course_type,
          university_board: university_board || student.university_board,
          admission_date: admission_date || student.admission_date,
          session: session || student.session,
          exam_time: exam_time || student.exam_time,
          father_name: father_name || student.father_name,
          mother_name: mother_name || student.mother_name,
          dob: dob || student.dob,
          present_address: present_address || student.present_address,
          permanent_address: permanent_address || student.permanent_address,
          contact_no: contact_no || student.contact_no,
          contact_no_2: contact_no_2 || student.contact_no_2,
          email: email || student.email,
          counsellor: counsellor || student.counsellor,
          aadhar_no: aadhar_no || student.aadhar_no,
          status: status || student.status,
          remarks: remarks || student.remarks,
          university_regd_no: university_regd_no || student.university_regd_no
        }
      },
      { new: true }
    );

    res.status(200).json(updatedStudent);
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});



const uploadDir = path.join(__dirname, "public/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer error handling
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.error("Multer error:", err);
    return res.status(400).json({ error: `Multer error: ${err.message}` });
  } else if (err) {
    console.error("General error:", err);
    return res.status(400).json({ error: err.message });
  }
  next();
});

// POST route to handle form submission
app.post("/support-department", upload, async (req, res) => {
  try {
    console.log("Form data:", req.body);
    console.log("Files:", req.files);

    const {
      student_id,
      name,
      course,
      course_type,
      university_board,
      admission_date,
      session,
      exam_time,
      father_name,
      mother_name,
      dob,
      contact_no,
      contact_no_2,
      email,
      present_address,
      permanent_address,
      counsellor,
      aadhar_no,
      status,
      remarks,
      university_regd_no,
      same_as_present // Add this to capture checkbox value
    } = req.body;

    // Handle same_as_present logic
    let finalPermanentAddress = permanent_address;
    if (same_as_present === "on" && !permanent_address) {
      finalPermanentAddress = present_address;
    }

    if (!finalPermanentAddress) {
      return res.status(400).json({ error: "Permanent address is required" });
    }

    const photoPath = req.files["photo"]
      ? path.join("uploads", req.files["photo"][0].filename)
      : null;
    const documentPath = req.files["document"]
      ? path.join("uploads", req.files["document"][0].filename)
      : null;
    const additionalSheetPath = req.files["additional_sheet"]
      ? path.join("uploads", req.files["additional_sheet"][0].filename)
      : null;

    if (!photoPath || !documentPath) {
      return res.status(400).json({ error: "Photo and document are required" });
    }

    const student = new StudentModel({
      student_id,
      name,
      course,
      course_type,
      university_board,
      admission_date: new Date(admission_date),
      session,
      exam_time,
      father_name,
      mother_name,
      dob: new Date(dob),
      contact_no,
      contact_no_2,
      email,
      present_address,
      permanent_address: finalPermanentAddress,
      counsellor,
      aadhar_no,
      status,
      remarks,
      university_regd_no,
      photo: photoPath,
      document: documentPath,
      additional_sheet: additionalSheetPath
    });

    await student.save();
    res.status(201).json({ message: "Student data saved successfully" });
  } catch (error) {
    console.error("Error saving student data:", error);
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ error: "Validation error", details: error.errors });
    } else if (error.code === 11000) {
      return res.status(400).json({ error: "Duplicate student_id detected" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});                                                                                                                                                                                                                                       


// ADMIN SHOW DATA
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.post("/admin-show-data", async (req, res) => {
  try {
    const { student_id } = req.body;
    if (!student_id) {
      return res.status(400).json({ message: "Student ID is required" });
    }

    const student = await StudentModel.findOne({ student_id });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const studentData = {
      student_id: student.student_id,
      name: student.name,
      course: student.course,
      course_type: student.course_type,
      university_board: student.university_board,
      admission_date: student.admission_date.toISOString().split("T")[0],
      session: student.session,
      exam_time: student.exam_time,
      father_name: student.father_name,
      mother_name: student.mother_name,
      dob: student.dob.toISOString().split("T")[0],
      contact_no: student.contact_no,
      contact_no_2: student.contact_no_2 || "N/A",
      email: student.email,
      present_address: student.present_address,
      permanent_address: student.permanent_address,
      counsellor: student.counsellor,
      aadhar_no: student.aadhar_no,
      status: student.status,
      remarks: student.remarks || "N/A",
      university_regd_no: student.university_regd_no,
      photo: student.photo ? `${baseUrl}/${student.photo}` : "",
      document: student.document ? `${baseUrl}/${student.document}` : "",
      additional_sheet: student.additional_sheet
        ? `${baseUrl}/${student.additional_sheet}`
        : ""
    };

    res.status(200).json(studentData);
  } catch (error) {
    console.error("Error fetching student:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// SIGNUP
app.post(
  "/support-department-signup",
  body("email").isEmail().trim().isLength({ min: 8 }),
  body("username").trim().isLength({ min: 5 }),
  body("password").trim().isLength({ min: 4 }),
  body("confirm-password").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),
  async (req, res) => {
    try {
      // Validate input fields
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessage = errors.array().map(err => err.msg).join(", ");
        return res.send(`
          <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <script src="https://cdn.tailwindcss.com"></script>
              <title>Sign-up Error</title>
            </head>
            <body class="bg-gray-100 flex items-center justify-center min-h-screen">
              <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
                <h2 class="text-2xl font-semibold text-red-600 mb-4">Invalid Input</h2>
                <p class="text-gray-700 mb-6">${errorMessage}</p>
                <a href="/support-department-signup" class="inline-block px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors">Try Again</a>
              </div>
            </body>
          </html>
        `);
      }

      const { username, email, password } = req.body;

      // Check if username or email already exists
      const existingUser = await UserModel.findOne({
        $or: [{ username }, { email }]
      });
      if (existingUser) {
        return res.send(`
          <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <script src="https://cdn.tailwindcss.com"></script>
              <title>Sign-up Error</title>
            </head>
            <body class="bg-gray-100 flex items-center justify-center min-h-screen">
              <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
                <h2 class="text-2xl font-semibold text-red-600 mb-4">Sign-up Failed</h2>
                <p class="text-gray-700 mb-6">The provided username or email is already in use.</p>
                <a href="/support-department-signup" class="inline-block px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors">Try Again</a>
              </div>
            </body>
          </html>
        `);
      }

      // Hash password and create new user
      const hashPassword = await bcrypt.hash(password, 10);
      await UserModel.create({
        username,
        email,
        password: hashPassword
      });

      // Show success message and redirect to login
      return res.send(`
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <script src="https://cdn.tailwindcss.com"></script>
            <title>Sign-up Success</title>
          </head>
          <body class="bg-gray-100 flex items-center justify-center min-h-screen">
            <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
              <h2 class="text-2xl font-semibold text-green-600 mb-4">Sign-up Successful</h2>
              <p class="text-gray-700 mb-4">Your account has been successfully created.</p>
              <p class="text-gray-600">Redirecting to the login page...</p>
              <script>
                setTimeout(() => {
                  window.location.href = "/support-department-login";
                }, 2000);
              </script>
            </div>
          </body>
        </html>
      `);
    } catch (error) {
      console.error("Sign-up error:", error);
      return res.send(`
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <script src="https://cdn.tailwindcss.com"></script>
            <title>Server Error</title>
          </head>
          <body class="bg-gray-100 flex items-center justify-center min-h-screen">
            <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
              <h2 class="text-2xl font-semibold text-red-600 mb-4">Server Error</h2>
              <p class="text-gray-700 mb-6">An unexpected error occurred during sign-up. Please try again later.</p>
              <a href="/support-department-signup" class="inline-block px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors">Try Again</a>
            </div>
          </body>
        </html>
      `);
    }
  }
);

//LOGIN
app.post(
  "/support-department-login",
  body("username").trim().isLength({ min: 5 }),
  body("password").trim().isLength({ min: 4 }),
  async (req, res) => {
    try {
      // Validate input fields
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.send(`
          <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <script src="https://cdn.tailwindcss.com"></script>
              <title>Login Error</title>
            </head>
            <body class="bg-gray-100 flex items-center justify-center min-h-screen">
              <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
                <h2 class="text-2xl font-semibold text-red-600 mb-4">Invalid Input</h2>
                <p class="text-gray-700 mb-6">The username must be at least 5 characters, and the password must be at least 4 characters.</p>
                <a href="/support-department-login" class="inline-block px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors">Try Again</a>
              </div>
            </body>
          </html>
        `);
      }

      const { username, password } = req.body;

      // Check if user exists
      const Employeedata = await UserModel.findOne({ username });
      if (!Employeedata) {
        return res.send(`
          <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <script src="https://cdn.tailwindcss.com"></script>
              <title>Login Error</title>
            </head>
            <body class="bg-gray-100 flex items-center justify-center min-h-screen">
              <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
                <h2 class="text-2xl font-semibold text-red-600 mb-4">Login Failed</h2>
                <p class="text-gray-700 mb-6">The provided username or password is incorrect.</p>
                <a href="/support-department-login" class="inline-block px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors">Try Again</a>
              </div>
            </body>
          </html>
        `);
      }

      // Verify password
      const loginPassWord = await bcrypt.compare(
        password,
        Employeedata.password
      );
      if (!loginPassWord) {
        return res.send(`
          <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <script src="https://cdn.tailwindcss.com"></script>
              <title>Login Error</title>
            </head>
            <body class="bg-gray-100 flex items-center justify-center min-h-screen">
              <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
                <h2 class="text-2xl font-semibold text-red-600 mb-4">Login Failed</h2>
                <p class="text-gray-700 mb-6">The provided username or password is incorrect.</p>
                <a href="/support-department-login" class="inline-block px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors">Try Again</a>
              </div>
            </body>
          </html>
        `);
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          UserID: Employeedata._id,
          username: Employeedata.username,
          email: Employeedata.email
        },
        process.env.JWT_SECRET
      );

      // Set token in cookie and show success message
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
      });

      return res.send(`
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <script src="https://cdn.tailwindcss.com"></script>
            <title>Login Success</title>
          </head>
          <body class="bg-gray-100 flex items-center justify-center min-h-screen">
            <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
              <h2 class="text-2xl font-semibold text-green-600 mb-4">Login Successful</h2>
              <p class="text-gray-700 mb-4">You have successfully logged in to your account.</p>
              <p class="text-gray-600">Redirecting to the student support page...</p>
              <script>
                setTimeout(() => {
                  window.location.href = "/support-department";
                }, 2000);
              </script>
            </div>
          </body>
        </html>
      `);
    } catch (error) {
      console.error("Login error:", error);
      return res.send(`
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <script src="https://cdn.tailwindcss.com"></script>
            <title>Server Error</title>
          </head>
          <body class="bg-gray-100 flex items-center justify-center min-h-screen">
            <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
              <h2 class="text-2xl font-semibold text-red-600 mb-4">Server Error</h2>
              <p class="text-gray-700 mb-6">An unexpected error occurred during login. Please try again later.</p>
              <a href="/support-department-login" class="inline-block px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors">Try Again</a>
            </div>
          </body>
        </html>
      `);
    }
  }
);

// UPDATE PASSWORD FOR SUPPORT DEPARTMENT
app.post(
  "/change-password",
  [
    body("currentPassword").trim().isLength({ min: 4 }).withMessage("Current password must be at least 4 characters"),
    body("newPassword").trim().isLength({ min: 4 }).withMessage("New password must be at least 4 characters"),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("New password and confirm password do not match");
      }
      return true;
    })
  ],
  async (req, res) => {
    try {
      // Validate input fields
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessage = errors.array().map(err => err.msg).join(", ");
        return res.status(400).json({ success: false, error: errorMessage });
      }

      const { currentPassword, newPassword } = req.body;

      // Verify JWT token from cookie
      const token = req.cookies.token;
      if (!token) {
        return res
          .status(401)
          .json({ success: false, error: "Authentication required" });
      }

      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (error) {
        return res
          .status(401)
          .json({ success: false, error: "Invalid or expired token" });
      }

      // Find user by ID from token
      const user = await UserModel.findById(decoded.UserID);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, error: "User not found" });
      }

      // Verify current password
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res
          .status(401)
          .json({ success: false, error: "Current password is incorrect" });
      }

      // Hash new password and update user
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedNewPassword;
      await user.save();

      // Clear token cookie to force re-login
      res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
      });

      return res
        .status(200)
        .json({ success: true, message: "Password updated successfully" });
    } catch (error) {
      console.error("Update password error:", error);
      return res
        .status(500)
        .json({
          success: false,
          error: "An unexpected error occurred. Please try again later."
        });
    }
  }
);


//ADMIN LOGIN

// ADMIN SIGNUP
app.post(
  "/admin-sign-up",
  body("email").isEmail().trim().isLength({ min: 8 }),
  body("username").trim().isLength({ min: 5 }),
  body("password").trim().isLength({ min: 4 }),
  body("confirm-password").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),
  async (req, res) => {
    try {
      // Validate input fields
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessage = errors.array().map(err => err.msg).join(", ");
        return res.send(`
          <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <script src="https://cdn.tailwindcss.com"></script>
              <title>Sign-up Error</title>
            </head>
            <body class="bg-gray-100 flex items-center justify-center min-h-screen">
              <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
                <h2 class="text-2xl font-semibold text-red-600 mb-4">Invalid Input</h2>
                <p class="text-gray-700 mb-6">${errorMessage}</p>
                <a href="/admin-sign-up" class="inline-block px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors">Try Again</a>
              </div>
            </body>
          </html>
        `);
      }

      const { username, email, password } = req.body;

      // Check if username or email already exists
      const existingUser = await adminlogin.findOne({
        $or: [{ username }, { email }]
      });
      if (existingUser) {
        return res.send(`
          <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <script src="https://cdn.tailwindcss.com"></script>
              <title>Sign-up Error</title>
            </head>
            <body class="bg-gray-100 flex items-center justify-center min-h-screen">
              <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
                <h2 class="text-2xl font-semibold text-red-600 mb-4">Sign-up Failed</h2>
                <p class="text-gray-700 mb-6">The provided username or email is already in use.</p>
                <a href="/admin-sign-up" class="inline-block px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors">Try Again</a>
              </div>
            </body>
          </html>
        `);
      }

      // Hash password and create new user
      const hashPassword = await bcrypt.hash(password, 10);
      await adminlogin.create({
        username,
        email,
        password: hashPassword
      });

      // Show success message and redirect to login
      return res.send(`
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <script src="https://cdn.tailwindcss.com"></script>
            <title>Sign-up Success</title>
          </head>
          <body class="bg-gray-100 flex items-center justify-center min-h-screen">
            <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
              <h2 class="text-2xl font-semibold text-green-600 mb-4">Sign-up Successful</h2>
              <p class="text-gray-700 mb-4">Your account has been successfully created.</p>
              <p class="text-gray-600">Redirecting to the login page...</p>
              <script>
                setTimeout(() => {
                  window.location.href = "/admin-login";
                }, 2000);
              </script>
            </div>
          </body>
        </html>
      `);
    } catch (error) {
      console.error("Sign-up error:", error);
      return res.send(`
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <script src="https://cdn.tailwindcss.com"></script>
            <title>Server Error</title>
          </head>
          <body class="bg-gray-100 flex items-center justify-center min-h-screen">
            <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
              <h2 class="text-2xl font-semibold text-red-600 mb-4">Server Error</h2>
              <p class="text-gray-700 mb-6">An unexpected error occurred during sign-up. Please try again later.</p>
              <a href="/admin-sign-up" class="inline-block px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors">Try Again</a>
            </div>
          </body>
        </html>
      `);
    }
  }
);

//LOGIN
app.post(
  "/admin-login",
  body("username").trim().isLength({ min: 5 }),
  body("password").trim().isLength({ min: 4 }),
  async (req, res) => {
    try {
      // Validate input fields
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.send(`
          <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <script src="https://cdn.tailwindcss.com"></script>
              <title>Login Error</title>
            </head>
            <body class="bg-gray-100 flex items-center justify-center min-h-screen">
              <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
                <h2 class="text-2xl font-semibold text-red-600 mb-4">Invalid Input</h2>
                <p class="text-gray-700 mb-6">The username must be at least 5 characters, and the password must be at least 4 characters.</p>
                <a href="/admin-login" class="inline-block px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors">Try Again</a>
              </div>
            </body>
          </html>
        `);
      }

      const { username, password } = req.body;

      // Check if user exists
      const Employeedata = await adminlogin.findOne({ username });
      if (!Employeedata) {
        return res.send(`
          <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <script src="https://cdn.tailwindcss.com"></script>
              <title>Login Error</title>
            </head>
            <body class="bg-gray-100 flex items-center justify-center min-h-screen">
              <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
                <h2 class="text-2xl font-semibold text-red-600 mb-4">Login Failed</h2>
                <p class="text-gray-700 mb-6">The provided username or password is incorrect.</p>
                <a href="/admin-login" class="inline-block px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors">Try Again</a>
              </div>
            </body>
          </html>
        `);
      }

      // Verify password
      const loginPassWord = await bcrypt.compare(
        password,
        Employeedata.password
      );
      if (!loginPassWord) {
        return res.send(`
          <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <script src="https://cdn.tailwindcss.com"></script>
              <title>Login Error</title>
            </head>
            <body class="bg-gray-100 flex items-center justify-center min-h-screen">
              <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
                <h2 class="text-2xl font-semibold text-red-600 mb-4">Login Failed</h2>
                <p class="text-gray-700 mb-6">The provided username or password is incorrect.</p>
                <a href="/admin-login" class="inline-block px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors">Try Again</a>
              </div>
            </body>
          </html>
        `);
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          UserID: Employeedata._id,
          username: Employeedata.username,
          email: Employeedata.email
        },
        process.env.JWT_SECRET
      );

      // Set token in cookie and show success message
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
      });

      return res.send(`
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <script src="https://cdn.tailwindcss.com"></script>
            <title>Login Success</title>
          </head>
          <body class="bg-gray-100 flex items-center justify-center min-h-screen">
            <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
              <h2 class="text-2xl font-semibold text-green-600 mb-4">Login Successful</h2>
              <p class="text-gray-700 mb-4">You have successfully logged in to your account.</p>
              <p class="text-gray-600">Redirecting to the admin page...</p>
              <script>
                setTimeout(() => {
                  window.location.href = "/admin-show-data";
                }, 2000);
              </script>
            </div>
          </body>
        </html>
      `);
    } catch (error) {
      console.error("Login error:", error);
      return res.send(`
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <script src="https://cdn.tailwindcss.com"></script>
            <title>Server Error</title>
          </head>
          <body class="bg-gray-100 flex items-center justify-center min-h-screen">
            <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
              <h2 class="text-2xl font-semibold text-red-600 mb-4">Server Error</h2>
              <p class="text-gray-700 mb-6">An unexpected error occurred during login. Please try again later.</p>
              <a href="/admin-login" class="inline-block px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors">Try Again</a>
            </div>
          </body>
        </html>
      `);
    }
  }
);

// UPDATE PASSWORD FOR SUPPORT DEPARTMENT
app.post(
  "/admin-change-password",
  [
    body("currentPassword")
      .trim()
      .isLength({ min: 4 })
      .withMessage("Current password must be at least 4 characters"),
    body("newPassword")
      .trim()
      .isLength({ min: 4 })
      .withMessage("New password must be at least 4 characters"),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("New password and confirm password do not match");
      }
      return true;
    })
  ],
  async (req, res) => {
    try {
      // Validate input fields
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessage = errors.array().map(err => err.msg).join(", ");
        return res.status(400).json({ success: false, error: errorMessage });
      }

      const { currentPassword, newPassword } = req.body;

      // Verify JWT token from cookie
      const token = req.cookies.token;
      if (!token) {
        return res
          .status(401)
          .json({ success: false, error: "Authentication required" });
      }

      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (error) {
        return res
          .status(401)
          .json({ success: false, error: "Invalid or expired token" });
      }

      // Find user by ID from token
      const user = await adminlogin.findById(decoded.UserID);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, error: "User not found" });
      }

      // Verify current password
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res
          .status(401)
          .json({ success: false, error: "Current password is incorrect" });
      }

      // Hash new password and update user
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedNewPassword;
      await user.save();

      // Clear token cookie to force re-login
      res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
      });

      return res
        .status(200)
        .json({ success: true, message: "Password updated successfully" });
    } catch (error) {
      console.error("Update password error:", error);
      return res.status(500).json({
        success: false,
        error: "An unexpected error occurred. Please try again later."
      });
    }
  }
);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`); //LOG PORT
});
