import React, { useEffect } from "react";
import { message } from "antd";
import { useNavigate,useLocation } from "react-router-dom";
import axios from "axios";
import "./style.css";

const Login = () => {
  const location = useLocation();
  useEffect(() => {
    const inputs = document.querySelectorAll(".input-field");
    const toggle_btn = document.querySelectorAll(".toggle");
    const main = document.querySelector("main");
    const bullets = document.querySelectorAll(".bullets span");
    const images = document.querySelectorAll(".image");

    let currentIndex = 0; // Initialize current index for images
    if (location.pathname === "/") {
      // Reload the page if the current route is "/"
      window.location.reload();
    }
    // Function to move the slider
    function moveSlider() {
      const index = parseInt(this.dataset.value, 10) - 1;

      images.forEach((img, i) => {
        img.classList.remove("show");
        if (i === index) {
          img.classList.add("show");
        }
      });

      const textSlider = document.querySelector(".text-group");
      textSlider.style.transform = `translateY(${-(index) * 2.2}rem)`;

      bullets.forEach((bull) => bull.classList.remove("active"));
      this.classList.add("active");
      currentIndex = index;
    }

    // Function to move to the next image automatically
    function moveToNextImage() {
      const nextIndex = (currentIndex + 1) % images.length;
      bullets[nextIndex].click(); // Trigger click event on next bullet
    }

    // Attach event listeners to bullets
    bullets.forEach((bullet) => {
      bullet.addEventListener("click", moveSlider);
    });

    // Start automatic sliding
    const intervalId = setInterval(moveToNextImage, 3000); // Change image every 3 seconds

    // Cleanup function to remove event listeners and clear interval
    return () => {
      inputs.forEach((inp) => {
        inp.removeEventListener("focus", () => {
          inp.classList.add("active");
        });
        inp.removeEventListener("blur", () => {
          if (inp.value !== "") return;
          inp.classList.remove("active");
        });
      });

      toggle_btn.forEach((btn) => {
        btn.addEventListener("click", () => {
          main.classList.toggle("sign-up-mode");
        });
      });

      bullets.forEach((bullet) => {
        bullet.removeEventListener("click", moveSlider);
      });

      clearInterval(intervalId); // Clear the interval when component unmounts
    };
  }, [location.pathname]);

  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    try {
      // Get the values from the form
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      // Create an object to hold the form data
      const formData = {
        email: email,
        password: password,
      };

      console.log(formData);

      // POST the form data to the server using Axios
      const response = axios.post(
        "http://localhost:3002/api/v1/userLogin",
        formData
      );

      response
        .then((response) => {
          // Handle response
          navigate("/");
          message.success("Logged in successfully!");
          console.log(response.data);
          const userData = {
            userId: response.data.user._id,
            userName: response.data.user.name,
            userEmail: response.data.user.email,
            // Omitting the password field for security reasons
          };

          localStorage.setItem("userId", userData.userId);
          localStorage.setItem("userName", userData.userName);
          localStorage.setItem("userEmail", userData.userEmail);
        })
        .catch((error) => {
          // Handle error
          console.error("Error:", error);
        });
    } catch (error) {
      console.error("Error:", error);
    }
  }

  function registerSubmit(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    // Access form data from the event object
    const formData = new FormData(event.target);

    // Convert FormData object to JSON
    const formDataJSON = {};
    formData.forEach((value, key) => {
      formDataJSON[key] = value;
    });

    console.log(formDataJSON);

    // POST the form data to the server using Axios
    axios
      .post(
        "http://localhost:3000/api/v1/userRegister",
        formDataJSON
      )
      .then((response) => {
        // Handle response
        console.log(response.data);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
        message.success("Account created successfully!");
        // Reload after 1 second
      })
      .catch((error) => {
        // Handle error
        console.error("Error:", error);
      });
  }

  return (
    <main>
      <div className="box">
        <div className="inner-box">
          <div className="forms-wrap">
            <form
              autoComplete="off"
              className="sign-in-form"
              id="login-form"
              onSubmit={handleSubmit}
            >
              <div className="logo">
                <h4
                  style={{
                    fontWeight: "bold",
                    color: "rgb(45, 82, 231)",
                    fontSize: 25,
                  }}
                >
                  Expense Tracker!
                </h4>
              </div>
              <div className="heading">
                <h2>Welcome Back</h2>
                <h6>Not registered yet?</h6>
                <a href="#" className="toggle">
                  Sign up
                </a>
              </div>
              <div className="actual-form">
                <label htmlFor="email" className="">Email</label>
                <div className="input-wrap">
                  <input
                    type="email"
                    id="email"
                    className="shadow-sm rounded-md w-full px-12 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="your@email.com"
                    style={{ paddingLeft: "10px" }}
                  />
                </div>
                <label htmlFor="password" className="">Password</label>
                <div className="input-wrap">
                  <input
                    id="password"
                    type="password"
                    className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter your password"
                  />
                </div>
                <div className="login-button-class">
                  <input
                    type="submit"
                    defaultValue="Sign In"
                    className="sign-btn"
                  />
                </div>

                <p className="text">
                  Forgotten your password or your login details?
                  <a href="#">Get help</a> signing in
                </p>
              </div>
            </form>
            <form
              autoComplete="off"
              className="sign-up-form"
              onSubmit={registerSubmit}
            >
              <div className="logo">
                <h4
                  style={{
                    fontWeight: "bold",
                    color: "rgb(45, 82, 231)",
                    fontSize: 25,
                  }}
                >
                  Expense Tracker!
                </h4>
              </div>
              <div className="heading">
                <h2>Get Started</h2>
                <h6>Already have an account?</h6>
                <a href="#" className="toggle">
                  Sign in
                </a>
              </div>
              <div className="actual-form">
                <label htmlFor="name" className="">Name</label>
                <div className="input-wrap">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="shadow-sm rounded-md w-full px-12 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Name :"
                    style={{ paddingLeft: "10px" }}
                  />
                </div>
                <label htmlFor="email" className="">Email</label>
                <div className="input-wrap">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="shadow-sm rounded-md w-full px-12 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="your@email.com"
                    style={{ paddingLeft: "10px" }}
                  />
                </div>
                <label htmlFor="password" className="">Password</label>
                <div className="input-wrap">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter your password"
                  />
                </div>
                <div className="input-wrap">
                  <div className="login-button-class">
                    <input
                      type="submit"
                      defaultValue="Sign Up"
                      className="sign-btn"
                      id="reg-button"
                    />
                  </div>
                </div>

                <p className="text">
                  By signing up, I agree to the
                  <a href="#">Terms of Services</a> and
                  <a href="#">Privacy Policy</a>
                </p>
              </div>
            </form>
          </div>
          <div className="carousel">
            <div className="images-wrapper">
              <img src="./expense3.png" className="image img-1 show" alt="invalid" />
              <img src="./expense4.png" className="image img-2" alt="invalid" />
              <img src="./expense1.png" className="image img-3" alt="invalid" />
            </div>
            <div className="text-slider">
              <div className="text-wrap">
                <div className="text-group">
                  <h2>Explore our expense tracker!</h2>
                  <h2>Track your expenses</h2>
                  <h2>Lets save together</h2>
                </div>
              </div>
              <div className="bullets">
                <span className="active" data-value={1} />
                <span data-value={2} />
                <span data-value={3} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;
