import React from 'react';

const programs = [
  {
    title: "Photography Workshops",
    duration: "8 Weeks",
    description: "Hands-on photography sessions covering technical skills, creative composition, and personal projects.",
    details: ["Small group settings", "Camera provided", "Weekly assignments", "Final exhibition"]
  },
  {
    title: "Mindset Mentoring",
    duration: "Ongoing",
    description: "One-on-one sessions focusing on creative confidence, goal setting, and personal development.",
    details: ["Individual attention", "Custom growth plan", "Regular check-ins", "Parent updates"]
  },
  {
    title: "Teen Creative Club",
    duration: "Monthly",
    description: "A community space for teens to share work, collaborate, and inspire each other.",
    details: ["Peer feedback", "Guest speakers", "Group projects", "Social events"]
  }
];

export default function Programs() {
  return (
    <section className="mb-20">
      <h2 className="text-3xl font-bold mb-6 text-gray-900">Our Programs</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {programs.map((program, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold mb-2 text-gray-900">{program.title}</h3>
            <p className="text-sm text-gray-500 mb-4">{program.duration}</p>
            <p className="text-gray-700 mb-4">{program.description}</p>
            <ul className="space-y-2">
              {program.details.map((detail, idx) => (
                <li key={idx} className="text-sm text-gray-600">• {detail}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}