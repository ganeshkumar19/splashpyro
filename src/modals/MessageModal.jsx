import React, { useState } from 'react';
import { Modal, Form, Button, Spinner, InputGroup, Table, ProgressBar } from 'react-bootstrap';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import '../assets/styles/messagemodalstyles.css';

const FIREBASE_FUNCTION_URL = import.meta.env.VITE_API_GATEWAY_URL; // Correct usage for Vite

const MessageModal = ({ show, handleClose }) => {
  const [budget, setBudget] = useState(500);
  const [groupSize, setGroupSize] = useState('');
  const [childrenUnder12, setChildrenUnder12] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [specificCrackers, setSpecificCrackers] = useState([]);
  const [otherCracker, setOtherCracker] = useState('');
  const [messages, setMessages] = useState([]); // State to store chat messages
  const [input, setInput] = useState(''); // User input for chat
  const [loading, setLoading] = useState(false); // Loading state for chat
  const [showOrderSummary, setShowOrderSummary] = useState(false); // State to show order summary
  const [customerName, setCustomerName] = useState(''); // Customer name
  const [mobileNumber, setMobileNumber] = useState('+91'); // Mobile number, default to +91
  const [estimateID, setEstimateID] = useState('SPC0100'); // Initial Estimate ID
  const [orderDetails, setOrderDetails] = useState([]); // Order details to show in table
  const [currentStep, setCurrentStep] = useState(1); // Progress step: 1 = Preferences, 2 = Analysis, 3 = Order Placed

  // Function to get the label of the current step
  const getStepLabel = () => {
    switch (currentStep) {
      case 1:
        return 'Preferences';
      case 2:
        return 'Analysis';
      case 3:
        return 'Order Placed';
      default:
        return '';
    }
  };

  // Handle checkboxes for specific crackers
  const handleCheckboxChange = (e) => {
    const value = e.target.value;
    setSpecificCrackers((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  // Handle form submission to initiate chat
  const handleSubmit = async () => {
    if (!customerName.trim() || !/^[a-zA-Z\s]+$/.test(customerName) || customerName.length > 20) {
      alert('Please provide a valid name with only letters and a maximum of 20 characters.');
      return;
    }

    if (!/^\+91\d{10}$/.test(mobileNumber)) {
      alert('Please provide a valid 10-digit mobile number after +91.');
      return;
    }

    const formData = {
      budget,
      groupSize,
      childrenUnder12,
      preferredTime,
      specificCrackers: specificCrackers.length > 0 ? specificCrackers : 'No specific preference',
      otherCracker: otherCracker.trim() ? otherCracker : 'None'
    };

    console.clear();
    console.table(formData);

    setCurrentStep(2); // Move to "Analysis" step

    // Format user data for display
    const formattedUserData = `
**Name:** ${customerName}  
**Mobile:** ${mobileNumber}  
**Budget:** ₹${budget}  
**Group Size:** ${groupSize}  
**Children Under 12:** ${childrenUnder12}  
**Preferred Time:** ${preferredTime}  
**Specific Crackers:** ${specificCrackers.join(', ')}  
**Other Cracker:** ${otherCracker}
    `;

    // Add formatted user data to messages
    setMessages((prevMessages) => [
      ...prevMessages,
      { user: formattedUserData, bot: null }
    ]);

    // Send form data to the chat API
    setLoading(true);
    const body = { query: JSON.stringify(formData) }; // Convert form data to a query string

    try {
      const response = await axios.post(FIREBASE_FUNCTION_URL, body, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const botResponse = response.data.response.text; // Extract the 'text' field

      // Update messages with bot response
      setMessages((prevMessages) => [
        ...prevMessages.slice(0, -1), // Replace last user message
        { user: formattedUserData, bot: botResponse }
      ]);
    } catch (error) {
      console.error('Error sending form data:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { user: formattedUserData, bot: "Sorry, something went wrong while processing your request." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Handle sending a new message
  const handleSendMessage = async () => {
    if (!input.trim()) return; // Do not send if input is empty

    setMessages((prevMessages) => [
      ...prevMessages,
      { user: input, bot: null } // Add user message
    ]);

    setLoading(true);
    setInput(''); // Clear input

    try {
      const response = await axios.post(FIREBASE_FUNCTION_URL, { query: input }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const botResponse = response.data.response.text; // Extract bot's response
      setMessages((prevMessages) => [
        ...prevMessages.slice(0, -1), // Replace last user message
        { user: input, bot: botResponse }
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { user: input, bot: "Sorry, something went wrong while processing your message." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Handle "Place the Order" action
  const handlePlaceOrder = () => {
    setCurrentStep(3); // Move to "Order Placed" step

    // Generate a new Estimate ID
    setEstimateID((prevID) => {
      const newID = `SPC${(parseInt(prevID.slice(3)) + 1).toString().padStart(4, '0')}`;
      return newID;
    });

    // Set order details based on messages or other criteria
    setOrderDetails([
      { item: 'Flower Pot Big', quantity: 10, price: 205 },
      { item: 'Bomb Rocket', quantity: 10, price: 200 },
      { item: 'Lunik Rocket', quantity: 10, price: 425 },
      // You can add more items dynamically based on bot response or selected data
    ]);

    setShowOrderSummary(true); // Show order summary table
  };

  // Download the estimate as a PDF
  const handleDownloadEstimate = () => {
    const doc = new jsPDF();
    const currentDate = new Date();
    const formattedDate = `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString('en-US')}`; // 12-hour format

    doc.text('Splash Pyro Crackers - Estimate', 14, 15);
    doc.text(`Estimate ID: ${estimateID}`, 14, 25);
    doc.text(`Date & Time: ${formattedDate}`, 14, 35);
    doc.text(`Customer Name: ${customerName}`, 14, 45);
    doc.text(`Mobile Number: ${mobileNumber}`, 14, 55);

    doc.autoTable({
      startY: 65,
      head: [['Item', 'Quantity', 'Price (₹)']],
      body: orderDetails.map((item) => [item.item, item.quantity, item.price]),
    });

    const totalAmount = orderDetails.reduce((sum, item) => sum + item.quantity * item.price, 0);
    doc.text(`Total: ₹${totalAmount}`, 14, doc.previousAutoTable.finalY + 10);

    doc.text('Thank you for your purchase! Our representative will get in touch shortly.', 14, doc.previousAutoTable.finalY + 20);

    doc.save('Estimate.pdf');
  };

  // Render chat messages
  const renderMessages = () => {
    return messages.map((msg, index) => (
      <div key={index} className="mb-3">
        <div className="message-container user-message mb-1 p-2 rounded bg-light">
          <strong>User:</strong>
          <ReactMarkdown>{msg.user}</ReactMarkdown>
        </div>
        {msg.bot && (
          <div className="message-container bot-message p-2 rounded bg-secondary text-white">
            <strong>Bot:</strong>
            <ReactMarkdown>{msg.bot}</ReactMarkdown>
          </div>
        )}
      </div>
    ));
  };

  // Render order summary table
  const renderOrderSummary = () => {
    const currentDate = new Date();
    const formattedDate = `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString('en-US')}`; // 12-hour format

    const totalAmount = orderDetails.reduce((sum, item) => sum + item.quantity * item.price, 0);

    return (
      <div>
        <h5 className="mb-3">Splash Pyro Crackers - Estimate</h5>
        <p>
          <strong>Estimate ID:</strong> {estimateID} <br />
          <strong>Date & Time:</strong> {formattedDate} <br />
          <strong>Customer Name:</strong> {customerName} <br />
          <strong>Mobile Number:</strong> {mobileNumber} <br />
        </p>
        <Table bordered>
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Price (₹)</th>
            </tr>
          </thead>
          <tbody>
            {orderDetails.map((item, index) => (
              <tr key={index}>
                <td>{item.item}</td>
                <td>{item.quantity}</td>
                <td>{item.price}</td>
              </tr>
            ))}
            <tr>
              <td colSpan="2" className="text-end"><strong>Total:</strong></td>
              <td><strong>₹{totalAmount}</strong></td>
            </tr>
          </tbody>
        </Table>
        <p className="mt-4 text-center">
          Thank you for your purchase! Our representative will get in touch shortly.
        </p>

        {/* Download Estimate Button */}
        <Button variant="info" onClick={handleDownloadEstimate} className="mt-3">
          Download Estimate
        </Button>
      </div>
    );
  };

  return (
    <Modal show={show} onHide={handleClose} centered className='message-modal'>
      {/* Progress Bar for steps */}
      <ProgressBar now={(currentStep / 3) * 100} className="mb-3" label={getStepLabel()} />

      <Modal.Body className="p-3 modalMessageBody">
        {/* Form to Chat Conversion or Order Summary */}
        {showOrderSummary ? (
          renderOrderSummary() // Show order summary if order has been placed
        ) : !messages.length ? (
          <>
            {/* Preferences Form */}
            {/* Customer Name Input */}
            <Form.Group controlId="formCustomerName" className="mb-3">
              <Form.Label>1. What is your name?</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your name"
                value={customerName}
                onChange={(e) => {
                  if (/^[a-zA-Z\s]*$/.test(e.target.value) && e.target.value.length <= 20) {
                    setCustomerName(e.target.value);
                  }
                }}
                className='chatBotInput'
              />
            </Form.Group>

            {/* Mobile Number Input */}
            <Form.Group controlId="formMobileNumber" className="mb-3">
              <Form.Label>2. What is your mobile number?</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your mobile number (10 digits)"
                value={mobileNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
                  if (value.length <= 12) {
                    setMobileNumber(`+91${value.slice(2)}`); // Ensure the input is exactly 10 digits after +91
                  }
                }}
                className='chatBotInput'
              />
            </Form.Group>

            {/* Question 3: Budget Slider */}
            <Form.Group controlId="formBudget" className="mb-3">
              <Form.Label>3. What is your preferred budget for the crackers?</Form.Label>
              <Form.Range
                min={500}
                max={50000}
                step={500}
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
              <div>Selected Budget: ₹{budget}</div>
            </Form.Group>

            {/* Remaining Questions... */}
            {/* Question 4: Number of People Radio Buttons */}
            <Form.Group controlId="formGroupSize" className="mb-3">
              <Form.Label>4. How many people will be celebrating Diwali with you?</Form.Label>
              <div>
                {['1-2 people', '3-5 people', '6-8 people', 'More than 8 people'].map((option) => (
                  <Form.Check
                    type="radio"
                    label={option}
                    value={option}
                    name="groupSize"
                    onChange={(e) => setGroupSize(e.target.value)}
                    key={option}
                  />
                ))}
              </div>
            </Form.Group>

            {/* Question 5: Children Under Age of 12 Radio Buttons */}
            <Form.Group controlId="formChildrenUnder12" className="mb-3">
              <Form.Label>5. Are there any children under the age of 12 in your group?</Form.Label>
              <div>
                {['Yes', 'No'].map((option) => (
                  <Form.Check
                    type="radio"
                    label={option}
                    value={option}
                    name="childrenUnder12"
                    onChange={(e) => setChildrenUnder12(e.target.value)}
                    key={option}
                  />
                ))}
              </div>
            </Form.Group>

            {/* Question 6: Preferred Time of Day Radio Buttons */}
            <Form.Group controlId="formPreferredTime" className="mb-3">
              <Form.Label>6. What time of day do you prefer to burst crackers?</Form.Label>
              <div>
                {['Mainly during the day', 'Mainly at night', 'Equal during day and night'].map((option) => (
                  <Form.Check
                    type="radio"
                    label={option}
                    value={option}
                    name="preferredTime"
                    onChange={(e) => setPreferredTime(e.target.value)}
                    key={option}
                  />
                ))}
              </div>
            </Form.Group>

            {/* Question 7: Specific Type of Crackers Checkboxes */}
            <Form.Group controlId="formSpecificCrackers" className="mb-3">
              <Form.Label>7. Would you like to include any specific type of crackers in your bundle?</Form.Label>
              <div>
                {['Sparklers (Phuljhari)', 'Flowerpots (Anaar)', 'Rockets', 'Bombs (Loud crackers)', 'No specific preference'].map((option) => (
                  <Form.Check
                    type="checkbox"
                    label={option}
                    value={option}
                    onChange={handleCheckboxChange}
                    key={option}
                  />
                ))}
                {/* Other crackers option */}
                <Form.Control
                  type="text"
                  placeholder="Others (please specify)"
                  className="mt-2 chatBotInput"
                  value={otherCracker}
                  onChange={(e) => setOtherCracker(e.target.value)}
    
                />
              </div>
            </Form.Group>

            <div className='d-flex justify-content-center align-items-center pb-3'>
            <button onClick={handleSubmit} className='py-2 d-flex justify-content-center align-items-center submitCrackerButton'>
              Submit
            </button>
            </div>
          </>
        ) : (
          <>
            {/* Chat Interface */}
            <div className="chat-window flex-grow-1 overflow-auto p-3" style={{ maxHeight: '400px', border: '1px solid #ddd', borderRadius: '8px' }}>
              {renderMessages()}
              {loading && (
                <div className="text-muted">
                  <em>Analysing...</em>
                </div>
              )}
            </div>

            {/* Input for sending new messages */}
            <InputGroup className="mt-3">
              <Form.Control
                type="text"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSendMessage();
                  }
                }}
              />
              <Button variant="primary" onClick={handleSendMessage}>
                Send
              </Button>
            </InputGroup>
          </>
        )}
      </Modal.Body>

      <Modal.Footer>
        {/* Place Order Button - Show only in Chat Section */}
        {messages.length > 0 && !showOrderSummary && (
          <Button variant="success" onClick={handlePlaceOrder}>
            Place the Order
          </Button>
        )}

        
      </Modal.Footer>
    </Modal>
  );
};

export default MessageModal;