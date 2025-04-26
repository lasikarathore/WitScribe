import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import Navbar from '../Components/Navbar';

const faqData = [
  { question: "What is WitScribe?", answer: "WitScribe is an educational platform where anyonne and everyone can learn and grow. The main objective of WitScribe is to make Learning Accessible to All. " },
  { question: "Who can use this platform?", answer: "Anyone & Everyone , whether you are a student , a professional , an individual with different style of thinking , a Lifelong Learner etc.. " },
  {
    question: "Can I use it for non-educational videos like cooking or DIY?",
    answer: "While the focus is education, non-educational content is allowed as long as it’s informative and safe."
  },
  { question: "What is the Study Room?", answer: "The Study Room is a feature where users can collectively discuss and collaborate on various topics, ask questions, provide answers and many more..." },
  { question: "Do I need the internet all the time?", answer: "You need internet to access content, but downloaded files can be viewed offline." }
];

const FAQItem = ({ question, answer, isOpen, onClick }) => (
  <div className="border-b">
    <button
      onClick={onClick}
      className="hover:text-red-500 px-3 py-2 w-full flex justify-between items-center py-4 text-left h-[10vh]"
    >
      <span className="text-lg font-medium">{question}</span>
      <span>{isOpen ? '-' : '+'}</span>
    </button>
    {isOpen && <p className="text-gray-600 pb-4 pl-2">{answer}</p>}
  </div>
);

const FaqPage = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .send(
        'service_p0odil5', 
        'template_4ehp9mj', 
        formData,
        'U2V3F5obnmBdI1iFx' 
      )
      .then(
        () => {
          alert("Your message has been sent!");
          setFormData({ name: '', email: '', message: '' });
        },
        (error) => {
          alert("Something went wrong. Please try again later.");
          console.error(error.text);
        }
      );
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-4xl md:text-5xl font-black mb-10 text-center">
            <span className="text-black">Frequently Asked </span>
            <span id='strokeText' className="ml-2">Questions</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              {faqData.map((faq, i) => (
                <FAQItem
                  key={i}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openIndex === i}
                  onClick={() => toggle(i)}
                />
              ))}
            </div>

            <div className="bg-gray-100 p-6 rounded-lg shadow-lg w-full">
              <h3 className="text-xl font-semibold mb-4">Make your Question</h3>
              <form className="flex flex-col gap-4" onSubmit={sendEmail}>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="p-3 border rounded"
                  placeholder="Name"
                  required
                />
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  type="email"
                  className="p-3 border rounded"
                  placeholder="Email"
                  required
                />
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="p-3 border rounded"
                  rows="4"
                  placeholder="Write something..."
                  required
                />
                <button
                  type="submit"
                  className="bg-[#E53940] text-white font-semibold px-6 py-2 rounded-md hover:opacity-90 transition duration-200"
                >
                  Send Request
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FaqPage;
