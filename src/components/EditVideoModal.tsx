import { useVideoStore } from "@/store";
import {
  Button,
  CloseButton,
  Dialog,
  Input,
  Portal,
  Textarea,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import { toaster } from "@/components/ui/toaster";

type VideoDetails = {
  title: string;
  description: string;
  videoId: string;
};

const EditVideoModal = ({ title, description, videoId }: VideoDetails) => {
  const { updateVideoMetadata } = useVideoStore();
  const [videoDetails, setVideoDetails] = useState({
    title: title,
    description: description,
    videoId: videoId,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setVideoDetails({
      ...videoDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    const response = await fetch("/api/youtube", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(videoDetails),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Error updating video", data);
      return;
    }

    updateVideoMetadata(
      data.video.id,
      data.video.snippet.title,
      data.video.snippet.description
    );

    toaster.create({
      description: `Video Metadata updated Successfully ${data.video.snippet.title}`,
      type: "success",
    });
  };

  return (
    <Dialog.Root size="md">
      <Dialog.Trigger asChild>
        <Button variant="outline" size="md">
          Edit
        </Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Edit {title}</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <VStack>
                <Input
                  name="title"
                  value={videoDetails.title}
                  onChange={handleChange}
                />
                <Textarea
                  lineHeight={7}
                  name="description"
                  value={videoDetails.description}
                  onChange={handleChange}
                />
              </VStack>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </Dialog.ActionTrigger>
              <Dialog.ActionTrigger asChild>
                <Button onClick={handleSubmit}>Save</Button>
              </Dialog.ActionTrigger>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default EditVideoModal;
