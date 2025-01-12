import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Services from "../../services/Services";
import LoadingSpinner from "../../components/FeedbackComponents/Loading/LoadingSpinner";
// import "./Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);

  const [errors, setErrors] = useState({});
  const [loadingModel, setLoadingModel] = useState(false);
  const navigate = useNavigate();

  const validateFields = () => {
    const newErrors = {};

    // Validate name: Non-empty and should only contain letters and spaces
    if (!formData.name.trim()) {
      newErrors.name = "Full name is required.";
    } else if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
      newErrors.name = "Name can only contain letters and spaces.";
    }

    // Validate email: Non-empty and valid email format
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    // Validate password: Non-empty, at least 8 characters, and strong
    // if (!formData.password.trim()) {
    //   newErrors.password = "Password is required.";
    // } else if (formData.password.length < 8) {
    //   newErrors.password = "Password must be at least 8 characters long.";
    // } else if (
    //   !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/.test(formData.password)
    // ) {
    //   newErrors.password =
    //     "Password must contain at least one letter, one number, and no spaces.";
    // }

    // // Validate confirmPassword: Matches password
    // if (!formData.confirmPassword.trim()) {
    //   newErrors.confirmPassword = "Please confirm your password.";
    // } else if (formData.password !== formData.confirmPassword) {
    //   newErrors.confirmPassword = "Passwords do not match.";
    // }

    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoadingModel(true);
      const res = await Services.register(formData);
      setLoadingModel(false);
      console.log(res);
      navigate("/login");
    } catch (error) {
      setLoadingModel(false);
      setErrors({ general: "Registration failed. Please try again." });
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2 className="form-heading">Register</h2>
        {errors.general && (
          <p className="error-text general-error">{errors.general}</p>
        )}
        <div className="form-group">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleInputChange}
            className={`form-input ${errors.name ? "error" : ""}`}
          />
          {errors.name && <p className="error-text">{errors.name}</p>}
        </div>
        <div className="form-group">
          <input
            type="email"
            name="email"
            placeholder="E-mail Address"
            value={formData.email}
            onChange={handleInputChange}
            className={`form-input ${errors.email ? "error" : ""}`}
          />
          {errors.email && <p className="error-text">{errors.email}</p>}
        </div>
        <div className="form-group">
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"} // Toggle password visibility
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className={`form-input ${errors.password ? "error" : ""}`}
            />
            <button
              type="button"
              className="show-password-btn"
              onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {errors.password && <p className="error-text">{errors.password}</p>}
        </div>

        <div className="form-group">
          <div className="password-container">
            <input
              type={showCPassword ? "text" : "password"} // Toggle password visibility
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`form-input ${errors.password ? "error" : ""}`}
            />
            <button
              type="button"
              className="show-password-btn"
              onClick={() => setShowCPassword(!showCPassword)} // Toggle password visibility
            >
              {showCPassword ? "Hide" : "Show"}
            </button>
          </div>
          {errors.password && <p className="error-text">{errors.password}</p>}
        </div>

        <div className="form-group">
          <select
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            className="form-select"
          >
            <option disabled value="">
              Select Role
            </option>
            <option value="student">Student</option>
            <option value="institute">Institute</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button type="submit" className="submit-btn">
          Register
        </button>
        <div className="sign-in-link">
          <p>
            Have an account?{" "}
            <Link to="/login" className="link">
              Login
            </Link>
          </p>
        </div>
      </form>
      {loadingModel && <LoadingSpinner />}
    </div>
  );
};

export default Register;
