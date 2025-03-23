import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { api } from "../api/api";

function TestUploadFile() {
  const [message, setMessage] = useState("");

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    await api.post("/suppliers/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  };

  const { mutate, isLoading } = useMutation({
    mutationFn: uploadFile,
    onSuccess: () => setMessage("File uploaded successfully!"),
    onError: () => setMessage("File upload failed!"),
  });

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setMessage("");
    mutate(file);
  };

  return (
    <div className="my-6 max-w-6xl mx-auto">
      <input
        type="file"
        id="fileUpload"
        className="hidden"
        onChange={handleFileUpload}
        disabled={isLoading}
      />
      <label
        htmlFor="fileUpload"
        className={`px-4 py-2 rounded-md cursor-pointer ${
          isLoading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 text-white"
        }`}
      >
        {isLoading ? "Uploading..." : "Upload File"}
      </label>

      {message && <p className="mt-2 text-lg font-semibold">{message}</p>}
    </div>
  );
}

export default TestUploadFile;
