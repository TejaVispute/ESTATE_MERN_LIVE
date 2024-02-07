// Footer.js

import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white p-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Section 1: Logo and About */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            {/* <img
              src="/logo.png" // Add your logo image source
              alt="Logo"
              className="mb-4"
            /> */}
            <h3 className="mb-4">MH19 ESTATE</h3>
            <p className="text-sm">
              Your Real Estate Company is dedicated to providing top-notch real
              estate services. Lorem ipsum dolor sit amet, consectetur
              adipiscing elit.
            </p>
          </div>

          {/* Section 2: Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#">Home</a>
              </li>
              <li>
                <a href="#">Properties</a>
              </li>
              <li>
                <a href="#">Agents</a>
              </li>
              <li>
                <a href="#">Contact Us</a>
              </li>
            </ul>
          </div>

          {/* Section 3: Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <p>Email: info@example.com</p>
            <p>Phone: +1 (123) 456-7890</p>
            <p>Address: 123 Main Street, Cityville, State, 12345</p>
          </div>

          {/* Section 4: Social Media Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <a href="#" target="_blank" rel="noopener noreferrer">
                <img
                  src="/icons/facebook-icon.png" // Add your Facebook icon source
                  alt="Facebook"
                />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <img
                  src="/icons/twitter-icon.png" // Add your Twitter icon source
                  alt="Twitter"
                />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <img
                  src="/icons/linkedin-icon.png" // Add your LinkedIn icon source
                  alt="LinkedIn"
                />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <img
                  src="/icons/instagram-icon.png" // Add your Instagram icon source
                  alt="Instagram"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
