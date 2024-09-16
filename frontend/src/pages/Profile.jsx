import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Form, Input, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axiosInstance from '../axiosConfig';
import useAuth from '../hooks/useAuth';

const passwordRules = {
  length: { regex: /^.{8,}$/, label: "At least 8 characters" },
  lowercase: { regex: /[a-z]/, label: "At least one lowercase letter" },
  uppercase: { regex: /[A-Z]/, label: "At least one uppercase letter" },
  number: { regex: /[0-9]/, label: "At least one number" },
  specialChar: { regex: /[@$!%*?&#]/, label: "At least one special character" }
};

const Profile = () => {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm(); // Form for the password change
  const [fileList, setFileList] = useState([]);
  const [user, setUser] = useState({});
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');

  const { user: currentUser } = useAuth();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axiosInstance.get('/api/users/user');
        setUser(response.data); // Set the user state with fetched details
      } catch (error) {
        message.error('Failed to fetch user details');
      }
    };
    fetchUserDetails();
  }, []);

  const handleEditClick = () => {
    setIsEditModalVisible(true);
    form.setFieldsValue(user); // Pre-fill form with fetched user data
  };

  const handlePasswordClick = () => {
    setIsPasswordModalVisible(true);
  };

  const handleFormSubmit = async (values) => {
    const formData = new FormData();
    formData.append('username', values.username);
    formData.append('email', values.email);
    formData.append('location', values.location);
    formData.append('bio', values.bio);

    if (fileList.length > 0) {
      formData.append('profilePicture', fileList[0].originFileObj);
    }

    setLoading(true);
    try {
      const response = await axiosInstance.put(`/api/users/user/${currentUser._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      message.success('Profile updated successfully');
      setUser(response.data);
      setIsEditModalVisible(false);
    } catch (error) {
      message.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (values) => {
    const { currentPassword, newPassword, confirmPassword } = values;

    if (newPassword !== confirmPassword) {
      message.error('New password and confirm password do not match');
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.put('/api/auth/change-password', {
        email: currentUser.email,
        currentPassword,
        newPassword,
      });
      message.success('Password updated successfully');
      setIsPasswordModalVisible(false);
    } catch (error) {
      message.error('Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const passwordValidation = Object.keys(passwordRules).map((key) => {
    const rule = passwordRules[key];
    return {
      label: rule.label,
      valid: rule.regex.test(password),
    };
  });

  const handleUploadChange = ({ fileList }) => {
    setFileList(fileList);
  };

  return (
    <div style={{ padding: '20px', margin: "100px auto" }}>
      <Card
        style={{ width: 600, padding: "40px" }}
        cover={<img alt="Profile" src={user.profilePicture} style={{ width: 100, height: 100, borderRadius: '50%', alignItems: "center", margin: "20px auto", border: "3px solid green" }} />}
      >
        <h2>{user.username}</h2>
        <p><b>Email:</b> {user.email}</p>
        <p><b>Location:</b> {user.location}</p>
        <p><b>Bio:</b> {user.bio}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button onClick={handleEditClick}>Edit Details</Button>
          <Button onClick={handlePasswordClick}>Update Password</Button>
        </div>
      </Card>

      {/* Edit Modal */}
      <Modal
        title="Edit Profile"
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        onOk={() => form.submit()}
        confirmLoading={loading}
      >
        <Form form={form} onFinish={handleFormSubmit}>
          <Form.Item name="username" label="Username" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="location" label="Location">
            <Input />
          </Form.Item>
          <Form.Item name="bio" label="Bio">
            <Input />
          </Form.Item>
          <Form.Item label="Profile Image">
            <Upload
              beforeUpload={() => false}
              listType="picture"
              fileList={fileList}
              onChange={handleUploadChange}
            >
              <Button icon={<UploadOutlined />}>Upload Profile Picture</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      {/* Update Password Modal */}
      <Modal
        title="Update Password"
        visible={isPasswordModalVisible}
        onCancel={() => setIsPasswordModalVisible(false)}
        onOk={() => passwordForm.submit()} // Handle password update on form submit
        confirmLoading={loading}
      >
        <Form form={passwordForm} onFinish={handlePasswordSubmit}>
          <Form.Item name="currentPassword" label="Current Password" rules={[{ required: true }]}>
            <Input.Password value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
          </Form.Item>
          <Form.Item name="newPassword" label="New Password" rules={[{ required: true }]}>
            <Input.Password value={password} onChange={(e) => setPassword(e.target.value)} />
          </Form.Item>
          {/* Password Complexity Validation */}
          <ul style={{ listStyle: 'none', padding: 0, margin: '10px 0' }}>
            {passwordValidation.map((rule, index) => (
              <li key={index} style={{ color: rule.valid ? 'green' : 'red' }}>
                {rule.valid ? '✔️' : '❌'} {rule.label}
              </li>
            ))}
          </ul>
          <Form.Item name="confirmPassword" label="Confirm Password" rules={[{ required: true }]}>
            <Input.Password value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          </Form.Item>
          {/* Password Match Feedback */}
          {confirmPassword && (
            <div style={{ marginBottom: '10px', color: password === confirmPassword ? 'green' : 'red' }}>
              {password === confirmPassword ? '✔️ Passwords match' : '❌ Passwords do not match'}
            </div>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default Profile;
