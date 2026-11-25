const loginForm = document.getElementById('loginForm');
const loginPhone = document.getElementById('loginPhone');
const loginPassword = document.getElementById('loginPassword');
const loginPhoneError = document.getElementById('loginPhoneError');
const loginPasswordError = document.getElementById('loginPasswordError');
const loginBtn = document.getElementById('loginBtn');

const API_BASE_URL = 'http://127.0.0.1:5000';
const LOCAL_STORAGE_KEY = 'rawaq_students';

function addPressEffect(btn) {
  if (!btn) return;
  btn.addEventListener('touchstart', () => btn.classList.add('pressed'), { passive: true });
  btn.addEventListener('touchend', () => setTimeout(() => btn.classList.remove('pressed'), 90));
}

addPressEffect(loginBtn);

function setError(input, errorEl, message) {
  errorEl.textContent = message;
  input.classList.add('input-error');
}

function clearError(input, errorEl) {
  errorEl.textContent = '';
  input.classList.remove('input-error');
}

loginPhone.addEventListener('input', () => clearError(loginPhone, loginPhoneError));
loginPassword.addEventListener('input', () => clearError(loginPassword, loginPasswordError));

function checkLocalLogin(phoneVal, passVal) {
  const students = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
  const matched = students.find(
    (s) => s.phoneNumber === phoneVal && s.password === passVal
  );
  if (!matched) {
    return { ok: false, message: 'رقم الموبايل أو كلمة المرور غير صحيحة' };
  }
  return { ok: true, student: matched };
}

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  clearError(loginPhone, loginPhoneError);
  clearError(loginPassword, loginPasswordError);

  let isValid = true;
  const phoneVal = loginPhone.value.trim();
  const passVal = loginPassword.value;

  if (!phoneVal) {
    setError(loginPhone, loginPhoneError, 'اكتب رقم الموبايل');
    isValid = false;
  } else if (!/^01\d{9}$/.test(phoneVal)) {
    if (!phoneVal.startsWith('01')) {
      setError(loginPhone, loginPhoneError, 'الرقم لازم يبدأ بـ 01');
    } else {
      setError(loginPhone, loginPhoneError, 'الرقم ناقص، لازم يكون 11 رقم');
    }
    isValid = false;
  }

  if (!passVal) {
    setError(loginPassword, loginPasswordError, 'اكتب كلمة المرور');
    isValid = false;
  } else if (passVal.length < 6) {
    setError(loginPassword, loginPasswordError, 'كلمة المرور لازم تكون 6 حروف أو أرقام على الأقل');
    isValid = false;
  }

  if (!isValid) return;

  loginBtn.classList.add('pressed');
  loginBtn.disabled = true;

  try {
    const response = await fetch(`${API_BASE_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phoneNumber: phoneVal,
        password: passVal
      })
    });

    const result = await response.json();

    setTimeout(() => {
      loginBtn.classList.remove('pressed');
      loginBtn.disabled = false;

      if (!response.ok || !result.ok) {
        alert(result.message || 'رقم الموبايل أو كلمة المرور غير صحيحة');
        return;
      }

      localStorage.setItem('rawaq_current_student', JSON.stringify(result.student || { phoneNumber: phoneVal }));
      alert('أهلاً بك على رواقة! تم تسجيل الدخول بنجاح');
    }, 90);
  } catch (error) {
    const localResult = checkLocalLogin(phoneVal, passVal);

    setTimeout(() => {
      loginBtn.classList.remove('pressed');
      loginBtn.disabled = false;

      if (!localResult.ok) {
        alert(localResult.message);
        return;
      }

      localStorage.setItem('rawaq_current_student', JSON.stringify(localResult.student));
      alert('أهلاً بك على رواقة! تم تسجيل الدخول بنجاح');
    }, 90);
  }
});
