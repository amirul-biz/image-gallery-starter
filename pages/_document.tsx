import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <meta
            name="description"
            content={process.env.NEXT_PUBLIC_CLOUDINARY_DETAILS}
          />
          <meta property="og:site_name" content="nextjsconf-pics.vercel.app" />
          <meta
            property="og:description"
            content={process.env.NEXT_PUBLIC_CLOUDINARY_DETAILS}
          />
          <meta property="og:title" content={process.env.NEXT_PUBLIC_CLOUDINARY_TITLE} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={process.env.NEXT_PUBLIC_CLOUDINARY_TITLE} />
          <meta
            name="twitter:description"
            content={process.env.NEXT_PUBLIC_CLOUDINARY_DETAILS}
          />
        </Head>
        <body className="bg-black antialiased">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
