from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from chat import get_response

from translation import translate_to_english, translate_to_user_language

app = Flask(__name__)
CORS(app)

@app.get("/")
def index_get():
    return render_template("base.html")

@app.post("/predict")
def predict():
    text = request.get_json().get("message")
    en_text, user_lang = translate_to_english(text)
    print(en_text)
    response = get_response(en_text)
    user_lang_text = translate_to_user_language(response, user_lang)
    print(user_lang_text)
    message = {"answer": user_lang_text}
    return jsonify(message)


if __name__ == "__main__":
    app.run(debug=False)


