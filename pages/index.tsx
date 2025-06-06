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

  const fetchImages = async () => {
    const res = await fetch("/api/api-fetch-image");
    const data = await res.json();
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




  // useEffect(() => {
  //   if (typeof window !== "undefined" && currentIndex + 1 < images.length) {
  //     const nextImage = new window.Image();
  //     nextImage.src = `https://res.cloudinary.com/${
  //       process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  //     }/image/upload/f_auto,q_auto:eco,w_720,dpr_auto/${
  //       images[currentIndex + 1].public_id
  //     }.${images[currentIndex + 1].format}`;
  //   }
  // }, [currentIndex, images]);

  return (
    <>
      <Head>
        <title>Next.js Conf 2022 Photos</title>
        <meta
          property="og:image"
          content="https://nextjsconf-pics.vercel.app/og-image.png"
        />
        <meta
          name="twitter:image"
          content="https://nextjsconf-pics.vercel.app/og-image.png"
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
              2022 Event Photos
            </h1>
            <p className="max-w-[40ch] text-white/75 sm:max-w-[32ch]">
              Our incredible Next.js community got together in San Francisco for
              our first ever in-person conference!
            </p>
            <a
              className="pointer z-10 mt-6 rounded-lg border border-white bg-white px-3 py-2 text-sm font-semibold text-black transition hover:bg-white/10 hover:text-white md:mt-4"
              href="https://vercel.com/new/clone?repository-url=https://github.com/vercel/next.js/tree/canary/examples/with-cloudinary&project-name=nextjs-image-gallery&repository-name=with-cloudinary&env=NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,CLOUDINARY_API_KEY,CLOUDINARY_API_SECRET,CLOUDINARY_FOLDER&envDescription=API%20Keys%20from%20Cloudinary%20needed%20to%20run%20this%20application"
              target="_blank"
              rel="noreferrer"
            >
              Clone and Deploy
            </a>
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
          {/* {images.map(({ id, public_id, format }) => (
            <Link
              key={id}
              href={`/?photoId=${id}`}
              as={`/p/${id}`}
              ref={id === Number(lastViewedPhoto) ? lastViewedPhotoRef : null}
              shallow
              className="after:content group relative mb-5 block w-full cursor-zoom-in after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight"
            >
              <Image
                alt="Next.js Conf photo"
                className="transform rounded-lg brightness-90 transition will-change-auto group-hover:brightness-110"
                style={{ transform: "translate3d(0, 0, 0)" }}
                // Removed placeholder="blur" and blurDataURL props here:
                src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${public_id}.${format}`}
                width={720}
                height={480}
                sizes="(max-width: 640px) 100vw,
             (max-width: 1280px) 50vw,
             (max-width: 1536px) 33vw,
             25vw"
              />
            </Link>
          ))} */}
          {images.length > 0 && (
            <div className="mb-10 flex flex-col items-center justify-center">
              <div className="relative w-full max-w-3xl">
                <Image
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL={'data:image/png;base64,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'}
                  alt={`Photo ${currentIndex + 1}`}
                  className="rounded-lg brightness-90 transition group-hover:brightness-110"
                  style={{ transform: "translate3d(0, 0, 0)" }}
                  src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/f_auto,q_auto:eco,w_480,dpr_auto/${images[currentIndex].public_id}.${images[currentIndex].format}`}
                  width={720}
                  height={480}
                  sizes="(max-width: 640px) 100vw,
               (max-width: 1280px) 50vw,
               (max-width: 1536px) 33vw,
               25vw"
                />
                <div className="absolute left-0 right-0 top-1/2 flex -translate-y-1/2 justify-between px-2">
                  <button
                    onClick={() => setCurrentIndex((i) => Math.max(i - 1, 0))}
                    disabled={currentIndex === 0}
                    className="rounded bg-white/20 px-4 py-2 text-white hover:bg-white/40 disabled:opacity-30"
                  >
                    ← Prev
                  </button>
                  <button
                    onClick={() =>
                      setCurrentIndex((i) => Math.min(i + 1, images.length - 1))
                    }
                    disabled={currentIndex === images.length - 1}
                    className="rounded bg-white/20 px-4 py-2 text-white hover:bg-white/40 disabled:opacity-30"
                  >
                    Next →
                  </button>
                </div>
              </div>
              <p className="mt-4 text-sm text-white/80">
                Photo {currentIndex + 1} of {images.length}
              </p>
            </div>
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
