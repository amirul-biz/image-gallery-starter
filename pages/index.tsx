"use client"; // (If using inside /app)

import { CldUploadWidget } from "next-cloudinary";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Modal from "../components/Modal";
import type { ImageProps } from "../utils/types";
import { useLastViewedPhoto } from "../utils/useLastViewedPhoto";
import downloadPhoto from "../utils/downloadPhoto";

const Home = () => {
  const router = useRouter();
  const { photoId } = router.query;
  const [lastViewedPhoto, setLastViewedPhoto] = useLastViewedPhoto();

  const lastViewedPhotoRef = useRef<HTMLAnchorElement>(null);
  const [images, setImages] = useState<ImageProps[]>([]);
  const [loading, setLoading] = useState(true);
  const maxImageQuota = Number(process.env.NEXT_PUBLIC_MAX_IMAGE_UPLOAD);
  const [isHitMaxQuotaLimit, setIsHitMaxQuotaLimit] = useState(false);
  const [checking, setChecking] = useState(false);
  const [spareImageCount, setSpareImageCount] = useState(0);
  const [widgetOpenFn, setWidgetOpenFn] = useState(null);

  async function checkLimit() {
    setChecking(true);
    try {
      const res = await fetch(`/api/api-check-upload-limit`, {
        method: "GET",
      });
      const data = await res.json();
      if (res.ok) {
        setSpareImageCount(data.spareImageCount);
        setChecking(false);
        return !data.limitReached;
      } else {
      }
    } catch (e) {
      console.error("Error checking upload limit:", e);
    }
    setChecking(false);
    return false;
  }

  const fetchImages = async () => {
    const res = await fetch(`/api/api-fetch-image`);
    const data = await res.json();
    setLoading(false);
    setImages(data.images);
  };

  useEffect(() => {
    setIsHitMaxQuotaLimit(images.length >= maxImageQuota);
  }, [images, maxImageQuota]);

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    // This effect keeps track of the last viewed photo in the modal to keep the index page in sync when the user navigates back
    if (lastViewedPhoto && !photoId) {
      lastViewedPhotoRef.current.scrollIntoView({ block: "center" });
      setLastViewedPhoto(null);
    }
  }, [photoId, lastViewedPhoto, setLastViewedPhoto]);

  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <>
      <Head>
        <title>{process.env.NEXT_PUBLIC_CLOUDINARY_TITLE}</title>
        <meta
          property="og:image"
          content="https://drive.google.com/uc?export=view&id=10I0WgQbK5CFRzgU03DW2Bx6tHH9-QRhU"
        />
        <meta
          name="twitter:image"
          content="https://drive.google.com/uc?export=view&id=10I0WgQbK5CFRzgU03DW2Bx6tHH9-QRhU"
        />
      </Head>
      <main className="mx-auto max-w-[1960px] p-4">
        {photoId && (
          <Modal
            images={images}
            onClose={() => {
              setLastViewedPhoto(photoId);
            }}
          />
        )}
        <div></div>

        <div className="columns-1 gap-4 sm:columns-2 xl:columns-3 2xl:columns-4">
          <div
            className="relative mb-5 flex h-[300px] flex-col items-center justify-start gap-4 overflow-hidden rounded-lg bg-white/10 px-6 pt-10 text-center text-white shadow-highlight after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight lg:pt-10"
            style={{
              backgroundImage: `url('https://i.fbcd.co/products/original/watercolor-floral-bg-23-416-73fb98db139cf94e02af2a2e0f3d2570d972853da5946a058f0fc6be01be32f0.jpg')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Optional dark overlay for readability */}
            <div className="absolute inset-0 z-0 bg-black/40" />

            {/* Content */}
            <h1 className="relative z-10 mt-4 text-base font-bold uppercase tracking-widest">
              {process.env.NEXT_PUBLIC_CLOUDINARY_TITLE}
            </h1>
            <p className="relative z-10 max-w-[40ch] text-white/75 sm:max-w-[32ch]">
              {process.env.NEXT_PUBLIC_CLOUDINARY_DETAILS}
            </p>
            {!isHitMaxQuotaLimit ? (
              <CldUploadWidget
                key={spareImageCount ?? 0}
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                options={{
                  folder:
                    process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER ||
                    "amirul-aisyah",
                  resourceType: "image", // Ensures only images are accepted
                  clientAllowedFormats: [
                    "jpg",
                    "jpeg",
                    "png",
                    "gif",
                    "bmp",
                    "webp",
                  ], // Image formats only
                  multiple: true, // Allow selecting multiple files
                  maxFiles: spareImageCount, // Limit to 5 files per upload session
                }}
                onSuccess={(results, widget) => {
                  setTimeout(() => {
                    setCurrentIndex(0);
                    fetchImages();
                  }, 3000); // 5000 milliseconds = 5 seconds
                }}
              >
                {({ open }) => (
                  <button
                    className="relative z-10 mt-2 rounded-lg border border-white bg-white px-3 py-2 text-sm font-semibold text-black transition hover:bg-white/10 hover:text-white"
                    onClick={async () => {
                      if (checking) return; // avoid spamming
                      const allowed = await checkLimit();
                      if (allowed) {
                        setTimeout(() => {
                          open();
                        }, 100);
                      } else {
                        alert("Upload limit reached, cannot open widget");
                        setIsHitMaxQuotaLimit(true);
                      }
                    }}
                    type="button"
                  >
                    {checking ? "Checking..." : "Upload"}
                  </button>
                )}
              </CldUploadWidget>
            ) : null}
          </div>

          {loading ? (
            <p className="mt-6 text-center text-lg text-white">Loading...</p>
          ) : images.length === 0 ? (
            <p className="mt-6 text-center text-lg text-white">
              No files uploaded
            </p>
          ) : (
            <div className="mb-10 flex flex-col items-center justify-center">
              {/* <div className="relative w-full max-w-3xl space-y-5 px-4">
                {images
                  .slice(0, currentIndex + 1)
                  .map(({ id, public_id, format }, i) => (
                    <div key={id} className="relative">
                      <a
                        href={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${public_id}.${format}`}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute right-2 top-2 z-10 rounded-full bg-white/80 px-3 py-1 text-xs text-black shadow-md backdrop-blur-sm hover:bg-white"
                      >
                        Download
                      </a>
                      <Image
                        loading="lazy"
                        placeholder="blur"
                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAL4AAACACAYAAAC1BNNAAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAFiUAABYlAUlSJPAAAA2TSURBVHhe7Z0JbFXFF8anRRaVtYiyKIIsYgyiglarRoNQiCCrAdRQY4IhqFVE0FATcMNEIyAQdtTIIvselF2wsoOWQFnVCkJBjMi+Cc7/foe573/7eK8t5Xlfb+f7JZM3M/e++5rX7809M/ecMwnaQRFiGYnmlRC..."
                        alt={`Photo ${i + 1}`}
                        className="rounded-lg brightness-90 transition"
                        style={{ transform: "translate3d(0, 0, 0)" }}
                        src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/f_auto,q_auto:eco,w_480,dpr_auto/${public_id}.${format}`}
                        width={720}
                        height={480}
                        sizes="100vw"
                      />
                    </div>
                  ))}
              </div> */}
              <div className="relative w-full max-w-3xl space-y-5 px-4">
                {images
                  .slice(0, currentIndex + 1)
                  .map(({ id, public_id, format }, i) => {
                    const imageUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${public_id}.${format}`;
                    const downloadFilename = `${public_id}.${format}`;

                    return (
                      <div key={id} className="relative">
                        <button
                          type="button"
                          onClick={() =>
                            downloadPhoto(imageUrl, downloadFilename)
                          }
                          className="absolute right-2 top-2 z-10 rounded-full bg-white/80 px-3 py-1 text-xs text-black shadow-md backdrop-blur-sm hover:bg-white"
                        >
                          Download
                        </button>
                        <Image
                          loading="lazy"
                          placeholder="blur"
                          blurDataURL="data:image/png;base64,iVBORw0K..."
                          alt={`Photo ${i + 1}`}
                          className="rounded-lg brightness-90 transition"
                          style={{ transform: "translate3d(0, 0, 0)" }}
                          src={imageUrl}
                          width={720}
                          height={480}
                          sizes="100vw"
                        />
                      </div>
                    );
                  })}
              </div>
              {currentIndex < images.length - 1 && (
                <button
                  onClick={() =>
                    setCurrentIndex((i) => Math.min(i + 3, images.length - 1))
                  }
                  className="mt-6 rounded bg-white/20 px-6 py-2 text-white hover:bg-white/40"
                >
                  Load Next Images →
                </button>
              )}
              <p className="mt-4 text-sm text-white/80">
                Showing {currentIndex + 1} of {images.length} photos
              </p>
            </div>
          )}
        </div>
      </main>
      <footer className="p-6 text-center text-white/80 sm:p-12">
        {process.env.NEXT_PUBLIC_BOTTOM_TEXT}
      </footer>
    </>
  );
};

export default Home;
