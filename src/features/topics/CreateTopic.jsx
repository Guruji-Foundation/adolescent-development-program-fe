import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import SuccessModal from "../../common/FeedbackComponents/Sucess/SuccessModal";
import apiServices from "../../common/ServiCeProvider/Services";
import TopicsForm from "./TopicsForm";

const CreateTopic = () => {
  const message = {
    heading: "Topic Created Successfully!",
    description: "Your Topic has been Created.",
  };
  const heading = "Create Topic";

  const [topics, setTopics] = useState({});

  const navigate = useNavigate();

  const handleSubmit = async (topicData) => {
    try {
      const response = await apiServices.createTopic(topicData);
      return response;
    } catch (error) {
      return error; // Return the error object to handle it in the form
    }
  };

  const handleCloseModal = () => {
    navigate("/topics"); // Redirect to the school list page after closing the modal
  };

  return (
    <div>
      <TopicsForm
        handleSubmit={handleSubmit}
        message={message}
        heading={heading}
        handleCloseModal={handleCloseModal}
        topicDataDefault={topics}
      />
    </div>
  );
};

export default CreateTopic;
