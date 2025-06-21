import React from 'react';
import { Container, Box, Typography, TextField, Button, Paper } from '@mui/material';

export default function LoginPage() {
  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" component="h1" align="center" gutterBottom>
          Login
        </Typography>
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="Email" variant="outlined" required fullWidth />
          <TextField label="Password" variant="outlined" type="password" required fullWidth />
          <Button variant="contained" color="primary" size="large">
            Sign In
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
