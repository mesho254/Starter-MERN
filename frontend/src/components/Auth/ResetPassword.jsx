import React, { useState } from 'react';
import { Form, Input, Button, Typography, message, Card } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const { Title } = Typography;

const passwordRules = {
  length: { regex: /^.{8,}$/, label: "At least 8 characters" },
  lowercase: { regex: /[a-z]/, label: "At least one lowercase letter" },
  uppercase: { regex: /[A-Z]/, label: "At least one uppercase letter" },
  number: { regex: /[0-9]/, label: "At least one number" },
  specialChar: { regex: /[@$!%*?&#]/, label: "At least one special character" }
};

const ResetPassword = () => {
  const { id, token } = useParams(); 
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false)
  
  const passwordsMatch = password === confirmPassword;

  const passwordValidation = Object.keys(passwordRules).map((key) => {
    const rule = passwordRules[key];
    return {
      label: rule.label,
      valid: rule.regex.test(password),
    };
  });

  const onFinish = async (values) => {
    if (!passwordsMatch) {
      message.error("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await resetPassword(id, token, password); 
      message.success('Password reset successfully!');
      setLoading(false);
      navigate('/login');
    } catch (error) {
      message.error(error?.response?.data?.message || 'Failed to reset password. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff' }}>
      <Card style={{ width: '100%', maxWidth: '600px', justifyContent: 'center' }}>
        <div style={{ padding: '20px' }}>
          <Title style={{ color: '#000' }}>Reset Password</Title>
          <Form layout="vertical" onFinish={onFinish}>
            
            <Form.Item
              label="New Password"
              name="password"
              rules={[{ required: true, message: 'Please enter your new password' }]}
            >
              <Input.Password
                placeholder="Enter your new password"
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
              label="Confirm Password"
              name="confirmPassword"
              rules={[{ required: true, message: 'Please confirm your new password' }]}
            >
              <Input.Password
                placeholder="Confirm your new password"
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
              <Button type="primary" htmlType="submit" style={{ width: '100%', borderRadius: '8px' }} loading={loading}>
               {loading ? 'Resetting...' : 'Reset Password'}  
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Card>
    </div>
  );
};

export default ResetPassword;
