import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Typography, message, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const { Title, Paragraph } = Typography;

const ForgotPassword = () => {
  const [form] = Form.useForm(); 
  const { forgotPassword } = useAuth();
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false); 
  const [countdown, setCountdown] = useState(60); 
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true); 
    try {
      await forgotPassword(values.email); 
      message.success('Password reset link sent to your email!');
      form.resetFields(); 
      setIsSuccess(true); 
    } catch (error) {
      message.error(error?.response?.data?.message || 'Failed to send reset link. Please try again.');
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    if (isSuccess && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer); 
    } else if (countdown === 0) {
      navigate('/login'); 
    }
  }, [isSuccess, countdown, navigate]);

  if (isSuccess) {
    return <SuccessMessage countdown={countdown} />;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff' }}>
      <Card style={{ width: '100%', maxWidth: '700px', justifyContent: 'center' }}>
        <div style={{ padding: '20px' }}>
          <Title style={{ color: '#000' }}>Forgot Password</Title>
          <Form layout="vertical" form={form} onFinish={onFinish}>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: 'Please enter your email' }]}
            >
              <Input placeholder="Enter your email" style={{ borderRadius: '8px' }} />
            </Form.Item>
            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                style={{ width: '100%', borderRadius: '8px' }} 
                loading={loading} 
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </Form.Item>
          </Form>
          <Paragraph style={{ color: '#6699cc' }}>
            Remembered your password? <a href="/login" style={{ color: '#6699cc' }}>Login here</a>
          </Paragraph>
        </div>
      </Card>
    </div>
  );
};

// Success Message Component with Countdown
const SuccessMessage = ({ countdown }) => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff' }}>
      <Card style={{ width: '100%', maxWidth: '600px', justifyContent: 'center' }}>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <Title style={{ color: '#000' }}>Success!</Title>
          <Paragraph style={{ color: '#000' }}>
            A password reset link has been sent to your email. You will be redirected to the login page in {countdown} seconds.
          </Paragraph>
        </div>
      </Card>
    </div>
  );
};

export default ForgotPassword;
