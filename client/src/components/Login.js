import React from 'react'
import {useGoogleLogin} from '@react-oauth/google';
import axios from 'axios'

const Login = ({onLogin}) => {
    const login = useGoogleLogin({
        onSuccess: async (response) => {
          try {
            // Get user info from Google
            const userInfo = await axios.get(
              'https://www.googleapis.com/oauth2/v3/userinfo',
              {
                headers: { Authorization: `Bearer ${response.access_token}` }
              }
            );

            console.log("userInfo", userInfo);
    
            // Authenticate with our backend
            const { data } = await axios.post(
              `${process.env.REACT_APP_API_URL}/api/v1/auth/google`,
              { email: userInfo.data.email }
            );

            console.log(data);
    
            localStorage.setItem('token', data.data.token);
            onLogin(data.data);
          } catch (error) {
            console.error('Login failed:', error);
            alert('Login failed. Please try again.');
          }
        },
        onError: (error) => {
          console.error('Google login failed:', error);
          alert('Login failed. Please try again.');
        },
        flow: 'implicit', 
        scope: 'email profile',
        ux_mode: 'popup',  
      });
  return (  
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Startup Network Finder
        </h1>
        <p className="text-gray-600 mb-6 text-center">
          Connect with investors and mentors for your startup
        </p>
        <button
          onClick={() => login()}
          className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            className="w-6 h-6"
            alt="Google logo"
          />
          <span>Sign in with Google</span>
        </button>
      </div>
    </div>
  )
}

export default Login