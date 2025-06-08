export default function Bridge() {
  // Your direct Google Drive image URL
  const imageUrl =
    "https://drive.google.com/uc?export=view&id=10I0WgQbK5CFRzgU03DW2Bx6tHH9-QRhU";

  return (
    <img
      src={imageUrl}
      alt="Custom bridge from Google Drive"
      width={620}
      height={704}
      className="mx-auto rounded-md shadow-lg"
    />
  );
}
