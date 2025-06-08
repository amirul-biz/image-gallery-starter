import { v2 as cloudinary } from "cloudinary";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    console.log("Method not allowed:", req.method);
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { paramsToSign } = req.body;

  if (!paramsToSign || typeof paramsToSign !== "object") {
    console.log("Invalid paramsToSign:", paramsToSign);
    return res.status(400).json({ error: "Missing or invalid paramsToSign" });
  }

  try {
    let totalCount = 0;
    let nextCursor = undefined;
    const maxLimit = Number(process.env.NEXT_PUBLIC_MAX_IMAGE_UPLOAD);
    console.log("Starting search with max limit:", maxLimit);

    do {
      const result = await cloudinary.search
        .expression(`folder:${process.env.CLOUDINARY_FOLDER}`)
        .max_results(500)
        .next_cursor(nextCursor)  // use camelCase here
        .execute();

      totalCount += result.resources.length;
      nextCursor = result.next_cursor;

      console.log("Fetched page, current totalCount:", totalCount);

      if (totalCount >= maxLimit) {
        console.log("Hit max upload limit during pagination");
        break;
      }
    } while (nextCursor);

    if (totalCount >= maxLimit) {
      console.error(`Maximum upload limit of ${maxLimit} images reached`);
      return res.status(403).json({ error: "Upload limit reached" });
    }

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET
    );

    console.log("Generated signature successfully");

    return res.status(200).json({ signature });
  } catch (error) {
    console.error("Signature error:", error);
    return res.status(500).json({ error: "Failed to generate signature" });
  }
}
