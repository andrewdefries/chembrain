from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def webprint():
    return render_template('base.html')

if __name__ == '__main__':
    app.run(port=8005)