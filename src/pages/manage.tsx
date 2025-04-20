import React, { useEffect } from "react";
import { Box, Center, Link, SimpleGrid, Text } from "@chakra-ui/react";

type Props = {};

type VideoType = {
  id: string;
  snippet: {
    title: string;
    thumbnails: {
      maxres: {
        url: string;
      };
    };
  };
};

type DataType = {
  videos: VideoType[];
} | null;

const Manage = (props: Props) => {
  const [data, setData] = React.useState<DataType>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/youtube");
        if (!response.ok) throw new Error("Failed to fetch data");
        const result = await response.json();
        setData(result);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  return (
    <SimpleGrid columns={{ base: 1, md: 3 }} gap={4} p="8" px={64}>
      {data &&
        data.videos.map((video) => (
          <Center key={video.id}>
            <Link href={`https://www.youtube.com/watch?v=${video.id}`}>
              <Box
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
                p={2}
                width="300px"
                height="250px"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="space-between"
                textAlign="center"
              >
                <Center width="100%" height="150px">
                  <img
                    src={video.snippet.thumbnails.maxres.url}
                    alt={video.snippet.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Center>

                <Text
                  mt={2}
                  fontSize="md"
                  fontWeight="bold"
                  textAlign="center"
                  width="100%"
                  whiteSpace="nowrap"
                  overflow="hidden"
                  textOverflow="ellipsis"
                >
                  {video.snippet.title}
                </Text>
              </Box>
            </Link>
          </Center>
        ))}
    </SimpleGrid>
  );
};

export default Manage;
