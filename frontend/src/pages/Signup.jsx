import { ButtomWarning } from "../componets/ButtomWarning";
import { Button } from "../componets/Button";
import { Heading } from "../componets/Heading";
import { InputBox } from "../componets/InputBox";
import { SubHeading } from "../componets/SubHeading";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  return (
    <div className="bg-slate-300 h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
          <Heading label={"Sign up"} />
          <SubHeading label={"Enter your infromation to create an account"} />
          <InputBox
            onChange={(e) => {
              setFirstName(e.target.value);
            }}
            label={"First Name"}
            placeholder={"John"}
          />

          <InputBox
            onChange={(e) => {
              setLastName(e.target.value);
            }}
            label={"Last Name"}
            placeholder={"Doe"}
          />
          <InputBox
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            label={"Email"}
            placeholder={"pankaj@gmail.com"}
          />
          <InputBox
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            label={"Password"}
            placeholder={"123456"}
          />
          <div className="pt-4">
            <Button
              onClick={async () => {
                const response = await axios.post(
                  "http://localhost:3000/api/v1/user/signup",
                  {
                    username,
                    password,
                    firstName,
                    lastName,
                  }
                );
                localStorage.setItem("token", response.data.token);
                navigate("/dashboard");
              }}
              label={"Sign up"}
            />
          </div>

          <ButtomWarning
            label={"Already have an account?"}
            buttonText={"Sign in "}
            to={"/signin"}
          />
        </div>
      </div>
    </div>
  );
}
