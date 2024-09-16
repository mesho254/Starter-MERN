import React, { useState, useEffect } from 'react';
import { MenuOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Menu, Dropdown, Avatar } from 'antd';
import { useMediaQuery } from 'react-responsive';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../axiosConfig';
import useAuth from '../../hooks/useAuth';

const Navbar = () => {
  const isSmallScreen = useMediaQuery({ query: '(max-width: 768px)' });
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // State for storing logo and company name
  const [logo, setLogo] = useState(null);
  const [companyName, setCompanyName] = useState('StarterMERN');
  const [profilePicture, setProfilePicture] = useState(null); 

  
  useEffect(() => {
    const fetchCompanyInfo = async () => {
      try {
        const response = await axiosInstance.get('/api/company/getAll'); 
        const data = response.data; 
        setLogo(data.logo); 
        setCompanyName(data.name); 
      } catch (error) {
        console.error('Failed to fetch company info:', error);
      }
    };

    fetchCompanyInfo();
  }, []);

  // Fetch the user profile and picture
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axiosInstance.get('/api/users/user'); 
        const userData = response.data;
        if (userData && userData.profilePicture) {
          setProfilePicture(userData.profilePicture); 
        }
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      }
    };

    if (user) {
      fetchUserProfile(); 
    }
  }, [user]);

  // Navigation functions
  const NavHome = () => navigate('/');
  const NavAbout = () => navigate('/about');
  const NavContact = () => navigate('/contactus');
  const NavServices = () => navigate('/services');
  const NavLogin = () => navigate('/login');
  const NavProfile = () => navigate('/profile');
  const NavAdmin = () => navigate('/admin');

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // User menu dropdown
  const userMenu = (
    <Menu>
      <Menu.Item key="profile" onClick={NavProfile}>
        Profile
      </Menu.Item>
      {user && user.roles === 'admin' && (
        <Menu.Item key="adminDashboard" onClick={NavAdmin}>
          <span>Admin Dashboard</span>
        </Menu.Item>
      )}
      <Menu.Item key="logout" onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  // Main menu items
  const mainMenu = (
    <Menu>
      <Menu.Item key="home" onClick={NavHome}>
        Home
      </Menu.Item>
      <Menu.Item key="about" onClick={NavAbout}>
        About Us
      </Menu.Item>
      <Menu.Item key="services" onClick={NavServices}>
        Services
      </Menu.Item>
      <Menu.Item key="contact" onClick={NavContact}>
        Contact
      </Menu.Item>
    </Menu>
  );

  return (
    <div
      style={{
        position: 'fixed',
        width: '100%',
        top: 0,
        zIndex: 1000,
        backgroundColor: '#fff',
        padding: '10px 20px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex' }}>
          {logo && <img src={logo} alt="Logo" style={{ height: '30px', width: '30px', marginRight: '14px', borderRadius: '10px' }} />}
          {!isSmallScreen && <div className="logo" style={{ fontWeight: 'bold' }}>{companyName}</div>}
        </div>
        <div style={{ display: 'flex', justifyContent: isSmallScreen ? 'space-between' : 'center', alignItems: 'center' }}>
          {!isSmallScreen && (
            <Menu mode="horizontal" style={{ borderBottom: 'none', width: '500px' }}>
              <Menu.Item key="home" onClick={NavHome}>
                Home
              </Menu.Item>
              <Menu.Item key="about" onClick={NavAbout}>
                About Us
              </Menu.Item>
              <Menu.Item key="services" onClick={NavServices}>
                Services
              </Menu.Item>
              <Menu.Item key="contact" onClick={NavContact}>
                Contact
              </Menu.Item>
            </Menu>
          )}
        </div>

        {user ? (
          <Dropdown overlay={userMenu} trigger={['click']}>
            <Avatar
              src={profilePicture}
              icon={!profilePicture && <UserOutlined />}
              style={{ cursor: 'pointer', border:"2px solid green" }}
              size={45}
            />
          </Dropdown>
        ) : (
          <Button onClick={NavLogin}>Login</Button>
        )}

        {/* Dropdown for smaller screens */}
        {isSmallScreen && (
          <Dropdown overlay={mainMenu} trigger={['click']}>
            <MenuOutlined style={{ fontSize: '24px' }} />
          </Dropdown>
        )}
      </div>
    </div>
  );
};

export default Navbar;
