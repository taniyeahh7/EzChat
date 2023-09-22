from langdetect import detect
from mtranslate import translate

#Text Translation
def detect_language(user_input):
    try:
        return detect(user_input)
    except:
        return 'en'
    
def translate_to_english(text):
    source_language = detect_language(text)
    if source_language == 'en':
        return text, source_language
    else:
        try:
            translated_text = translate(text, 'en', source_language)
            return translated_text, source_language
        except Exception as e:
            print(f"Translation error: {str(e)}")
            return text, source_language 

def translate_to_user_language(text, user_language):
    if user_language == 'en':
        return text 
    else:
        try:
            translated_text = translate(text, user_language, 'en')
            return translated_text
        except Exception as e:
            print(f"Translation error: {str(e)}")
            return text