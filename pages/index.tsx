import { CldUploadWidget } from "next-cloudinary";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Bridge from "../components/Icons/Bridge";
import Logo from "../components/Icons/Logo";
import Modal from "../components/Modal";
import type { ImageProps } from "../utils/types";
import { useLastViewedPhoto } from "../utils/useLastViewedPhoto";

const Home = () => {
  const router = useRouter();
  const { photoId } = router.query;
  const [lastViewedPhoto, setLastViewedPhoto] = useLastViewedPhoto();

  const lastViewedPhotoRef = useRef<HTMLAnchorElement>(null);

  const [images, setImages] = useState<ImageProps[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchImages = async () => {
    const res = await fetch("/api/api-fetch-image");
    const data = await res.json();
    setLoading(false);
    setImages(data.images);
  };

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
          <div className="after:content relative mb-5 flex h-[629px] flex-col items-center justify-end gap-4 overflow-hidden rounded-lg bg-white/10 px-6 pb-16 pt-64 text-center text-white shadow-highlight after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight lg:pt-0">
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
              <span className="flex max-h-full max-w-full items-center justify-center">
                <Bridge />
              </span>
              <span className="absolute bottom-0 left-0 right-0 h-[400px] bg-gradient-to-b from-black/0 via-black to-black"></span>
            </div>
            <Logo />
            <h1 className="mb-4 mt-8 text-base font-bold uppercase tracking-widest">
              {process.env.NEXT_PUBLIC_CLOUDINARY_TITLE}
            </h1>
            <p className="max-w-[40ch] text-white/75 sm:max-w-[32ch]">
              {process.env.NEXT_PUBLIC_CLOUDINARY_DETAILS}
            </p>
            <CldUploadWidget
              uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
              options={{
                folder:
                  process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER || "amirul-aisyah",
              }}
              onSuccess={(results, widget) => {
                console.log("Upload completed:", results);
                setCurrentIndex(0);
                fetchImages(); // Refresh images only after Done is clicked
              }}
            >
              {({ open }) => (
                <button
                  className="pointer z-10 mt-6 rounded-lg border border-white bg-white px-3 py-2 text-sm font-semibold text-black transition hover:bg-white/10 hover:text-white md:mt-4"
                  onClick={() => open()}
                  type="button"
                >
                  Upload
                </button>
              )}
            </CldUploadWidget>
          </div>
          {loading ? (
            <p className="mt-6 text-center text-white">Loading...</p>
          ) : (
            images.length > 0 && (
              <div className="mb-10 flex flex-col items-center justify-center">
                <div className="relative w-full max-w-3xl space-y-5 px-4">
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
            )
          )}
        </div>
      </main>
      <footer className="p-6 text-center text-white/80 sm:p-12">
        Thank you to{" "}
        <a
          href="https://edelsonphotography.com/"
          target="_blank"
          className="font-semibold hover:text-white"
          rel="noreferrer"
        >
          Josh Edelson
        </a>
        ,{" "}
        <a
          href="https://www.newrevmedia.com/"
          target="_blank"
          className="font-semibold hover:text-white"
          rel="noreferrer"
        >
          Jenny Morgan
        </a>
        , and{" "}
        <a
          href="https://www.garysextonphotography.com/"
          target="_blank"
          className="font-semibold hover:text-white"
          rel="noreferrer"
        >
          Gary Sexton
        </a>{" "}
        for the pictures.
      </footer>
    </>
  );
};

export default Home;
