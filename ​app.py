import json
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)

DATA_FILE = 'students.json'


def load_students():
    if not os.path.exists(DATA_FILE):
        return []
    with open(DATA_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)


def save_students(students):
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(students, f, ensure_ascii=False, indent=2)


@app.route('/api/register', methods=['POST'])
def register_student():
    data = request.get_json(silent=True) or {}

    student_name = (data.get('studentName') or '').strip()
    father_name = (data.get('fatherName') or '').strip()
    phone_number = (data.get('phoneNumber') or '').strip()
    password = data.get('password') or ''
    track = (data.get('track') or '').strip()
    specialization = (data.get('specialization') or '').strip()

    if not student_name or not father_name or not phone_number or not password or not track or not specialization:
        return jsonify({'ok': False, 'message': 'برجاء استكمال جميع البيانات المطلوبة'}), 400

    students = load_students()

    if any(s.get('phoneNumber') == phone_number for s in students):
        return jsonify({'ok': False, 'message': 'رقم الموبايل ده مسجل بالفعل'}), 409

    new_student = {
        'studentName': student_name,
        'fatherName': father_name,
        'phoneNumber': phone_number,
        'passwordHash': generate_password_hash(password),
        'track': track,
        'specialization': specialization
    }

    students.append(new_student)
    save_students(students)

    return jsonify({'ok': True, 'message': 'تم حفظ بياناتك بنجاح على رواقة'}), 201


@app.route('/api/login', methods=['POST'])
def login_student():
    data = request.get_json(silent=True) or {}

    phone_number = (data.get('phoneNumber') or '').strip()
    password = data.get('password') or ''

    if not phone_number or not password:
        return jsonify({'ok': False, 'message': 'برجاء إدخال رقم الموبايل وكلمة المرور'}), 400

    students = load_students()
    matched_student = next((s for s in students if s.get('phoneNumber') == phone_number), None)

    if not matched_student or not check_password_hash(matched_student.get('passwordHash', ''), password):
        return jsonify({'ok': False, 'message': 'رقم الموبايل أو كلمة المرور غير صحيحة'}), 401

    return jsonify({
        'ok': True,
        'message': 'تم تسجيل الدخول بنجاح',
        'student': {
            'studentName': matched_student.get('studentName', ''),
            'fatherName': matched_student.get('fatherName', ''),
            'phoneNumber': matched_student.get('phoneNumber', ''),
            'track': matched_student.get('track', ''),
            'specialization': matched_student.get('specialization', '')
        }
    }), 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
