import { google } from "googleapis";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

// This function handles the GET request to fetch unlisted videos
// It uses the YouTube Data API to get the list of videos for the authenticated user.
const handleGet = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);

  //   @ts-ignore
  const accessToken = session?.accessToken;

  if (!accessToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });

    const youtube = google.youtube({
      version: "v3",
      auth: oauth2Client,
    });

    const response = await youtube.search.list({
      part: ["id", "snippet"],
      forMine: true,
      maxResults: 50,
      type: ["video"],
    });

    const videoIds = response.data.items
      ?.map((item) => item.id?.videoId)
      .filter(Boolean);

    if (!videoIds || videoIds.length === 0) {
      return res.status(200).json({ videos: [] });
    }

    const videoDetails = await youtube.videos.list({
      part: ["id", "snippet", "status"],
      id: videoIds as string[],
    });

    const unlistedVideos = videoDetails.data.items?.filter(
      (video) => video.status?.privacyStatus === "unlisted"
    );

    return res.status(200).json({ videos: unlistedVideos });
  } catch (error) {
    console.error("YouTube API error:", error);
    return res.status(500).json({ error: "Failed to fetch videos" });
  }
};

// This function handles the POST request to update a video
// It requires the videoId, title, and description in the request body
const handlePost = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);

  //   @ts-ignore
  const accessToken = session?.accessToken;

  if (!accessToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method === "POST") {
    const { videoId, title, description } = req.body;

    if (!videoId || !title || !description) {
      return res
        .status(400)
        .json({ error: "Missing videoId, title, or description" });
    }

    try {
      const oauth2Client = new google.auth.OAuth2();
      oauth2Client.setCredentials({ access_token: accessToken });

      const youtube = google.youtube({
        version: "v3",
        auth: oauth2Client,
      });

      const response = await youtube.videos.update({
        part: ["snippet"],
        requestBody: {
          id: videoId,
          snippet: {
            title,
            description,
            categoryId: "22",
          },
        },
      });

      return res
        .status(200)
        .json({ message: "Video updated successfully", video: response.data });
    } catch (error) {
      console.error("Failed to update video:", error);
      return res.status(500).json({ error: "Failed to update video" });
    }
  }

  return res.status(405).json({ error: "Method Not Allowed" });
};

// This is the main handler function for the API route
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    return handleGet(req, res);
  }

  if (req.method === "POST") {
    return handlePost(req, res);
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
