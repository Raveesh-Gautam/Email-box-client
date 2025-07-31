import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import axios from 'axios';

const EmailItem = () => {
  const [emails, setEmails] = useState([]);

  // Utility to get source name
  const getSourceName = (email) => {
    if (!email) return "Unknown";
    const domain = email.split('@')[1]?.split('.')[0]; // e.g., gmail.com → gmail
    return domain.charAt(0).toUpperCase() + domain.slice(1);
  };
  const handleCompose=()=>{
    
  }

  // Fetch emails from API
  useEffect(() => {
    axios.get("http://localhost:8080/all") // change API URL
      .then((response) => {
        setEmails(response.data);
      })
      .catch((error) => console.error("Error fetching emails:", error));
  }, []);

  return (
    <div className='d-flex' style={{ height: "90vh" }}>
      {/* Left Sidebar */}
      <div style={{ width: "220px", minHeight: "100%" }}>
        <Button variant="primary" className='w-75 m-3' onClick={handleCompose}>Compose</Button>
        <ListGroup variant="flush" action className='text-center'>
          <ListGroup.Item action>Inbox</ListGroup.Item>
          <ListGroup.Item action>Unread</ListGroup.Item>
          <ListGroup.Item action>Starred</ListGroup.Item>
          <ListGroup.Item action>Drafts</ListGroup.Item>
          <ListGroup.Item action>Sent</ListGroup.Item>
          <ListGroup.Item action>Archive</ListGroup.Item>
          <ListGroup.Item action>Spam</ListGroup.Item>
          <ListGroup.Item action>Deleted</ListGroup.Item>
          <ListGroup.Item action>Views</ListGroup.Item>
        </ListGroup>
      </div>

      {/* Right Side - Inbox */}
      <div className='flex-grow-1 '>
        <Card className='shadow-sm m-0'>
          <Card.Header className=' d-flex justify-content-center bg-light  text-white'>
            <Card.Text className='m-2 text-dark'>Archieve</Card.Text>
             <Card.Text className='m-2 text-dark'>Move</Card.Text>
              <Card.Text className='m-2 text-dark'>Delete</Card.Text>
               <Card.Text className='m-2 text-dark cursor-pointer'>Spam</Card.Text>
          </Card.Header>
          <ListGroup variant="flush">
            {emails.length > 0 ? (
              emails.map((email) => (
                <ListGroup.Item
                  key={email.id}
                  className='d-flex justify-content-between align-items-center'
                >
                  <div>
                    {/* Source Name */}
                    <div className='d-flex flex-start p-1' >
                    <strong >{getSourceName(email.senderEmail)}</strong>
                    <div className='text-muted' style={{ fontSize: '14px',marginLeft:'15px' }}>
                      {email.subject}
                    </div>
                  </div>
                  </div>
                  <Badge bg="secondary">{email.recievers.length}</Badge>
                </ListGroup.Item>
              ))
            ) : (
              <ListGroup.Item>No emails found.</ListGroup.Item>
            )}
          </ListGroup>
        </Card>
      </div>
    </div>
  );
};

export default EmailItem;
