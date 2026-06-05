from functools import wraps
from flask import jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt


def role_required(allowed_roles):

    def wrapper(fn):

        @wraps(fn)
        def decorator(*args, **kwargs):

            # check token exists + valid
            verify_jwt_in_request()

            # get JWT claims (where role is stored)
            claims = get_jwt()
            role = claims.get("role")

            if role not in allowed_roles:
                return jsonify({
                    "message": "Access denied: insufficient permissions"
                }), 403

            return fn(*args, **kwargs)

        return decorator

    return wrapper