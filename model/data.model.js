const mongoose = require("mongoose");

const StudentSchema = mongoose.Schema({
  student_id: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  course: {
    type: String,
    required: true
  },
  course_type: {
    type: String,
    required: true
  },
  university_board: {
    type: String,
    required: true
  },
  admission_date: {
    type: Date,
    required: true
  },
  session: {
    type: String, // Changed to String to match form input (e.g., "2023-2024")
    required: true
  },
  exam_time: {
    type: String,
    required: true
  },
  father_name: {
    type: String,
    required: true
  },
  mother_name: {
    type: String,
    required: true
  },
  dob: {
    type: Date,
    required: true
  },
  contact_no: {
    type: String, // Changed to String to handle phone numbers correctly
    required: true
  },
  contact_no_2: {
    type: String, // Changed to String and made optional
    required: false
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  present_address: {
    type: String,
    required: true
  },
  permanent_address: {
    type: String,
    required: true
  },
  counsellor: {
    type: String,
    required: true
  },
  aadhar_no: {
    type: String, // Changed to String to handle 12-digit Aadhar number
    required: true,
    unique: true
  },
  status: {
    type: String,
    required: true
  },
  remarks: {
    type: String,
    required: false // Made optional to match form
  },
  university_regd_no: {
    type: String,
    required: true,
    unique: true
  },
  photo: {
    type: String,
    required: true
  },
  document: {
    type: String,
    required: true
  },
  additional_sheet: {
    type: String,
    required: false // Changed to optional
  }
});

const StudentModel = mongoose.model("StudentAllData", StudentSchema);
module.exports = StudentModel;
