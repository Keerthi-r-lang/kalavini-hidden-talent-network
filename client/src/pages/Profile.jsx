import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { updateProfile } from "../services/authService";
import "./Profile.css";

function Profile() {
  const { user, updateUser } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    location: user?.location || "",
    availability: user?.availability || "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await updateProfile(formData);

      updateUser(res.user);

      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Unable to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-card">
        <h1>My Profile</h1>

        <form onSubmit={handleSubmit}>
          <label>Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            style={{ width: "100%", padding: 12, marginBottom: 20 }}
          />

          <label>Bio</label>
          <textarea
            name="bio"
            rows="4"
            value={formData.bio}
            onChange={handleChange}
            style={{ width: "100%", padding: 12, marginBottom: 20 }}
          />

          <label>Location</label>
          <input
            name="location"
            value={formData.location}
            onChange={handleChange}
            style={{ width: "100%", padding: 12, marginBottom: 20 }}
          />

          <label>Availability</label>
          <input
            name="availability"
            value={formData.availability}
            onChange={handleChange}
            style={{ width: "100%", padding: 12, marginBottom: 20 }}
          />

          <button
            type="submit"
            className="save-btn"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;