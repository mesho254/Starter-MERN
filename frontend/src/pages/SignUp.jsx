import React, { useState } from 'react';
import { Form, Input, Button, Typography, Card, notification } from 'antd';
import useAuth from '../hooks/useAuth'; 
import { useNavigate } from 'react-router-dom'; 

const { Title, Paragraph } = Typography; 

// Password validation rules
const passwordRules = {
  length: { regex: /^.{8,}$/, label: "At least 8 characters" },
  lowercase: { regex: /[a-z]/, label: "At least one lowercase letter" },
  uppercase: { regex: /[A-Z]/, label: "At least one uppercase letter" },
  number: { regex: /[0-9]/, label: "At least one number" },
  specialChar: { regex: /[@$!%*?&#]/, label: "At least one special character" }
};

const SignUp = () => {
  const [loading, setLoading] = useState(false); 
  const { register } = useAuth();
  const navigate = useNavigate(); 

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Track whether passwords match
  const passwordsMatch = password === confirmPassword;

  // Track password complexity checks
  const passwordValidation = Object.keys(passwordRules).map((key) => {
    const rule = passwordRules[key];
    return {
      label: rule.label,
      valid: rule.regex.test(password),
    };
  });

  const onFinish = async (values) => {
    if (!passwordsMatch) {
      notification.error({
        message: 'Passwords do not match.',
      });
      return;
    }

    setLoading(true); 
    try {
      const { username, email, password } = values;
      await register(username, email, password); 
      notification.success({
        message: 'Registration Successful',
        description: 'You have registered successfully. Please login.',
      });
      navigate('/login'); 
    } catch (error) {
      notification.error({
        message: 'Registration Failed',
        description: error.response ? error.response.data.message : 'Something went wrong. Please try again.',
      }); 
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center', 
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: '800px', 
          alignItems: 'center',
          borderRadius: '20px', 
        }}
      >
        <Title
          style={{
            color: 'black',
            fontSize: '40px',
            marginBottom: '20px',
            textAlign: 'center', 
            marginTop: '50px',
          }}
        >
          Sign up
        </Title>
        <Paragraph style={{ color: 'black', fontSize: '16px' }}>
          Join Us today!
        </Paragraph>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Full name" name="username" rules={[{ required: true, message: 'Please enter your name' }]}>
            <Input
              placeholder="John Smith"
              style={{ borderRadius: '8px' }} 
            />
          </Form.Item>

          <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please enter your email', type: 'email' }]}>
            <Input
              placeholder="johnsmith@gmail.com"
              style={{ borderRadius: '8px' }} 
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password
              placeholder="Enter your password"
              style={{ borderRadius: '8px' }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Item>

          <ul style={{ listStyle: 'none', padding: 0, margin: '10px 0' }}>
            {passwordValidation.map((rule, index) => (
              <li key={index} style={{ color: rule.valid ? 'green' : 'red' }}>
                {rule.valid ? '✔️' : '❌'} {rule.label}
              </li>
            ))}
          </ul>

          <Form.Item
            label="Re-enter password"
            name="confirmPassword"
            rules={[{ required: true, message: 'Please confirm your password' }]}
          >
            <Input.Password
              placeholder="Confirm your password"
              style={{ borderRadius: '8px' }}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Item>

          {confirmPassword && (
            <div style={{ marginBottom: '10px', color: passwordsMatch ? 'green' : 'red' }}>
              {passwordsMatch ? '✔️ Passwords match' : '❌ Passwords do not match'}
            </div>
          )}

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                width: '100%',
                backgroundColor: '#6699cc',
                borderRadius: '8px',
                height: '40px',
                fontSize: '16px',
              }}
              loading={loading} 
            >
              {loading ? 'Signing up...' : 'Sign Up'}
            </Button>
          </Form.Item>
        </Form>

        <a href="/login">
          <Paragraph style={{ color: '#6699cc', marginTop: '10px' }}>
            Already have an account?
          </Paragraph>
        </a>
      </Card>
    </div>
  );
};

export default SignUp;
