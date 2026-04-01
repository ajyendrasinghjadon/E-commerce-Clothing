import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateSiteSettings } from "../../redux/slices/siteSettingsSlice";
import { FiUploadCloud, FiX } from "react-icons/fi";

const ImageEditModal = ({ field, currentUrl, onClose }) => {
  const dispatch = useDispatch();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(currentUrl);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("field", field);

    try {
      await dispatch(updateSiteSettings(formData)).unwrap();
      onClose();
    } catch (error) {
      console.error("Failed to update image:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-[18px] font-medium text-gray-900 capitalize">
            Update {field.replace(/([A-Z])/g, " $1")}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-gray-700 mb-2">New Image Preview</label>
            <div className="relative aspect-[16/9] bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
              {preview ? (
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No image selected
                </div>
              )}
            </div>
          </div>

          <div className="mb-6">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all duration-200">
              <FiUploadCloud className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-[13px] text-gray-600">
                <span className="font-semibold text-gray-900">Click to upload</span>
              </p>
              <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
            </label>
          </div>

          <button
            type="submit"
            disabled={!selectedFile || uploading}
            className={`w-full py-3 rounded-lg text-[14px] font-medium transition-all duration-200 
              ${!selectedFile || uploading 
                ? "bg-gray-200 text-gray-500 cursor-not-allowed" 
                : "bg-gray-900 text-white hover:bg-black shadow-md"}`}
          >
            {uploading ? "Updating..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ImageEditModal;
