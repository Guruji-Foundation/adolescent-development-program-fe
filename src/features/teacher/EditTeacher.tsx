import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { fetchTeacher, updateTeacher } from "../../services/TeacherService";
import TeacherForm from "./TeacherForm";

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
      fetchTeacher(Number(id))
        .then((res) => {
          if (res) {
            console.log("form et");
            console.log(res);
            setTeacherData({
              name: res.name,
              experience: res.experience,
              schoolId: res.schoolDetails.id,
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
      const response = await updateTeacher(Number(id), teacherData);
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
