import { google } from "googleapis";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

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
}
