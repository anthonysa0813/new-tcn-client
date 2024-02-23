import React, { useEffect, useContext, useState } from "react";
import { EmployeeApi } from "../../apis/employee";
import { TokenContext } from "../../context/CurrentToken";
import { KnoledgeInterface } from "../../interfaces";

interface Prop {
  id: string;
}

const SkillsByUserPills = ({ id }: Prop) => {
  const { privateToken } = useContext(TokenContext);
  const [currentSkills, setCurrentSkills] = useState<KnoledgeInterface[] | []>(
    []
  );

  useEffect(() => {
    EmployeeApi.get(`/knoledge/${id}`, {
      headers: {
        Authorization: privateToken.token,
      },
    }).then((res) => {
      console.log({
        data: res.data,
      });
      setCurrentSkills(res.data);
    });
  }, [id]);

  return (
    <div className="flex gap-2 items-center flex-wrap">
      {currentSkills.map((skill) => {
        return (
          <div key={skill._id} className="rounded-full bg-gray-100 p-2 px-4">
            <p>{skill.name}</p>
          </div>
        );
      })}
    </div>
  );
};

export default SkillsByUserPills;

