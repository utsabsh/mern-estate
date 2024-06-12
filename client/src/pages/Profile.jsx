import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRef } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserFailure,
  signOutUserStart,
  signOutUserSuccess,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "../redux/user/userSlice";
import { Link } from "react-router-dom";

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePrec, setFilePrec] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const dispatch = useDispatch();

  console.log(formData);
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);
  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("upload is " + progress + "% done");
        setFilePrec(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };
  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };
  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(error.message));
        return;
      }
      dispatch(signOutUserSuccess());
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className=" text-3xl font-semibold text-center my-7">Profile</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center"
        />
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span>Error Image upload (image must be less than 2mb) </span>
          ) : filePrec > 0 && filePrec < 100 ? (
            <span className="text-slate-700">{`uploading ${filePrec}:`}</span>
          ) : filePrec === 100 ? (
            <span className="text-green-700">Image upload successfully</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          placeholder="Username"
          className="rounded-lg p-3 border"
          defaultValue={currentUser.username}
          id="username"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="Email"
          className="rounded-lg p-3 border"
          defaultValue={currentUser.email}
          id="email"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          className="rounded-lg p-3 border"
          // defaultValue={currentUser.password}
          id="password"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "lodaing" : "Update"}
        </button>
        <Link
          to="/create-listing"
          className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
        >
          Create
        </Link>
      </form>

      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteUser}
          className="text-red-700 cursor-pointer capitalize"
        >
          Delete account
        </span>
        <span
          onClick={handleSignOut}
          className="text-red-700 cursor-pointer capitalize"
        >
          sign out
        </span>
      </div>
      <div className="text-center mt-3">
        <span className="text-red-800">{error ? error : ""}</span>
        <span className="text-green-800 capitalize">
          {updateSuccess ? "successfully updated!" : ""}
        </span>
      </div>
    </div>
  );
}
