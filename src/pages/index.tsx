import { Box, Button, Center, HStack, Heading } from "@chakra-ui/react";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <Center h={"100vh"}>
      <HStack>
        {session ? (
          <Box>
            <Heading>Hi {session.user?.name}</Heading>
            <Center marginTop={"5"} display={"flex"} flexDir={"column"}>
              <Button mb="2" onClick={() => signOut()} variant={"subtle"}>
                Signout
              </Button>
              <Link href="/manage">Manage Videos</Link>
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
