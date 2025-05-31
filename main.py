from flask import Flask, render_template, request
import os

# Create the Flask app instance
app = Flask(__name__)  # Webserver gateway interface (WSGI)

# Import views after app creation to avoid circular imports
import app.views as views

# Add URL rules
app.add_url_rule(rule="/", endpoint='home', view_func=views.index, methods=['GET', 'POST'])

if __name__ == "__main__":
    # Get port from environment variable (Render sets this) or default to 5000
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
