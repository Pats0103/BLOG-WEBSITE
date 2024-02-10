import bcrypt from "bcrypt";
import ApiResponse from "../utils/ApiResponse.js";
import User from "../Schema/User.js";
import { nanoid } from "nanoid";


let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

const genenrateUsername = async (email) => {
  let username = email.split("@")[0];
  let user = await User.findOne({ "personal_info.username": username });
  if (user) {
    username = username + nanoid(3);
  }

  return username;
};

const formateDatatoSend = (user) => {
    const access_token = user.generateToken();

  return {
    access_token,
    profile_img: user.personal_info.profile_img,
    username: user.personal_info.username,
    fullname: user.personal_info.fullname,
    email: user.personal_info.email,
  };
};

const SignUp = async (req, res) => {
  const { fullname, email, password } = req.body;
  if (fullname.length < 3) {
    return ApiResponse(res, 400, "Fullname must be at least 3 characters long");
  }

  if (!email.match(emailRegex)) {
    return ApiResponse(res, 400, "Invalid email address");
  }

  if (!password.match(passwordRegex)) {
    return ApiResponse(
      res,
      400,
      "Password must contain at least one uppercase letter, one lowercase letter and one number"
    );
  }

  bcrypt.hash(password, 10, async (err, hash) => {
    if (err) {
      return ApiResponse(
        res,
        500,
        "An error occurred while hashing the password"
      );
    }
    let username = await genenrateUsername(email);
    const user = new User({
      personal_info: {
        fullname,
        email,
        password: hash,
        username,
      },
    });

    user
      .save()
      .then((user) => {
        return ApiResponse(
          res,
          201,
          "User created successfully",
          formateDatatoSend(user)
        );
      })
      .catch((err) => {
        console.log(err.message);

        if (err.code === 11000) {
          return ApiResponse(res, 400, "User with this email already exists");
        }

        return ApiResponse(
          res,
          500,
          "An error occurred while creating the user"
        );
      });
  });
};

const SignIn = async (req, res) => {
  const { email, password } = req.body;
  let   user = await User.findOne({ "personal_info.email": email });
    if (!user) {
        return ApiResponse(res, 400, "User with this email does not exist");
    }

    bcrypt.compare(password, user.personal_info.password, (err, result) => {
        if (err) {
            return ApiResponse(res, 500, "An error occurred while logging in");
        }

        if (!result) {
            return ApiResponse(res, 400, "Invalid password");
        }

        return ApiResponse(res, 200, "User signed in successfully", formateDatatoSend(user));
    });

}



export { SignUp , SignIn};
