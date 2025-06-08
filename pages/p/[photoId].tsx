import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const router = useRouter();
  const { photoId } = router.query;

  // Use your custom Google Drive image
  const imageUrl = "https://drive.google.com/uc?export=view&id=10I0WgQbK5CFRzgU03DW2Bx6tHH9-QRhU";

  return (
    <>
      <Head>
        <title>Custom Image</title>
        <meta property="og:image" content={imageUrl} />
        <meta name="twitter:image" content={imageUrl} />
      </Head>
      <main className="mx-auto max-w-[1960px] p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Custom Image</h1>
        <img
          src={imageUrl}
          alt="Custom from Google Drive"
          className="mx-auto max-w-full h-auto rounded-lg shadow-lg"
        />
      </main>
    </>
  );
};

export default Home;
