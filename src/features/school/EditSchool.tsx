import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import apiServices from "../../common/ServiCeProvider/Services";
import SchoolForm from "./SchoolForm";

const EditSchool: React.FC = () => {
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
  const { id } = useParams<{ id: string }>();
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
          console.error(error);
        });
    }
  }, [id]);

  const handleSubmit = async (schoolData: any) => {
    try {
      const response = await apiServices.updateSchool(Number(id), schoolData);
      return response;
    } catch (error) {
      return error; // Return the error object to handle it in the form
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
    </div>
  );
};

export default EditSchool;
