import React, {useState} from 'react';
import { Form, Input, Button, Typography, notification, Card } from 'antd';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';


const { Title, Paragraph } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const { email, password } = values;
      await login(email, password);
      notification.success({
        message: 'Login Successful',
        description: 'You have logged in successfully.',
      });
      navigate('/');
    } catch (error) {
      notification.error({
        message: 'Login Failed',
        description: error.response ? error.response.data.message : 'Something went wrong. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff' }}>
      <Card style={{ width: '100%', maxWidth: '600px', justifyContent: 'center' }}>
        <div>
          <Title style={{ color: '#fff' }}>Login</Title>
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please enter your email' }]}>
              <Input placeholder="Enter your email" style={{ borderRadius: '8px' }} />
            </Form.Item>
            <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please enter your password' }]}>
              <Input.Password placeholder="Enter your password" style={{ borderRadius: '8px' }} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ width: '100%', borderRadius: '8px' }} loading={loading}>Login</Button>
            </Form.Item>
          </Form>
          <Paragraph style={{ color: '#6699cc' }}>
            Forgot your password? <a href="/forgot-password" style={{ color: '#6699cc' }}>Reset it</a>
          </Paragraph>

          <Paragraph style={{ color: '#6699cc' }}>
            No account Yet? <a href="/signup" style={{ color: '#6699cc' }}>Register</a>
          </Paragraph>
        </div>
      </Card>
    </div>
  );
};

export default Login;
