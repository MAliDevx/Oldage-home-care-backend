import Profile from "../models/profile.model.js";
import { User, Subject, Enrollment } from "../models/user.model.js";
import mongoose from "mongoose";
import { message, statusCode } from '../utils/handlers/response.constants.js';
import { useSuccessResponse, useErrorResponse, useInterServerErrorResponse } from '../utils/handlers/response.handlers.js';

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const profile = await Profile.findOne({ user: userId })
      .populate("user", "name email role"); // select only needed fields

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    return useSuccessResponse(
      res,
      "Profile fetched successfully",
      profile
    );

  } catch (error) {
    return useInterServerErrorResponse(res, error.message);
  }
};


export const updateUserProfile = async (req, res) => {
  try {
 const { id: userId, role } = req.user;
     
   
    let profile = await Profile.findOne({ user: userId });

    if (!profile) {
      profile = new Profile({ user: userId });
    }

    const { about, skills, profileImage, experienceYears } = req.body;

    if (about !== undefined) profile.about = about;
    if (skills !== undefined && Array.isArray(skills)) profile.skills = skills.slice(0, 5); // max 5 skills
    if (profileImage !== undefined) profile.profileImage = profileImage;
    // if (isTeacher !== undefined) profile.isTeacher = isTeacher;
    if (experienceYears !== undefined) profile.experienceYears = experienceYears;

    await profile.save();

    return useSuccessResponse(res, "Profile updated successfully", profile);
  } catch (error) {
    return useInterServerErrorResponse(res, error.message);
  }
};