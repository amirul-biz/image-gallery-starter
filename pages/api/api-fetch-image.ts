import type { NextApiRequest, NextApiResponse } from "next";
import { ImageProps } from "../../utils/types";
import cloudinary from "../../utils/cloudinary";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ images: ImageProps[] }>
) {
  try {
    const results = await cloudinary.v2.search
      .expression(`folder:${process.env.CLOUDINARY_FOLDER}/*`)
      .max_results(400)
      .execute();

    const reducedResults: ImageProps[] = results.resources.map((result, i) => ({
      id: i,
      height: result.height,
      width: result.width,
      public_id: result.public_id,
      format: result.format,
      // Removed blurDataUrl field to save transformations
    }));

    res.status(200).json({ images: reducedResults });
  } catch (err) {
    console.error(err);
    res.status(500).json({ images: [] });
  }
}
