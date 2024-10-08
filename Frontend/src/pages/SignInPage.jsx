import React from 'react';
import InputWithLabel from '../components/InputWithLabel';
import GreenButton from '../components/GreenButton';
import fonts from '../fonts/fonts.module.css';
import BackArrow from '../assets/back_arrow.svg';
import styles from './css/SignUpAndSignIn.module.css';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthProvider';

const SignInPage = () => {
  const navigate = useNavigate();
  const { login } = React.useContext(AuthContext);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleForgetPassword = () => {
    // Here need be implemented the logic for regaining the password
  };

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [errors, setErrors] = React.useState({ email: '', password: '' });

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const validatePassword = (password) => {
    if (!password) return 'A senha é obrigatória.';
    if (password.length < 8) return 'Senha deve ter pelo menos 8 caracteres.';
    return '';
  };

  const handleChangeEmail = ({ target }) => {
    const value = target.value;
    setEmail(value);
    const emailError = value
      ? validateEmail(value)
        ? ''
        : 'O e-mail deve ser válido.'
      : 'O e-mail é obrigatório.';
    setErrors((prevErrors) => ({ ...prevErrors, email: emailError }));
  };

  const handleChangePassword = ({ target }) => {
    const value = target.value;
    setPassword(value);
    const passwordError = validatePassword(value);
    setErrors((prevErrors) => ({ ...prevErrors, password: passwordError }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const emailError = email
      ? validateEmail(email)
        ? ''
        : 'O e-mail deve ser válido.'
      : 'O e-mail é obrigatório.';
    const passwordError = validatePassword(password);

    setErrors({ email: emailError, password: passwordError });

    if (!emailError && !passwordError) {
      const url =
        'https://maltex-back-production.up.railway.app/login/verifyCredentials';
      const data = {
        email: email,
        password: password,
      };

      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          login(data.client, data.token);
        });
    }
  };

  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <img onClick={handleBackClick} src={BackArrow} alt="Back Arrow" />
        <h2 className={fonts.poppinsRegular}>Fazer Login</h2>
      </header>
      <form className={styles.form} onSubmit={handleSubmit}>
        <InputWithLabel
          onChange={handleChangeEmail}
          inputClass={`${styles.input} ${
            errors.email ? styles.errorInput : ''
          }`}
          labelClass={styles.label}
          labelText={'Email:'}
          inputType={'email'}
          htmlFor={'signInEmailInput'}
        />
        {errors.email && (
          <p
            style={{ color: 'red' }}
            className={`${styles.errorText} ${fonts.robotoRegular}`}
          >
            {errors.email}
          </p>
        )}

        <InputWithLabel
          onChange={handleChangePassword}
          inputClass={`${styles.input} ${
            errors.password ? styles.errorInput : ''
          }`}
          labelClass={styles.label}
          labelText={'Senha:'}
          inputType={'password'}
          htmlFor={'signInPasswordInput'}
        />
        {errors.password && (
          <p
            style={{ color: 'red' }}
            className={`${styles.errorText} ${fonts.robotoRegular}`}
          >
            {errors.password}
          </p>
        )}
        <p onClick={handleForgetPassword} className={fonts.latoMedium}>
          Esqueceu sua senha?
        </p>

        <GreenButton
          onClick={handleSubmit}
          classButton={styles.button}
          text={'Entrar'}
          type="submit"
        />
      </form>
    </section>
  );
};

export default SignInPage;
