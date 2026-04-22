import { FC, SyntheticEvent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LoginUI } from '@ui-pages';
import { useDispatch } from '../../services/store';
import { authLogin } from '../../services/user/userThunks';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const from = location.state?.from?.pathname || '/profile';

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    try {
      await dispatch(
        authLogin({
          email: email,
          password: password
        })
      ).unwrap();

      navigate(from, { replace: true });
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <LoginUI
      errorText=''
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
