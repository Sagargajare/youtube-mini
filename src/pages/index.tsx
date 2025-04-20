import Image from "next/image";
import { Button, Center, Container, HStack } from "@chakra-ui/react";

export default function Home() {
  return (
    <Center h={"100vh"}>
      <HStack>
        <Button variant={"subtle"}>Login</Button>
      </HStack>
    </Center>
  );
}
