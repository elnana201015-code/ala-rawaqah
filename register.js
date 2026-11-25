const registerForm = document.getElementById('registerForm');
const stepOne = document.getElementById('stepOne');
const stepTwo = document.getElementById('stepTwo');
const stepThree = document.getElementById('stepThree');
const nextStepBtn = document.getElementById('nextStepBtn');
const toSpecBtn = document.getElementById('toSpecBtn');
const finishBtn = document.getElementById('finishBtn');
const specList = document.getElementById('specList');

const studentName = document.getElementById('studentName');
const fatherName = document.getElementById('fatherName');
const phoneNumber = document.getElementById('phoneNumber');
const password = document.getElementById('password');

const nameError = document.getElementById('nameError');
const fatherError = document.getElementById('fatherError');
const phoneError = document.getElementById('phoneError');
const passwordError = document.getElementById('passwordError');

const API_BASE_URL = 'http://127.0.0.1:5000';

const specializationsByTrack = {
  'طب وعلوم حياة': ['فيزياء', 'رياضيات'],
  'هندسة وعلوم حاسب': ['برمجة', 'كيمياء'],
  'آداب وفنون': ['علم نفس', 'لغة ثانية'],
  'أعمال': ['إدارة أعمال', 'محاسبة']
};

function addPressEffect(btn) {
  if (!btn) return;
  btn.addEventListener('touchstart', () => btn.classList.add('pressed'), { passive: true });
  btn.addEventListener('touchend', () => setTimeout(() => btn.classList.remove('pressed'), 90));
}

addPressEffect(nextStepBtn);
addPressEffect(toSpecBtn);
addPressEffect(finishBtn);

function setError(input, errorEl, message) {
  errorEl.textContent = message;
  input.classList.add('input-error');
}

function clearError(input, errorEl) {
  errorEl.textContent = '';
  input.classList.remove('input-error');
}

[
  [studentName, nameError],
  [fatherName, fatherError],
  [phoneNumber, phoneError],
  [password, passwordError]
].forEach(([input, errorEl]) => {
  input.addEventListener('input', () => clearError(input, errorEl));
});

function switchStepFast(fromEl, toEl) {
  fromEl.classList.remove('active-step');
  fromEl.classList.add('slide-out');

  setTimeout(() => {
    fromEl.style.display = 'none';
    fromEl.classList.remove('slide-out');
    toEl.classList.remove('hidden-step');
    toEl.classList.add('slide-down-in');
  }, 130);
}

function renderSpecializations(trackValue) {
  const subjects = specializationsByTrack[trackValue] || [];
  specList.innerHTML = '';

  subjects.forEach((subject) => {
    const label = document.createElement('label');
    label.className = 'track-card';

    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = 'specialization';
    radio.value = subject;

    const customRadio = document.createElement('span');
    customRadio.className = 'custom-radio';

    const spanName = document.createElement('span');
    spanName.className = 'track-name';
    spanName.textContent = subject;

    label.appendChild(radio);
    label.appendChild(customRadio);
    label.appendChild(spanName);
    specList.appendChild(label);
  });
}

registerForm.addEventListener('submit', (e) => {
  e.preventDefault();

  clearError(studentName, nameError);
  clearError(fatherName, fatherError);
  clearError(phoneNumber, phoneError);
  clearError(password, passwordError);

  let isValid = true;
  const nameVal = studentName.value.trim();
  const fatherVal = fatherName.value.trim();
  const phoneVal = phoneNumber.value.trim();
  const passVal = password.value;

  if (!nameVal) {
    setError(studentName, nameError, 'اكتب اسمك الأول يا بطل');
    isValid = false;
  }

  if (!fatherVal) {
    setError(fatherName, fatherError, 'متنساش تكتب اسم الحج');
    isValid = false;
  }

  if (!phoneVal) {
    setError(phoneNumber, phoneError, 'اكتب رقم الموبايل');
    isValid = false;
  } else if (!/^01\d{9}$/.test(phoneVal)) {
    if (!phoneVal.startsWith('01')) {
      setError(phoneNumber, phoneError, 'الرقم لازم يبدأ بـ 01');
    } else {
      setError(phoneNumber, phoneError, 'الرقم ناقص، لازم يكون 11 رقم');
    }
    isValid = false;
  }

  if (!passVal) {
    setError(password, passwordError, 'اكتب كلمة مرور');
    isValid = false;
  } else if (passVal.length < 6) {
    setError(password, passwordError, 'كلمة المرور لازم تكون 6 حروف أو أرقام على الأقل');
    isValid = false;
  }

  if (!isValid) return;

  nextStepBtn.classList.add('pressed');

  setTimeout(() => {
    nextStepBtn.classList.remove('pressed');
    switchStepFast(stepOne, stepTwo);
  }, 80);
});

if (toSpecBtn) {
  toSpecBtn.addEventListener('click', () => {
    const selectedTrack = document.querySelector('input[name="track"]:checked');
    if (!selectedTrack) {
      alert('اختار مسارك الأول يا بطل!');
      return;
    }

    renderSpecializations(selectedTrack.value);
    toSpecBtn.classList.add('pressed');

    setTimeout(() => {
      toSpecBtn.classList.remove('pressed');
      switchStepFast(stepTwo, stepThree);
    }, 80);
  });
}

finishBtn.addEventListener('click', async () => {
  const selectedTrack = document.querySelector('input[name="track"]:checked');
  const selectedSpec = document.querySelector('input[name="specialization"]:checked');
  if (!selectedSpec) {
    alert('اختار مادة التخصص الأول يا بطل!');
    return;
  }

  finishBtn.classList.add('pressed');
  finishBtn.disabled = true;

  try {
    const response = await fetch(`${API_BASE_URL}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentName: studentName.value.trim(),
        fatherName: fatherName.value.trim(),
        phoneNumber: phoneNumber.value.trim(),
        password: password.value,
        track: selectedTrack ? selectedTrack.value : '',
        specialization: selectedSpec.value
      })
    });

    const result = await response.json();

    setTimeout(() => {
      finishBtn.classList.remove('pressed');
      finishBtn.disabled = false;

      if (!response.ok || !result.ok) {
        alert(result.message || 'تعذر الحفظ، حاول مجدداً');
        return;
      }

      alert('منور على رواقة! مسارك: ' + selectedTrack.value + ' — التخصص: ' + selectedSpec.value);
    }, 80);
  } catch (error) {
    setTimeout(() => {
      finishBtn.classList.remove('pressed');
      finishBtn.disabled = false;
      alert('تعذر الحفظ، حاول مجدداً');
    }, 80);
  }
});
