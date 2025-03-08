import React from "react";
import About from "./About";
import Feature from "./Feature";
import Subscription from "./Subscription";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  const auth = useSelector((state) => state.user.loggedInUser);
  const scrollToSignUp = () => {
    auth ? navigate("/dashboard") : navigate("/login");
  };

  const testimonials = [
    {
      name: "Praveen",
      feedback:
        "This app completely transformed my productivity! It's intuitive and easy to use.",
      image: "/vite.svg",
    },
    {
      name: "Sumithra",
      feedback:
        "I love how customizable the app is! It's perfect for organizing my day and tasks.",
      image: "/vite.svg",
    },
    {
      name: "Ravi",
      feedback:
        "Highly recommend! The reminders and due dates feature helped me stay on top of my tasks.",
      image: "/vite.svg",
    },
  ];

  return (
    <div>
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="container mx-auto px-4 lg:px-6 py-6 lg:py-10">
          <h1 className="text-4xl lg:text-5xl font-bold text-violet-700 mb-6">
            Welcome to Sowalnk
          </h1>

          <section className="bg-violet-200 text-black py-16 lg:py-32 rounded-lg">
            <div className="container mx-auto text-center px-4">
              <h1 className="text-3xl lg:text-5xl font-bold mb-6">
                Master Your Day with Sowalnk
              </h1>
              <p className="text-base lg:text-xl mb-8">
                A to-do list app that adapts to your productivity level—whether
                you're keeping it simple or aiming higher.
              </p>
              <button
                onClick={scrollToSignUp}
                className="px-6 lg:px-8 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition"
              >
                Get Started
              </button>
            </div>
          </section>
        </div>

        {/* About Section */}
        <div className="mt-8">
          <About />
        </div>

        {/* Feature Section */}
        <div className="mt-8">
          <Feature />
        </div>

        {/* Subscription Section */}
        <div className="mt-8">{auth && <Subscription />}</div>

        {/* Testimonials Section */}
        <section className="bg-gray-100 py-12 mt-8">
          <div className="container mx-auto px-4 lg:px-6 text-center">
            <h2 className="text-2xl lg:text-3xl font-semibold mb-6 text-gray-800">
              What Our Users Say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-white p-4 lg:p-6 rounded-lg shadow-lg hover:shadow-xl transition-all"
                >
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full mx-auto mb-4"
                  />
                  <p className="text-sm lg:text-lg font-semibold text-gray-800 mb-4">
                    {testimonial.feedback}
                  </p>
                  <p className="text-gray-500 text-sm">- {testimonial.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LandingPage;
