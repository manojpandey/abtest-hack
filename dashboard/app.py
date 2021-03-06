from flask import Flask, render_template
import os

app = Flask(__name__)

@app.route('/')
def main():
	return render_template('index.html')

@app.route('/chart')
def chart():
	return render_template('file.html')

@app.route('/pie')
def pie():
	return render_template('pie.html')

if __name__ == '__main__':
    # Bind to PORT if defined, otherwise default to 5000.
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)