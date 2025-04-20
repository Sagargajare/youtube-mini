import { Box, Button, Center, HStack, Heading } from "@chakra-ui/react";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <Center h={"100vh"}>
      <HStack>
        {session ? (
          <Box>
            <Heading>Hi {session.user?.name}</Heading>
            <Center marginTop={"5"}>
              <Button onClick={() => signOut()} variant={"subtle"}>
                Signout
              </Button>
            </Center>
          </Box>
        ) : (
          <Button onClick={() => signIn("google")} variant={"subtle"}>
            Signin
          </Button>
        )}
      </HStack>
    </Center>
  );
}
