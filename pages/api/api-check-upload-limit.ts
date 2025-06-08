import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  res.setHeader("Cache-Control", "no-store");

  try {
    let totalCount = 0;
    let nextCursor = undefined;
    let totalSpareImageCount = 0;
    const maxLimit = Number(process.env.NEXT_PUBLIC_MAX_IMAGE_UPLOAD);

    do {
      const result = await cloudinary.search
        .expression(`folder:${process.env.CLOUDINARY_FOLDER}`)
        .max_results(500)
        .next_cursor(nextCursor)
        .execute();

      totalCount += result.resources.length;
      nextCursor = result.next_cursor;

      if (totalCount >= maxLimit) break;
    } while (nextCursor);

    totalSpareImageCount = maxLimit - totalCount;

    return res
      .status(200)
      .json({
        limitReached: totalCount >= maxLimit,
        totalCount,
        spareImageCount: totalSpareImageCount,
      });
  } catch (error) {
    console.error("Check limit error:", error);
    return res.status(500).json({ error: "Failed to check upload limit" });
  }
}
