import React, { useState, useEffect } from "react";

import SuccessModal from "../../common/FeedbackComponents/Sucess/SuccessModal"; // Import the modal component
import "./TopicsForm.css";
import "../../CSS/Main.css";
import ErrorMessage from "../../common/FormInput/ErrorMessage";
import NumberInput from "../../common/FormInput/NumberInput";
import TextInput from "../../common/FormInput/TextInput";
import Button from "../../common/FormInput/Button";
import useError from "../../hooks/useError";
import SelectInput from "../../common/FormInput/SelectInput";

import apiServices from "../../common/ServiCeProvider/Services";

const TopicsForm = ({
  handleSubmit,
  message,
  heading,
  handleCloseModal,
  topicDataDefault,
}) => {
  const [topics, setTopics] = useState({
    name: topicDataDefault?.name,
    description: topicDataDefault?.description,
    projectName: topicDataDefault?.projectName,
    projectId: topicDataDefault?.projectId,
  });

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    apiServices
      .getAllProjectList()
      .then((res) => {
        res = res?.data?.data?.projects;
        // console.log(res);
        if (res && res.length > 0) {
          setProjects(res);
        } else {
          setProjects([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        setError("Error fetching school data.");
        console.error("Error fetching school data:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    setTopics(topicDataDefault);
    console.log("hello form useeffect");
  }, [topicDataDefault]);

  const [showModal, setShowModal] = useState(false);
  const { errors, setError, clearError } = useError();

  const handleInputChange = (e) => {
    setTopics({
      ...topics,
      [e.target.name]: e.target.value,
    });
  };

  const handlePojectChange = (e) => {
    setTopics({
      ...topics,
      projectId: Number(e.target.value),
    });
    console.log("heelo ");
    console.log(e.target.value);
  };

  //submit button
  const handleSubmitButton = async (e) => {
    e.preventDefault();

    try {
      const response = await handleSubmit(topics); // Wait for the handleSubmit function

      if (response.data?.status) {
        setShowModal(true); // Show success modal
        clearError(); // Clear errors
      } else if (response.data?.messages) {
        setError(response.data.messages.map((msg) => msg.message));
      } else {
        setError("An unexpected error occurred.");
      }
    } catch (error) {
      setError(error.message || "Error submitting the form.");
    }
  };

  const handleClose = () => {
    setShowModal(false);
    handleCloseModal();
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmitButton}>
        <h2>{heading}</h2>
        <div className="form-layout">
          <TextInput
            label="Topic Name"
            name="name"
            value={topics.name}
            onChange={handleInputChange}
            required
          />

          <TextInput
            label="Description"
            name="description"
            value={topics.description}
            onChange={handleInputChange}
            required
          />
          <SelectInput
            label="Projects"
            value={topics.projectId || ""}
            onChange={handlePojectChange}
            options={projects}
            required
          />
        </div>
        {/* Use Button component */}
        <Button
          type="submit"
          label="Submit"
          className="g-button submit-button"
        />
      </form>

      {errors.length > 0 && <ErrorMessage errors={errors} />}

      {showModal && <SuccessModal data={message} onClose={handleClose} />}
    </div>
  );
};

export default TopicsForm;
