import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function VerifyEmail() {
  const [otpArr, setOtpArr] = useState(new Array(6).fill(''));
  const otpRef = useRef([]);
  const [apiCalled, setApiCalled] = useState(false);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    otpRef.current[0]?.focus();
    setEmail(localStorage.getItem('email'));
  }, []);

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').slice(0, 6).split('');
    const updatedOtp = [...otpArr];
    pasted.forEach((char, idx) => {
      updatedOtp[idx] = char;
    });
    setOtpArr(updatedOtp);
    setTimeout(() => {
      otpRef.current[pasted.length]?.focus();
    }, 0);
  };

  const handleKeyDown = (e, index) => {
    const key = e.key;
    if (key === 'Backspace' && otpArr[index] === '' && index > 0) {
      otpRef.current[index - 1].focus();
    }
  };

  const handleChange = (value, index) => {
    const newValue = value.trim().slice(-1);
    const newArr = [...otpArr];
    newArr[index] = newValue;
    setOtpArr(newArr);

    if (newValue && index <= 4) {
      otpRef.current[index + 1].focus();
    }
  };

  const handleSubmit = async () => {
    const otpVal = otpArr.join('');
    try {
      setApiCalled(true);
      const response = await axios.post('http://localhost:8000/api/v1/verify-email', {
        Email: email,
        Otp: otpVal,
      });
      console.log('response Is:- ', response);
      toast.success('OTP Verified');
      navigate('/login')
    } catch (error) {
      console.error('Error Occured:- ', error);
      toast.error('OTP Verification Failed');
    } finally {
      setApiCalled(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-black via-[#0f0f0f] to-black px-4">
      <div
        onPaste={handlePaste}
        className="w-full max-w-md p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-lg flex flex-col items-center"
      >
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Verify Your Email</h2>

        <div className="flex gap-3 mb-6">
          {otpArr.map((input, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={input}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              ref={(el) => (otpRef.current[index] = el)}
              className="w-12 h-12 text-center text-xl rounded-lg border border-lime-400 bg-black text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-emerald-400 transition"
            />
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={apiCalled}
          className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 ${
            apiCalled
              ? 'bg-gray-600 cursor-not-allowed text-white'
              : 'bg-gradient-to-r from-lime-400 via-green-500 to-emerald-400 text-black hover:shadow-[0_0_20px_#4ade80]'
          }`}
        >
          {apiCalled ? 'Verifying...' : 'Submit OTP'}
        </button>
      </div>
    </div>
  );
}

export default VerifyEmail;
