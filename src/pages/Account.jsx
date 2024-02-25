import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';
import { getFirestore, collection, getDocs, query, where, addDoc, updateDoc } from "firebase/firestore";

const db = getFirestore();

const Account = () => {
  const { logOut, user } = UserAuth();
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [existingUserRef, setExistingUserRef] = useState(null);
  const [skillsInput, setSkillsInput] = useState('');
  const [usersWithSelectedSkills, setUsersWithSelectedSkills] = useState([]);
  const [allSkills, setAllSkills] = useState([]);

  useEffect(() => {
    const fetchAllSkills = async () => {
      const usersRef = collection(db, "students2");
      const querySnapshot = await getDocs(usersRef);
      let skills = [];
      querySnapshot.forEach((doc) => {
        const userSkills = doc.data().Skills || [];
        skills.push(...userSkills);
      });
      // Extract unique skills
      const uniqueSkills = [...new Set(skills)];
      setAllSkills(uniqueSkills);
    };

    fetchAllSkills();
  }, []);

  useEffect(() => {
    const checkUserAndFetchSkills = async () => {
      if (user) {
        const usersRef = collection(db, "students2");
        const q = query(usersRef, where("Name", "==", user.displayName));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          setExistingUserRef(querySnapshot.docs[0].ref);
        } else {
          const newUserRef = await addDoc(usersRef, { Name: user.displayName, Skills: [] });
          setExistingUserRef(newUserRef);
        }
      }
    };

    checkUserAndFetchSkills();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!skillsInput) {
      alert('Please enter skills');
      return;
    }

    const newSkills = skillsInput.split(',').map(skill => skill.trim().toLowerCase());

    try {
      if (existingUserRef) {
        await updateDoc(existingUserRef, { Skills: [...selectedSkills, ...newSkills] });
        alert('Skills updated successfully!');
        setSelectedSkills(prevSkills => [...prevSkills, ...newSkills]); 
        setSkillsInput(''); 
      }
    } catch (error) {
      console.error('Error updating data:', error);
      alert('Error updating skills. Please try again.');
    }
  };

  const handleSkillClick = (skill) => {
    const index = selectedSkills.indexOf(skill);
    if (index === -1) {
      setSelectedSkills([...selectedSkills, skill]);
    } else {
      setSelectedSkills(selectedSkills.filter(selectedSkill => selectedSkill !== skill));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (selectedSkills.length > 0) {
        try {
          const usersRef = collection(db, "students2");
          const queries = selectedSkills.map(skill => query(usersRef, where("Skills", "array-contains", skill)));
          const querySnapshots = await Promise.all(queries.map(q => getDocs(q)));
          const userSets = querySnapshots.map(snapshot => new Set(snapshot.docs.map(doc => doc.data().Name)));
          const commonUsers = Array.from(userSets.reduce((acc, userSet) => new Set([...acc].filter(user => userSet.has(user))), userSets[0]));
          setUsersWithSelectedSkills(commonUsers);
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      } else {
        setUsersWithSelectedSkills([]);
      }
    };

    fetchData();
  }, [selectedSkills]);

  return (

    <div className="w-[50%] m-auto">
      <h1 className="text-left text-5xl poppins-semibold jumboheading">Welcome, {user?.displayName}</h1>
      <br />
     
      <form onSubmit={handleSubmit}>
        <label>
          
          <input type="text" name="Skills" class = "input-container" placeholder = "Update your skills. . ." value={skillsInput} onChange={(e) => setSkillsInput(e.target.value)} />
        </label>
        
      </form>
      <br />
      <hr />
      <div>
        <h2 class ="jumbo2 text-2xl">Hot right now . . .</h2>
        <div>
          {allSkills.map((skill, index) => (
            <button key={index} onClick={() => handleSkillClick(skill)} className={`border py-2 px-4 mr-2 mb-2 skillbutton ${selectedSkills.includes(skill) ? 'dark' : ''}`}>{skill}</button>
          ))}
        </div>
      </div>
      <br />
      <hr />
      <div>
        <h2 class= "jumbo2 text-2xl">Users with Selected Skills:</h2>
        {usersWithSelectedSkills.length > 0 ? (
          <ul>
            {usersWithSelectedSkills.map((userName, index) => (
              <li class="font-li" key={index}>{userName}</li>
            ))}
          </ul>
        ) : (
          <p>{selectedSkills.length > 0 && "No match found"}</p>
        )}
      </div>
      <br />
      <hr />
    
      <h3 class = "text-center kaha">ye kya kar rahe ho © 2024</h3>
    </div>
  );
};

export default Account;
