import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import apiServices from "../../common/ServiCeProvider/Services";
import useError from "../../hooks/useError";
import ErrorMessage from "../../common/FormInput/ErrorMessage";
import TopicsForm from "./TopicsForm";

const EditTopic = () => {
  const [topics, setTopics] = useState({
    name: "",
    description: "",
    projectName: "",
    projectId: NaN,
  });

  const navigate = useNavigate();
  const { errors, setError, clearError } = useError();
  const { id } = useParams();
  const message = {
    heading: "Topic Edited Sccussfully!",
    description: "Your Topic data has been edited",
  };

  const heading = "Edit Topic";

  useEffect(() => {
    if (id) {
      apiServices
        .fetchTopic(Number(id))
        .then((res) => {
          if (res) {
            // console.log(res?.data?.data);
            setTopics(res?.data?.data);
          }
        })
        .catch((error) => {
          setError(error.message);
        });
    }
  }, [id]);

  const handleSubmit = async (topicData) => {
    try {
      const response = await apiServices.updateTopic(Number(id), topicData);
      return response;
    } catch (error) {
      setError(error.message);
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
      {errors.length > 0 && <ErrorMessage errors={errors} />}
    </div>
  );
};

export default EditTopic;
