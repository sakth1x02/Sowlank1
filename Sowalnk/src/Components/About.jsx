import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800 py-10">
      <div className="container mx-auto px-6 space-y-10">
       
        <div className="text-center">
          <h1 className="text-5xl font-bold text-violet-700 mb-6">
            About Sowalnk
          </h1>
          <p className="text-lg leading-relaxed">
            Sowalnk is a task management Page designed to help you organize your tasks, achieve your goals, and stay productive.
          </p>
        </div>

  
        <section className="bg-violet-200 p-6 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-violet-700 mb-4">Our Mission</h2>
          <p className="text-lg leading-relaxed">
            To empower individuals and teams to achieve their goals by simplifying task management, enhancing productivity, and fostering a sense of accomplishment.
          </p>
        </section>

       
        <section className="bg-violet-200 p-6 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-violet-700 mb-4">Our Vision</h2>
          <p className="text-lg leading-relaxed">
            To be the most trusted and user-friendly task management platform, revolutionizing how people organize their lives and manage their priorities.
          </p>
        </section>

     
        <section className="bg-violet-200 p-6 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-violet-700 mb-4">About the Creator</h2>
          <p className="text-lg leading-relaxed">
            <strong>Mr. Gurunathan</strong>, the visionary behind Sowalnk, is committed to creating tools that simplify and enhance productivity. His leadership drives innovation and a commitment to excellence in task management solutions.
          </p>
        </section>

      
        <section className="bg-violet-200 p-6 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-violet-700 mb-4">What We Do</h2>
          <p className="text-lg leading-relaxed mb-4">
            At Sowalnk, we create tools that make managing tasks effortless and enjoyable. From planning your day to tracking your progress, we simplify productivity for everyone.
          </p>
          <ul className="list-disc pl-6 space-y-3 text-lg">
            <li>Create and organize tasks effortlessly.</li>
            <li>Set goals and deadlines with ease.</li>
            <li>Visualize and track your progress.</li>
            <li>Customize your task management experience.</li>
          </ul>
        </section>

      
        <section className="text-center">
          <h2 className="text-3xl font-bold text-violet-700 mb-4">Join Us on Our Journey</h2>
          <p className="text-lg mb-6">
            Let’s redefine productivity together. Join the <span className="text-Semibold">Sowalnk</span> community and start achieving more today!
          </p>
        </section>
      </div>
    </div>
  );
};

export default About;
