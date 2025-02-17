import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormErrorMessage,
  FormLabel,
  InputGroup,
  Input,
  InputRightElement,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../store/userSlice";

const Admin = () => {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [isPasswordInvalid, setIsPasswordInvalid] = useState(false);
  const dispatch = useDispatch();

  const handleShow = () => setShow(!show);
  const handleInvalidPassword = () => setIsPasswordInvalid(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const loginData = {
      email: event?.target[0]?.value,
      password: event?.target[1]?.value,
    };

    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });

    if (res?.ok) {
      const data = await res.json();
      localStorage.setItem("token", "Bearer " + data.token);
      localStorage.setItem("manualLogin", true);
      dispatch(setUserInfo(data.user));
      router.push("/");
    } else {
      setIsPasswordInvalid(true);
    }
  };

  return (
    <Modal isOpen={true} onClose={() => router.push("/")}>
      <ModalContent mt="15%">
        <ModalHeader className="text-center">ADMIN LOGIN</ModalHeader>
        <ModalCloseButton colorScheme="teal" />
        <form onSubmit={handleSubmit}>
          <ModalBody pb={6}>
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                placeholder="Email"
                focusBorderColor="teal.400"
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
              />
            </FormControl>

            <FormControl mt={4} isRequired isInvalid={isPasswordInvalid}>
              <FormLabel>Password</FormLabel>
              <InputGroup size="md">
                <Input
                  type={show ? "text" : "password"}
                  placeholder="Password"
                  focusBorderColor="teal.400"
                  pattern="[A-Za-z0-9_]{5,15}"
                  onChange={handleInvalidPassword}
                />
                <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={handleShow}>
                    {show ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
              </InputGroup>
              {isPasswordInvalid && (
                <FormErrorMessage mb="-1.7rem">
                  Wrong Credentials
                </FormErrorMessage>
              )}
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button type="submit" colorScheme="whatsapp" variant="solid" mr={3}>
              Login
            </Button>
            <Button
              onClick={() => router.push("/")}
              colorScheme="teal"
              variant="outline"
            >
              Cancel
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default Admin;
