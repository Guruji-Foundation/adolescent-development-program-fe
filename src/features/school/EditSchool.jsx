import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import apiServices from "../../common/ServiCeProvider/Services";
import SchoolForm from "./SchoolForm";
import useError from "../../hooks/useError";
import ErrorMessage from "../../common/FormInput/ErrorMessage";

const EditSchool = () => {
  const [schoolData, setSchoolData] = useState({
    name: "",
    address: "",
    phoneNumber: "",
    principalName: "",
    principalContactNo: "",
    managingTrustee: "",
    trusteeContactInfo: "",
    website: "",
  });

  const navigate = useNavigate();
  const { errors, setError, clearError } = useError();
  const { id } = useParams();
  const message = {
    heading: "School Edited Sccussfully!",
    description: "Your school data has been edited",
  };

  const heading = "Edit School";

  useEffect(() => {
    if (id) {
      apiServices
        .fetchSchool(Number(id))
        .then((res) => {
          if (res) {
            // console.log(res?.data?.data);
            setSchoolData(res?.data?.data);
          }
        })
        .catch((error) => {
          setError(error.message);
        });
    }
  }, [id]);

  const handleSubmit = async (schoolData) => {
    try {
      const response = await apiServices.updateSchool(Number(id), schoolData);
      return response;
    } catch (error) {
      setError(error.message);
    }
  };

  const handleCloseModal = () => {
    navigate("/school"); // Redirect to the school list page after closing the modal
  };

  return (
    <div>
      <SchoolForm
        handleSubmit={handleSubmit}
        message={message}
        heading={heading}
        handleCloseModal={handleCloseModal}
        schoolDataDefault={schoolData}
      />
      {errors.length > 0 && <ErrorMessage errors={errors} />}
    </div>
  );
};

export default EditSchool;
