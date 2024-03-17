const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "temp/" });
const bodyParser = require("body-parser");
const AdminProfile = require("../models/AdminProfile");
const employerProfile = require("../models/EmployerProfile");
const userProfile = require("../models/UserProfile");
const Application = require("../models/Application");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const jobPosting = require("../models/job-postings");
const MailingList = require("../models/mailing-lists");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
require("dotenv").config();

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post('/admin-login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await AdminProfile.findOne({ username });

    if (!admin || admin.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json(admin);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.patch('/admin-profile/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password, userrole, permissions } = req.body;

    const updatedProfile = await AdminProfile.findByIdAndUpdate(
      id,
      { username, password, userrole, permissions },
      { new: true }
    );

    if (!updatedProfile) {
      return res.status(404).json({ message: 'Admin profile not found' });
    }

    res.json(updatedProfile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get("/all-applications", async (req, res, next) => {
  try {
    const applicationsData = await Application.find();

    if (!applicationsData || applicationsData.length === 0) {
      return res.status(404).json({ message: "No Applications found" });
    }

    return res.status(200).json({ data: applicationsData });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/all-employers", async (req, res, next) => {
  try {
    const employersData = await employerProfile.find();

    if (!employersData || employersData.length === 0) {
      return res.status(404).json({ message: "No Employers found" });
    }

    return res.status(200).json({ data: employersData });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/all-mailing-list", async (req, res, next) => {
  try {
    const mailingListData = await MailingList.find();

    if (!mailingListData || mailingListData.length === 0) {
      return res.status(404).json({ message: "No Emails found" });
    }

    return res.status(200).json({ data: mailingListData });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/all-users", async (req, res, next) => {
  try {
    const usersData = await userProfile.find();

    if (!usersData || usersData.length === 0) {
      return res.status(404).json({ message: "No Users found" });
    }

    return res.status(200).json({ data: usersData });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/employer-login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user with given email exists
    const user = await employerProfile.findOne({ email });
    if (!user) {
      return res.status(400).send("Invalid email or password.");
    }

    // Check if password is valid
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).send("Invalid email or password.");
    }

    // Generate JWT token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    res.status(200).header("auth-token", token).send({
      token,
      cname: user.cname,
      email: user.email,
      usertype: "employer",
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

router.post("/employer-signup", (req, res, next) => {
  const { cname, email, password, description, imageUrl } = req.body;
  employerProfile.findOne({ email }, (err, employer) => {
    if (err) {
      return next(err);
    }
    if (employer) {
      return res.status(409).json({ error: "Email is already taken" });
    }
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        return next(err);
      }
      const newEmployer = new employerProfile({
        cname,
        email,
        password: hashedPassword,
        description,
        imageUrl,
      });
      newEmployer.save((err) => {
        if (err) {
          return next(err);
        }
        const token = jwt.sign({ email }, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });
        return res.status(200).json({
          token,
          cname: newEmployer.cname,
          email: newEmployer.email,
          description: newEmployer.description,
          imageUrl: newEmployer.imageUrl,
        });
      });
    });
  });
});

router.patch("/employerprofiles/:id", (req, res, next) => {
  jobPosting
    .findOneAndUpdate({ _id: req.params.id }, req.body)
    .then(() => res.json(req.body))
    .catch(next);
});

router.get("/employerprofile", async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const employerProfileData = await employerProfile.findOne({
      _id: decodedToken._id,
    });

    if (!employerProfileData) {
      return res.status(404).json({ message: "User profile not found" });
    }

    return res.status(200).json({ data: employerProfileData });
  } catch (error) {
    return res.status(401).json({ message: "Authentication failed" });
  }
});

router.patch("/employerprofile", async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const employerProfileData = await employerProfile.findOne({
      _id: decodedToken._id,
    });

    if (!employerProfileData) {
      return res.status(404).json({ message: "Employer profile not found" });
    }

    employerProfileData.email = req.body.email || employerProfileData.email;

    if (req.body.password) {
      if (/^\$2[ayb]\$.{56}$/.test(req.body.password)) {
        // If password is already hashed, use as is
        employerProfileData.password = req.body.password;
      } else {
        // Hash the password if it is not already hashed
        const salt = await bcrypt.genSalt(10);
        employerProfileData.password = await bcrypt.hash(
          req.body.password,
          salt
        );
      }
    } else {
      employerProfileData.password = employerProfileData.password;
    }

    employerProfileData.description =
      req.body.description || employerProfileData.description;

    await employerProfileData.save();

    return res
      .status(200)
      .json({ message: "Employer profile updated successfully" });
  } catch (error) {
    return res.status(401).json({ message: "Authentication failed" });
  }
});

router.post("/user-login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user with given email exists
    const user = await userProfile.findOne({ email });
    if (!user) {
      return res.status(400).send("Invalid email or password.");
    }

    // Check if password is valid
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).send("Invalid email or password.");
    }

    // Generate JWT token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    res.status(200).header("auth-token", token).send({
      token,
      username: user.username,
      email: user.email,
      usertype: "user",
    });
    res.status({});
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

router.post("/user-signup", (req, res, next) => {
  const { username, email, password, description, imageUrl } = req.body;
  userProfile.findOne({ email }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (user) {
      return res.status(409).json({ error: "Email is already taken" });
    }
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        return next(err);
      }
      const newUser = new userProfile({
        username,
        email,
        password: hashedPassword,
        description,
        imageUrl,
      });
      newUser.save((err) => {
        if (err) {
          return next(err);
        }
        const token = jwt.sign({ email }, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });
        return res.status(200).json({
          token,
          username: newUser.cname,
          email: newUser.email,
          description: newUser.description,
          imageUrl: newUser.imageUrl,
        });
      });
    });
  });
});

router.get("/userprofiles", async (req, res, next) => {
  // This will return all the data, exposing only the id and action field to the client
  try {
    const { key, page, limit } = req.query;
    const skip = (page - 1) * limit;
    const search = key
      ? {
          $or: [
            { username: { $regex: key, $options: "$i" } },
            { email: { $regex: key, $options: "$i" } },
            { password: { $regex: key, $options: "$i" } },
            { description: { $regex: key, $options: "$i" } },
            { imageUrl: { $regex: key, $options: "$i" } },
          ],
        }
      : {};

    const data = await userProfile
      .find(search)
      .populate("username")
      .skip(skip)
      .limit(limit);
    res.json({ data });
  } catch (error) {
    console.log(error);
  }
});

router.get("/userprofile", async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const userProfileData = await userProfile.findOne({
      _id: decodedToken._id,
    });

    if (!userProfileData) {
      return res.status(404).json({ message: "User profile not found" });
    }

    return res.status(200).json({ data: userProfileData });
  } catch (error) {
    return res.status(401).json({ message: "Authentication failed" });
  }
});

router.patch("/userprofile", async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const userProfileData = await userProfile.findOne({
      _id: decodedToken._id,
    });

    if (!userProfileData) {
      return res.status(404).json({ message: "User profile not found" });
    }

    userProfileData.username = req.body.username || userProfileData.username;
    userProfileData.email = req.body.email || userProfileData.email;

    if (req.body.password) {
      if (/^\$2[ayb]\$.{56}$/.test(req.body.password)) {
        // If password is already hashed, use as is
        userProfileData.password = req.body.password;
      } else {
        // Hash the password if it is not already hashed
        const salt = await bcrypt.genSalt(10);
        userProfileData.password = await bcrypt.hash(req.body.password, salt);
      }
    } else {
      userProfileData.password = userProfileData.password;
    }

    userProfileData.description =
      req.body.description || userProfileData.description;

    await userProfileData.save();

    return res
      .status(200)
      .json({ message: "User profile updated successfully" });
  } catch (error) {
    return res.status(401).json({ message: "Authentication failed" });
  }
});

router.get("/job-postings", async (req, res, next) => {
  try {
    res.sendStatus(200);
    const { key, page, limit } = req.query;
    const skip = (page - 1) * limit;
    const search = key
      ? {
          $or: [
            { company: { $regex: key, $options: "$i" } },
            { title: { $regex: key, $options: "$i" } },
          ],
        }
      : {};

    const data = await jobPosting
      .find(search)
      .populate("company")
      .skip(skip)
      .limit(limit);
    res.json({ data });
  } catch (error) {
    console.log(error);
  }
});

router.get("/all-job-postings", async (req, res, next) => {
  try {
    const jobPostingsData = await jobPosting.find();

    if (!jobPostingsData || jobPostingsData.length === 0) {
      return res.status(404).json({ message: "No job postings found" });
    }

    return res.status(200).json({ data: jobPostingsData });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/job-posting", async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const { cname } = await employerProfile.findById(decodedToken._id);

    const jobPostingsData = await jobPosting.find({ company: cname });

    if (!jobPostingsData || jobPostingsData.length === 0) {
      return res.status(404).json({ message: "No job postings found" });
    }

    return res.status(200).json({ data: jobPostingsData });
  } catch (error) {
    return res.status(403).json({ message: "Authentication failed" });
  }
});

router.post("/job-postings", (req, res, next) => {
  if (req.body.company) {
    employerProfile
      .findOne({ cname: req.body.company }) // Search for matching employerProfile
      .then((profile) => {
        if (profile) {
          req.body.imageUrl = profile.imageUrl; // Set jobPosting.imageUrl to employerProfile.imageUrl
          jobPosting
            .create(req.body)
            .then((data) => {
              res.json(data);
              sendJobPostingEmail(data);
            })
            .catch(next);
          res.status(200);
        } else {
          res.json({
            error: "No matching employerProfile found",
          });
        }
      })
      .catch(next);
  } else {
    res.json({
      error: "The input field is empty",
    });
  }
});

router.delete("/job-postings/:id", (req, res, next) => {
  res.sendStatus(200);
  jobPosting
    .findOneAndDelete({ _id: req.params.id })
    .then((data) => {
      Application.deleteMany({ jobPostingId: req.params.id })
        .then(() => res.json(data))
        .catch(next);
    })
    .catch(next);
});

router.patch("/job-postings/:id", (req, res, next) => {
  jobPosting
    .findOneAndUpdate({ _id: req.params.id }, req.body)
    .then(() => {
      Application.deleteMany({ jobPostingId: req.params.id })
        .then(() => res.json(req.body))
        .catch(next);
    })
    .catch(next);
});

router.post("/application", upload.single("coverLetter"), async (req, res) => {
  try {
    console.log(req.body);
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const userProfileData = await userProfile.findById(decodedToken._id);

    if (!userProfileData) {
      return res.status(401).json({ message: "User not found" });
    }

    const oldFilePath = `./${req.file.path}`;
    const extension = path.extname(req.file.originalname);
    const newFileName = crypto.randomBytes(16).toString("hex") + extension;
    const newFilePath = `./client/public/uploads/${newFileName}`;

    fs.rename(oldFilePath, newFilePath, async (err) => {
      if (err) {
        console.error(err);
        res.status(500).send("Failed to save file");
      } else {
        try {
          const newApplication = new Application({
            status: "new",
            jobPostingId: req.body.jobPostingId,
            userId: decodedToken._id,
            username: userProfileData.username,
            email: userProfileData.email,
            description: userProfileData.description,
            imageUrl: userProfileData.imageUrl,
            resume: userProfileData.resume,
            coverLetter: newFileName,
            company: req.body.company,
            title: req.body.title,
            companyImageUrl: req.body.companyImageUrl,
            companyDescription: req.body.description,
          });

          await newApplication.save();

          res.sendStatus(200);
        } catch (error) {
          console.error(error);
          res.status(500).send("Failed to create application");
        }
      }
    });
  } catch (error) {
    return res.status(401).json({ message: "Authentication failed" });
  }
});

router.get("/application/:jobpostingid", async (req, res) => {
  try {
    const jobPostingId = req.params.jobpostingid;
    const applications = await Application.find({ jobPostingId });
    return res.status(200).json({ data: applications });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/applications", async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken._id;
    const applications = await Application.find({ userId });
    return res.status(200).json({ data: applications });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.patch("/application/:applicationid", async (req, res) => {
  try {
    const applicationId = req.params.applicationid;

    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    const status = req.body.status;
    application.status = status;
    await application.save();

    // Update user profile notification if status is interview or rejected
    if (status === "interview" || status === "rejected") {
      const userId = application.userId;

      const userProfileData = await userProfile.findById(userId);

      if (!userProfileData) {
        return res.status(404).json({ message: "User profile not found" });
      }

      userProfileData.notification = true;
      await userProfileData.save();
    }

    return res
      .status(200)
      .json({ message: "Application updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/notification", async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userProfileData = await userProfile.findById(decodedToken._id);
    if (!userProfileData) {
      return res.status(404).json({ message: "User profile not found" });
    }
    const notification = userProfileData.notification;
    return res.status(200).json({ data: notification });
  } catch (error) {
    return res.status(401).json({ message: "Authentication failed" });
  }
});

router.post("/removenotification", async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userProfileData = await userProfile.findById(decodedToken._id);
    if (!userProfileData) {
      return res.status(404).json({ message: "User profile not found" });
    }
    userProfileData.notification = false;
    await userProfileData.save();
    return res.status(200).json({ message: "Notification removed" });
  } catch (error) {
    return res.status(401).json({ message: "Authentication failed" });
  }
});

router.post("/resume", upload.single("resume"), async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const userProfileData = await userProfile.findById(decodedToken._id);

    if (!userProfileData) {
      return res.status(401).json({ message: "User not found" });
    }

    const oldFilePath = `./${req.file.path}`;
    const extension = path.extname(req.file.originalname);
    const newFileName = crypto.randomBytes(16).toString("hex") + extension;
    const newFilePath = `./client/public/uploads/${newFileName}`;

    fs.rename(oldFilePath, newFilePath, async (err) => {
      if (err) {
        console.error(err);
        res.status(500).send("Failed to save file");
      } else {
        try {
          userProfileData.resume = newFileName;
          await userProfileData.save();
          res.sendStatus(200);
        } catch (error) {
          console.error(error);
          res.status(500).send("Failed to update user");
        }
      }
    });
  } catch (error) {
    return res.status(401).json({ message: "Authentication failed" });
  }
});

router.post("/pic", upload.single("pic"), async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const userProfileData = await userProfile.findById(decodedToken._id);

    if (!userProfileData) {
      return res.status(401).json({ message: "User not found" });
    }

    const oldFilePath = `./${req.file.path}`;
    const extension = path.extname(req.file.originalname);
    const newFileName = crypto.randomBytes(16).toString("hex") + extension;
    const newFilePath = `./client/public/uploads/${newFileName}`;

    fs.rename(oldFilePath, newFilePath, async (err) => {
      if (err) {
        console.error(err);
        res.status(500).send("Failed to save file");
      } else {
        try {
          userProfileData.imageUrl = newFileName;
          await userProfileData.save();
          res.sendStatus(200);
        } catch (error) {
          console.error(error);
          res.status(500).send("Failed to update user");
        }
      }
    });
  } catch (error) {
    return res.status(401).json({ message: "Authentication failed" });
  }
});

router.post("/logo", upload.single("logo"), async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const employerProfileData = await employerProfile.findById(
      decodedToken._id
    );

    if (!employerProfileData) {
      return res.status(401).json({ message: "Employer not found" });
    }

    const oldFilePath = `./${req.file.path}`;
    const extension = path.extname(req.file.originalname);
    const newFileName = crypto.randomBytes(16).toString("hex") + extension;
    const newFilePath = `./client/public/uploads/${newFileName}`;

    fs.rename(oldFilePath, newFilePath, async (err) => {
      if (err) {
        console.error(err);
        res.status(500).send("Failed to save file");
      } else {
        try {
          employerProfileData.imageUrl = newFileName;
          await employerProfileData.save();
          res.sendStatus(200);
        } catch (error) {
          console.error(error);
          res.status(500).send("Failed to update employer");
        }
      }
    });
  } catch (error) {
    return res.status(401).json({ message: "Authentication failed" });
  }
});

router.post("/mailing-lists", async (req, res) => {
  try {
    const newSubscriber = await MailingList.create({
      email: req.body.email, // assuming the email is provided in the request body
    });
    res.status(200).send({
      message: "Subscriber added to mailing list",
      data: newSubscriber,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal server error" });
  }
});

router.get("/mailing-lists", async (req, res) => {
  try {
    const subscribers = await MailingList.find(); // retrieve all subscribers from the database
    res.status(200).send(subscribers); // send the subscribers as a JSON response
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal server error" });
  }
});

async function sendJobPostingEmail(jobPostingData) {
  try {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      service: "hotmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    // get all emails from mailing list in database
    const data = await MailingList.find({}, "email");

    // create comma-separated list of emails
    const emailList = data.map((item) => item.email).join(",");

    // send email to all subscribers
    await transporter.sendMail({
      from: process.env.EMAIL,
      bcc: emailList,
      subject: "New job posting!",
      html: `<p>Check out our latest job posting:</p>
            <p>Company: ${jobPostingData.company}</p>
            <p>Title: ${jobPostingData.title}</p>
            <p>Description: ${jobPostingData.description}</p>`,
    });
  } catch (error) {
    console.error(error);
  }
}

module.exports = router;
