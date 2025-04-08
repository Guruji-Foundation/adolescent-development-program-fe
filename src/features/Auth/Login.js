import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Services from "../../common/ServiCeProvider/Services";
import LoadingSpinner from "../../common/FeedbackComponents/Loading/LoadingSpinner";
import "./Register.css";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState("");
  const [loadingModel, setLoadingModel] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility

  const navigate = useNavigate();
  const { login } = useAuth();

  const validateFields = () => {
    const newErrors = {};

    // Validate email: Non-empty and valid email format
    if (!formData.email.trim() || formData.email.length <= 0) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    // // Validate password: Non-empty, at least 8 characters, and strong
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
      const res = await Services.login(formData);
      
      if (!res.status) {
        setErrors(res.message);
        setLoadingModel(false);
        return;
      }

      if (!res.token) {
        setErrors("Failed to retrieve token. Please try again.");
        setLoadingModel(false);
        return;
      }

      try {
        const user = await login(res.token);
        if (user) {
          navigateTo(user.role);
        } else {
          setErrors("Failed to load user profile. Please try again.");
        }
      } catch (error) {
        console.error("Profile loading error:", error);
        setErrors(error.message || "An error occurred.");
      }

      setLoadingModel(false);
    } catch (error) {
      console.error("Login request error:", error);
      setErrors(error.message || "An error occurred.");
      setLoadingModel(false);
    }
  };

  const navigateTo = (role) => {
    navigate("/");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="form-heading">Login</h2>
      {errors && <p className="error-text general-error">{errors}</p>}

      <div className="form-group">
        <input
          type="email"
          name="email"
          placeholder="E-mail Address"
          value={formData?.email}
          onChange={handleInputChange}
          className={`form-input ${errors?.email ? "error" : ""}`}
        />
        {errors?.email && <p className="error-text">{errors?.email}</p>}
      </div>
      <div className="form-group">
        <div className="password-container">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData?.password}
            onChange={handleInputChange}
            className={`form-input ${errors?.password ? "error" : ""}`}
          />
          <button
            type="button"
            className="show-password-btn"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        {errors?.password && <p className="error-text">{errors?.password}</p>}
      </div>

      <button type="submit" className="submit-btn">
        Login
      </button>
      {loadingModel && <LoadingSpinner />}
    </form>
  );
};

export default Login;
