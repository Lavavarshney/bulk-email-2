import React, { useState } from 'react';

const FileUploadComponent = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');

  // Handle file change
  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
  };

  // Function to fetch email events from Brevo
  const getEmailEvents = async () => {
    try {
      const response = await fetch('https://api.brevo.com/v3/events', {
        method: 'GET',
        headers: {
          'api-key': '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', // Correct way to pass API key in Brevo
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching email events: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Email Events Data:', data);
      return data;
    } catch (error) {
      console.error('Error fetching email events:', error);
    }
  };

  // Handle form submission (file upload)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setStatus('Please select a file to upload.');
      return;
    }

    setStatus('Uploading...');

    const formData = new FormData();
    formData.append('csvFile', file);  // Ensure this matches multer's expected field name
    console.log(file);

    try {
      const response = await fetch('http://localhost:3000/upload-csv', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setStatus('File uploaded successfully!');
        
        // After file upload, fetch email events
        const events = await getEmailEvents();
        
        // Optionally, you can process the events data here
        if (events) {
          console.log('Email Events:', events);
          // You can display the events or calculate open/click rates here
        }
      } else {
        setStatus(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setStatus('Failed to upload file.');
    }
  };

  return (
    <div className="file-upload-container">
      <h1>Upload CSV File</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          name="csvFile"  // Field name should be 'csvFile'
          onChange={handleFileChange}
        />
        <button type="submit">Upload</button>
      </form>
      <p>{status}</p>
    </div>
  );
};

export default FileUploadComponent;
