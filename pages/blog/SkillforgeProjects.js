import React from 'react';
import Head from 'next/head';

export default function SkillforgeProjects() {
  return (
    <>
      <Head>
        <title>Exploring SkillForge Projects | SkillForge Blog</title>
        <meta name="description" content="Discover the exciting projects available on SkillForge that help you build real-world skills and advance your development career." />
        <meta name="keywords" content="SkillForge projects, project-based learning, software development, coding projects, developer portfolio" />
      </Head>

      <main className="bg-white min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Header Image Card */}
          <div className="mb-6 rounded-xl overflow-hidden shadow-md">
            <img
              src="https://placehold.co/600x400?text=SkillForge+Projects"
              alt="SkillForge Projects"
              className="w-full h-60 sm:h-72 object-cover"
            />
          </div>

          {/* Blog Content */}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6">
            Exploring SkillForge Projects: Building Real-World Skills
          </h1>

          <article className="prose max-w-none text-gray-800">
            <p>
              SkillForge offers a curated collection of hands-on projects designed to help developers gain practical experience and build a strong portfolio. These projects simulate real-world challenges, preparing you for the demands of the tech industry.
            </p>

            <h2>Why Choose SkillForge Projects?</h2>
            <p>
              Each project is carefully crafted to teach you essential skills such as coding best practices, problem-solving, and collaboration. Whether you're a beginner or looking to level up, SkillForge projects provide a structured path to mastery.
            </p>

            <h2>Types of Projects Available</h2>
            <p>
              From web development and mobile apps to data visualization and automation, SkillForge covers a wide range of domains. You can choose projects that align with your interests and career goals.
            </p>

            <h2>Benefits of Project-Based Learning with SkillForge</h2>
            <ul>
              <li>Gain hands-on experience with real coding challenges.</li>
              <li>Build a portfolio that impresses employers.</li>
              <li>Learn to work with modern tools and technologies.</li>
              <li>Develop problem-solving and critical thinking skills.</li>
              <li>Join a community of learners and mentors.</li>
            </ul>

            <p>
              Ready to start your journey? Visit <a href="https://skillforge.in" target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline">SkillForge</a> and explore the projects that will shape your future.
            </p>
          </article>
        </div>
      </main>
    </>
  );
}
