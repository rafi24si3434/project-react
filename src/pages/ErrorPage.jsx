import { Link } from "react-router-dom";

export default function ErrorPage({
  code = "404",
  description = "Page not found",
  image,
}) {
  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4">
      <div className="text-center max-w-md">

        {/* Image */}
        {image && (
          <img
            src={image}
            alt={`error-${code}`}
            className="w-56 mx-auto mb-6"
          />
        )}

        {/* Code */}
        <h1 className="text-6xl font-bold text-gray-800">
          {code}
        </h1>

        {/* Title (auto based on code) */}
        <h2 className="text-xl font-semibold text-gray-700 mt-2">
          {code === "404" && "Page Not Found"}
          {code === "400" && "Bad Request"}
          {code === "401" && "Unauthorized"}
          {code === "403" && "Forbidden"}
        </h2>

        {/* Description */}
        <p className="text-gray-500 mt-3">
          {description}
        </p>

        {/* Button */}
        <Link
          to="/"
          className="inline-block mt-6 bg-green-500 text-white px-5 py-2 rounded-xl shadow hover:bg-green-600 transition"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}