import React from 'react';
import { Link } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logOut } = UserAuth();

  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='flex justify-between bg-gray-200 w-full p-4 navbar poppins-semibold'>
      <h1 className='text-center vigor text-2xl font-bold'>
        VIGOR
      </h1>
      {user?.displayName ? (
        <div>
          <button className="navitem">
            <Link to="/account" className="block white text-center text-blue-500 mt-4">CONNECT</Link>
          </button>
          <button className="navitem">
            <Link to="/roadmap" className="block white text-center text-blue-500 mt-4">ROADMAP</Link>
          </button>
          <button onClick={handleSignOut} className="navitem cta">Logout</button>
        </div>
      ) : (
        <Link to='/signin' class = "cta">Sign in</Link>
      )}
    </div>
  );
};

export default Navbar;
