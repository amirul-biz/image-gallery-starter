import type { NextApiRequest, NextApiResponse } from "next";
import { ImageProps } from "../../utils/types";
import cloudinary from "../../utils/cloudinary";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ images: ImageProps[] }>
) {
  try {
    let allResults: ImageProps[] = [];
    let nextCursor: string | undefined = undefined;
    let idCounter = 0;

    do {
      const results = await cloudinary.v2.search
        .expression(`folder:${process.env.CLOUDINARY_FOLDER}/*`)
        .max_results(500) // Max allowed by Cloudinary
        .next_cursor(nextCursor)
        .execute();

      const images: ImageProps[] = results.resources.map((result) => ({
        id: idCounter++,
        height: result.height,
        width: result.width,
        public_id: result.public_id,
        format: result.format,
        // Optional: skip blurDataURL to save transformations
      }));

      allResults.push(...images);
      nextCursor = results.next_cursor;
    } while (nextCursor);

    res.status(200).json({ images: allResults });
  } catch (err) {
    console.error(err);
    res.status(500).json({ images: [] });
  }
}
