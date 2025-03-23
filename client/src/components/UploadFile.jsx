import React, { useState } from "react";
import { api } from "../api/api";

function UploadFile() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setMessage("");

    try {
      await api.post("/suppliers/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("File uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file", error);
      setMessage("File upload failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-6">
      <input
        type="file"
        id="fileUpload"
        className="hidden"
        onChange={handleFileUpload}
        disabled={loading}
      />
      <label
        htmlFor="fileUpload"
        className={`px-4 py-2 rounded-md cursor-pointer ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 text-white"
        }`}
      >
        {loading ? "Uploading..." : "Upload File"}
      </label>

      {message && <p className="mt-2 text-lg font-semibold">{message}</p>}
    </div>
  );
}

export default UploadFile;
