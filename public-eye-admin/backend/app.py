@app.route('/api/admin/create-user', methods=['POST'])
def create_admin_user():
    """Create admin user (protected endpoint - add auth later)"""
    try:
        data = request.get_json()
        email = data.get('email')
        full_name = data.get('fullName')
        
        if not email or not full_name:
            return jsonify({'error': 'Email and fullName required'}), 400
        
        # Create admin user in Firebase Auth (you'll need Firebase Admin SDK)
        # For now, just create in Firestore
        
        user_id = str(uuid.uuid4())
        user_data = {
            'uid': user_id,
            'email': email,
            'fullName': full_name,
            'role': 'admin',
            'createdAt': datetime.utcnow().isoformat()
        }
        
        db.collection('users').document(user_id).set(user_data)
        
        return jsonify({
            'success': True,
            'message': f'Admin user created: {email}',
            'tempPassword': 'Change this to Firebase Admin SDK password creation'
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500