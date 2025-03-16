import React from 'react';
import { Button, Stack, Typography } from '@mui/material';

const Reminders: React.FC = () => {
  const handleSendReminder = () => {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    } else if (Notification.permission === "granted") {
      new Notification("Reminder", {
        body: "Don't forget to log your daily journal or trading log!",
      });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          new Notification("Reminder", {
            body: "Don't forget to log your daily journal or trading log!",
          });
        }
      });
    }
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h4">Reminders</Typography>
      <Typography variant="body1">
        Click the button below to send yourself a reminder notification.
      </Typography>
      <Button variant="contained" color="primary" onClick={handleSendReminder}>
        Send Reminder Now
      </Button>
    </Stack>
  );
};

export default Reminders;
