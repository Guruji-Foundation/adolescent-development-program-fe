import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TeacherForm from "./TeacherForm";

import apiServices from "../../common/ServiCeProvider/Services";

const EditTeacher: React.FC = () => {
  // teacher details
  const [teacherData, setTeacherData] = useState({
    name: "",
    experience: 0,
    schoolId: 0,
  });

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const message = {
    heading: "Teacher Edited Sccussfully!",
    description: "You have edited teacher.",
  };

  const heading = "Edit Teacher";

  useEffect(() => {
    console.log("form et ue");
    if (id) {
      apiServices
        .fetchTeacher(Number(id))
        .then((res) => {
          if (res) {
            console.log(res?.data?.data);
            setTeacherData({
              name: res?.data?.data?.name,
              experience: res?.data?.data?.experience,
              schoolId: res?.data?.data?.schoolDetails?.id,
            });
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [id]);

  const handleSubmit = async (teacherData: any) => {
    try {
      const response = await apiServices.updateTeacher(Number(id), teacherData);
      return response;
    } catch (error) {
      return error; // Return the error object to handle it in the form
    }
  };

  const handleCloseModal = () => {
    navigate("/teacher"); // Redirect to the school list page after closing the modal
  };

  return (
    <div>
      <TeacherForm
        handleSubmit={handleSubmit}
        message={message}
        heading={heading}
        handleCloseModal={handleCloseModal}
        teacherDataDefault={teacherData}
      />
    </div>
  );
};

export default EditTeacher;
