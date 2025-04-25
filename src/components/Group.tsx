import React from "react";

interface ProfileProps {
  accountType: string;
  email: string;
  fullName: string;
  fun_facts: string;
  points: number;
}

interface GroupProps {
  mentor: ProfileProps;
  students?: ProfileProps[];
}

const Group = ({ mentor, students }: GroupProps) => {
  console.log("Rendering Group with students:", students); // Debug log

  return (
    <>
      <div className="flex flex-row bg-purple-600">
        <div className="flex flex-col justify-between">
          <p>{mentor.fullName}</p>
          <p>{mentor.accountType}</p>
          <p>{mentor.fun_facts}</p>
        </div>
        {students &&
          students.map((student: ProfileProps, index) => (
            <div className="flex flex-col" key={index}>
              <p>{student.fullName}</p>
              <p>{student.accountType}</p>
              <p>{student.fun_facts}</p>
            </div>
          ))}
      </div>
    </>
  );
};

export default Group;
